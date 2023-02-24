import React, { useEffect, useState } from "react";
import useRequest from "../../hooks/useRequest";
import { useAppSelector } from "../../store/hooks";
import { Role, SideBarCurrent } from "../../utils/enums";
import ChangePassword from "../ChangePassword";
import SideBar from "../SideBar";

type Props = {};

const Student = (props: Props) => {
  const user = useAppSelector((state) => state.users.user);
  const [examsCount, setExamsCount] = useState(0);
  const [subjectClassesCount, setSubjectClassesCount] = useState(0);
  const [futureExamsCount, setFutureExamsCount] = useState(0);
  const [subjectTeachers, setSubjectTeachers] = useState<string[]>([]);
  const { doRequest: getSubjectClasses } = useRequest({
    url: `/api/students/subject-classes?userId=${user!.id}`,
    method: "get",
    onSuccess: (data) => setSubjectClassesCount(data.data.length),
  });
  const { doRequest: getSubjectTeacher } = useRequest({
    url: `/api/teachers`,
    method: "get",
  });

  const { doRequest: getExamsByDate } = useRequest({
    url: `/api/exams-by-student?student=${user!.id}`,
    method: "get",
    onSuccess: (data) => {
      const filteredFuture = data.data.exams.filter(
        (exam: any) =>
          new Date(exam.startTime) > new Date() &&
          new Date(exam.startTime).getDay() === new Date().getDay()
      );
      const filteredCurrent = data.data.exams.filter(
        (exam: any) =>
          new Date(new Date(exam.startTime).getTime() + exam.duration * 60000) >
            new Date() && new Date(exam.startTime) < new Date()
      );
      setFutureExamsCount(filteredFuture.length);
      setExamsCount(filteredCurrent.length);
    },
  });
  useEffect(() => {
    (async () => {
      await getExamsByDate();
      await getSubjectClasses();
      const sts = await Promise.all(
        user!.subjectClasses.map(async (s) => {
          const { data, errors: e } = await getSubjectTeacher(
            {},
            `?subjectClasses=${s.id}`
          );
          if (e.length === 0) {
            return data.data.teachers?.[0].name;
          }
        })
      );
      setSubjectTeachers(sts);
    })();
  }, []);
  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Dashboard} role={Role.STUDENT} />
      <div className="px-2 md:px-6 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome {user?.name}</h1>
        <div className="mt-5">
          <h1 className="text-xl md:text-2xl font-bold">Stats</h1>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-2">
            <div className="rounded-md bg-pink-200 text-center py-6">
              <h2 className="text-xl text-pink-500">
                <span className="font-semibold text-3xl">{examsCount}</span>{" "}
                Exam(s) been written now
              </h2>
            </div>
            <div className="rounded-md bg-green-200 text-center py-6">
              <h2 className="text-xl text-green-500">
                <span className="font-semibold text-3xl">
                  {subjectClassesCount}
                </span>{" "}
                Subject(s)
              </h2>
            </div>
            <div className="rounded-md bg-green-200 text-center py-6">
              <h2 className="text-xl text-green-500">
                <span className="font-semibold text-3xl">
                  {futureExamsCount}
                </span>{" "}
                Exam(s) to be written today
              </h2>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h1 className="text-xl md:text-2xl font-bold">Subjects</h1>
          <div className="mt-5">
            <div className="mb-2 rounded-md bg-gray-200 text-gray-600 px-5 py-4">
              <h2>SUBJECT NAME - TEACHER</h2>
            </div>
            {user?.subjectClasses.map((s, i) => (
              <div
                key={s.id}
                className={`${
                  i % 2 === 1 && "bg-gray-100"
                } cursor-pointer hover:bg-gray-100 rounded-md text-gray-600 px-5 py-4 flex-col mb-2`}
              >
                <h2 className="text-black text-lg font-bold">
                  {s.subject.name}
                </h2>
                <h4 className="text-sm">{subjectTeachers?.[i]}</h4>
              </div>
            ))}
          </div>
        </div>
        <ChangePassword />
      </div>
    </div>
  );
};

export default Student;
