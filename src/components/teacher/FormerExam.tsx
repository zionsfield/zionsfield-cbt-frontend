import React, { useEffect, useRef, useState } from "react";
import useRequest from "../../hooks/useRequest";
import { useAppSelector } from "../../store/hooks";
import { padZero } from "../../utils";
import { Role, SideBarCurrent } from "../../utils/enums";
import { IError, IExam, IResult, UserState } from "../../utils/typings.d";
import SideBar from "../SideBar";

type Props = {
  examId: IExam;
};

const FormerExam = ({ examId }: Props) => {
  const user = useAppSelector((state) => state.users.user);
  const [exam, setExam] = useState<IExam>();
  // const [result, setResult] = useState<IResult>();
  const [results, setResults] = useState<IResult[]>([]);
  const [students, setStudents] = useState<UserState[]>([]);
  const { doRequest: getStudents } = useRequest({
    url: `/api/students-by-subject-class`,
    method: "get",
  });
  const { doRequest: getResult } = useRequest({
    url: `/api/students/results?examId=${exam?.id}`,
    method: "get",
    // onSuccess: (data) => setResult(data.data),
  });

  const { doRequest: getExamById } = useRequest({
    url: `/api/exams`,
    method: "get",
    onSuccess: (data) => setExam(data.data),
  });
  useEffect(() => {
    (async () => {
      await getExamById({}, `/${examId}`);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!exam) return;
      const { data, errors } = await getStudents(
        {},
        `?subjectClass=${exam?.subjectClass.id}`
      );
      if (errors.length === 0) {
        setStudents(data.data);
        const arr = await Promise.all(
          data.data.map(async (u: UserState) => {
            const { data: r, errors: e } = await getResult(
              {},
              `&studentId=${u?.id}`
            );
            if (e.length === 0) {
              console.log(r.data);
              return r.data;
            }
          })
        );
        console.log(arr);
        setResults(arr);
      }

      // await getResult();
      // console.log(errors);
      // console.log(data);
      console.log(exam?.questions);
    })();
  }, [exam]);

  const startTimeRef = useRef<HTMLInputElement>(null!);

  const { doRequest: rescheduleExam } = useRequest({
    url: "/api/exams/reschedule",
    method: "patch",
  });

  const displayError = (errors: IError[], field?: string) => {
    return reExamErrors
      .filter((e) => e.field === field)
      .map((e, i) => (
        <p className="text-red-500 font-semibold text-xs" key={i + 1}>
          {e.message}
        </p>
      ));
  };

  const [reExamErrors, setReExamErrors] = useState<IError[]>([]);

  const submit = async (e: any) => {
    e.preventDefault();
    const st1 = new Date(startTimeRef.current.value);
    const formData = {
      newStartTime: st1.toUTCString(),
    };
    if (new Date(formData.newStartTime) < new Date()) {
      setReExamErrors([{ message: "Exam cannot be scheduled for the past" }]);
      return;
    }
    const { data, errors } = await rescheduleExam(formData, `/${exam!.id}`);
    console.log(errors);
    setReExamErrors(errors);
    if (errors.length === 0) {
      window.location.reload();
    }
  };

  return exam ? (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Exams} role={Role.TEACHER} />
      <div className="px-2 md:px-6 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold">{exam?.name}</h1>
        <form className="space-y-5 mt-3" onSubmit={submit}>
          <div className="">
            <input
              // min="2023-02-09T10:37:00"
              min={`${new Date().toISOString().split("T")[0]}T${padZero(
                new Date().getHours()
              )}:${padZero(new Date().getMinutes())}:00`}
              ref={startTimeRef}
              type="datetime-local"
              placeholder="Exam Name"
              className={`focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full mx-auto border-b-2 border-gray-400`}
            />
            {displayError(reExamErrors, "newStartTime")}
          </div>
          {displayError(reExamErrors)}
          <div>
            <input
              value="Reschedule Exam"
              type="submit"
              className="cursor-pointer w-full bg-black rounded-md px-3 py-2 text-white shadow-md"
            />
          </div>
        </form>
        <div className="mt-5">
          <h1 className="font-bold text-xl md:text-2xl">Students</h1>
          <div
            className="mt-5 cursor-pointer mb-2 rounded-md bg-gray-200 text-gray-600
            px-5 py-4"
          >
            <h2>FULL NAME - SCORE</h2>
          </div>
          {results.map((r, i) => (
            <div
              key={i + 1}
              className={`${
                i % 2 === 1 && "bg-gray-100"
              } cursor-pointer hover:bg-gray-100 rounded-md px-5 py-4 flex items-center justify-between mb-2`}
            >
              <h2 className="text-black text-lg font-bold">
                {students[i].name}
              </h2>{" "}
              <div>
                {r ? (
                  <span>
                    <span className="font-semibold">{r.marks}</span> /{" "}
                    {exam.questionNumber}
                  </span>
                ) : (
                  <span className="font-semibold">{"N/A"}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default FormerExam;
