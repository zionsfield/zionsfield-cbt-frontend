import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { LinkRoutes, Option, Role, SideBarCurrent } from "../../utils/enums";
import SideBar from "../SideBar";
import { Link, useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { IError, ISubjectClass } from "../../utils/typings.d";
import Question from "../Question";
import { deleteSavedExam, padZero } from "../../utils";
import { useAppSelector } from "../../store/hooks";

type Props = {
  fakeId: string;
};

interface FormData {
  questionNumber: number;
  duration: number;
  name: string;
  subjectClass: string;
  questions: {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: Option;
  }[];
  startTime: string;
}

const NewExam = ({ fakeId }: Props) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.users.user);
  const [questions, setQuestions] = useState<any[]>([]);
  const nameRef = useRef<HTMLInputElement>(null!);
  const subjectClassRef = useRef<HTMLSelectElement>(null!);
  const questionNumberRef = useRef<HTMLInputElement>(null!);
  const durationRef = useRef<HTMLInputElement>(null!);
  const startTimeRef = useRef<HTMLInputElement>(null!);
  const [questionObjs, setQuestionObjs] = useState<any[]>([]);
  const { doRequest: newExam } = useRequest({
    url: "/api/exams",
    method: "post",
  });
  const { doRequest: getSubjectClasses } = useRequest({
    url: `/api/teachers/subject-classes?userId=${user!.id}`,
    method: "get",
  });
  const [newExamErrors, setNewExamErrors] = useState<IError[]>([]);
  const [subjectClasses, setSubjectClasses] = useState<ISubjectClass[]>([]);
  useEffect(() => {
    (async () => {
      const { data, errors } = await getSubjectClasses();
      setSubjectClasses(data.data.subjectClasses);
      const cachedExams = localStorage.getItem("exams");
      if (cachedExams) {
        const examsCached: any[] = JSON.parse(cachedExams);
        const foundExamIndex = examsCached.findIndex(
          (e) => e.fakeId === fakeId
        );
        if (foundExamIndex == -1) return;
        const foundExam = examsCached[foundExamIndex];
        if (nameRef?.current) {
          nameRef.current.value = foundExam.name;
        }
        if (subjectClassRef?.current) {
          subjectClassRef.current.value = foundExam.subjectClass;
        }
        if (questionNumberRef?.current) {
          questionNumberRef.current.value = foundExam.questionNumber;
        }
        if (durationRef?.current) {
          durationRef.current.value = foundExam.duration;
        }
        if (startTimeRef?.current) {
          startTimeRef.current.value = foundExam.startTime;
        }
      }
    })();
  }, []);
  const displayError = (errors: IError[], field?: string) => {
    if (errors.findIndex((e) => e.field === "name") > -1) {
      nameRef.current.style.borderColor = "rgb(239, 68, 68)";
    } else if (
      errors.findIndex((e) => e.field === "name") === -1 &&
      errors.length > 0
    ) {
      nameRef.current.style.borderColor = "rgb(156, 163, 175)";
    }
    return newExamErrors
      .filter((e) => e.field === field)
      .map((e, i) => (
        <p className="text-red-500 font-semibold text-xs" key={i + 1}>
          {e.message}
        </p>
      ));
  };
  const saveChanges = (e: any) => {
    e.preventDefault();

    const formData: FormData = {
      name: nameRef.current.value,
      subjectClass: subjectClassRef.current.value,
      questions: questionObjs,
      startTime: startTimeRef.current.value,
      questionNumber: parseInt(questionNumberRef.current.value),
      duration: parseInt(durationRef.current.value),
    };

    const cachedExams = localStorage.getItem("exams");
    if (!cachedExams) {
      localStorage.setItem("exams", JSON.stringify([{ fakeId, ...formData }]));
    } else {
      const examsCached: any[] = JSON.parse(cachedExams);
      const foundExamIndex = examsCached.findIndex((e) => e.fakeId === fakeId);
      if (foundExamIndex > -1)
        examsCached[foundExamIndex] = { fakeId, ...formData };
      else examsCached.push({ fakeId, ...formData });
      localStorage.setItem("exams", JSON.stringify(examsCached));
    }
    console.log(formData);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    const st1 = new Date(startTimeRef.current.value);
    const formData: FormData = {
      name: nameRef.current.value,
      subjectClass: subjectClassRef.current.value,
      questions: questionObjs,
      startTime: st1.toUTCString(),
      questionNumber: parseInt(questionNumberRef.current.value),
      duration: parseInt(durationRef.current.value),
    };
    console.log(formData);
    if (new Date(formData.startTime) < new Date()) {
      setNewExamErrors([{ message: "Exam cannot be scheduled for the past" }]);
      return;
    }
    if (formData.questions.length != formData.questionNumber) {
      setNewExamErrors([{ message: "Questions Not Complete" }]);
      return;
    }

    const { data, errors } = await newExam(formData);
    console.log(errors);
    setNewExamErrors(errors);
    if (errors.length === 0) {
      deleteSavedExam(fakeId);
      navigate(LinkRoutes.DASHBOARD);
      window.location.reload();
    }
  };

  const addQuestions = (e: any) => {
    e.preventDefault();
    setQuestions(new Array(parseInt(questionNumberRef.current.value)).fill(1));
    const newNo = parseInt(questionNumberRef.current.value);
    const qObjsLength = questionObjs.length;
    if (newNo > qObjsLength) {
      const newQs = new Array(newNo - qObjsLength).fill(1);
      setQuestionObjs((prev) => [...prev, ...newQs]);
    } else if (newNo < qObjsLength) {
      setQuestionObjs((prev) => prev.slice(0, newNo));
    } else {
      // setQuestionObjs(
      //   new Array(parseInt(questionNumberRef.current.value)).fill(1)
      // );
    }
  };

  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Exams} role={Role.TEACHER} />
      <div className="px-2 md:px-6 flex-1">
        <Link
          to={LinkRoutes.DASHBOARD}
          onClick={() => window.location.reload()}
        >
          <button className="flex space-x-2 font-bold items-center">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to exams</span>
          </button>
        </Link>
        <div className="mt-5">
          <h1 className="font-bold text-xl md:text-2xl">Create new exam</h1>
          <form className="space-y-10 mt-3" onSubmit={submit}>
            <div className="space-y-5">
              <div className="">
                <input
                  ref={nameRef}
                  type="text"
                  placeholder="Exam Name"
                  className={`focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full md:w-[70%] mx-auto border-b-2 border-gray-400`}
                />
                {displayError(newExamErrors, "name")}
              </div>
              <div>
                <select
                  ref={subjectClassRef}
                  className={`focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-3 py-2 w-full md:w-[70%] mx-auto border-b-2 border-gray-400`}
                >
                  {subjectClasses.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.class.className} {sc.subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="">
                <input
                  // min="2023-02-09T10:37:00"
                  min={`${new Date().toISOString().split("T")[0]}T${padZero(
                    new Date().getHours()
                  )}:${padZero(new Date().getMinutes())}:00`}
                  ref={startTimeRef}
                  type="datetime-local"
                  placeholder="Exam Name"
                  className={`focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full md:w-[70%] mx-auto border-b-2 border-gray-400`}
                />
                {displayError(newExamErrors, "startTime")}
              </div>
              <div className="flex md:space-x-2 flex-col md:flex-row space-y-2 md:space-y-0">
                <input
                  ref={durationRef}
                  type="number"
                  placeholder="Duration (in minutes)"
                  className={`focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full mx-auto border-b-2 border-gray-400`}
                />
                <input
                  ref={questionNumberRef}
                  type="number"
                  placeholder="Question Number"
                  className={`focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full mx-auto border-b-2 border-gray-400`}
                />
              </div>
            </div>
            <div>
              <button
                onClick={addQuestions}
                className="cursor-pointer w-full md:w-[70%] bg-green-500 rounded-md px-3 py-2 text-white shadow-md"
              >
                Add Questions
              </button>
            </div>
            <div className="space-y-2">
              {questions.map((q, i) => (
                <Question
                  questionObjs={questionObjs}
                  key={i + 1}
                  index={i}
                  setQuestionObjs={setQuestionObjs}
                  fakeId={fakeId}
                />
              ))}
            </div>
            {displayError(newExamErrors)}
            <div className="flex md:space-x-2 flex-col md:flex-row space-y-2 md:space-y-0">
              <input
                value="Create Exam"
                type="submit"
                className="cursor-pointer w-full bg-black rounded-md px-3 py-2 text-white shadow-md"
              />
              <button
                onClick={saveChanges}
                className="cursor-pointer md:w-[30%] bg-blue-400 rounded-md px-3 py-2 text-white shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewExam;
