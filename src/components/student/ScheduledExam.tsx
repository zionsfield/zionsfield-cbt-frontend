import React, { useEffect, useState } from "react";
import useRequest from "../../hooks/useRequest";
import { useAppSelector } from "../../store/hooks";
import { Role, SideBarCurrent } from "../../utils/enums";
import { IExam, IResult } from "../../utils/typings.d";
import SideBar from "../SideBar";

type Props = {
  exam: IExam;
  timeLeft: number;
};

const ScheduledExam = ({ exam, timeLeft }: Props) => {
  const user = useAppSelector((state) => state.users.user);
  const [result, setResult] = useState<IResult>();
  const { doRequest: getResult } = useRequest({
    url: `/api/students/results?examId=${exam.id}&studentId=${user?.id}`,
    method: "get",
    onSuccess: (data) => setResult(data.data),
  });
  useEffect(() => {
    (async () => {
      const { data, errors } = await getResult();
      console.log(errors);
    })();
  }, []);
  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Exams} role={Role.STUDENT} />
      <div className="px-2 md:px-6 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold">
          {exam.name} {exam.rescheduled && " (rescheduled)"}
        </h1>
        {result ? (
          <div className="mt-5 flex flex-col items-center">
            <h1 className="font-bold text-xl">
              You have already written this exam
            </h1>
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-center">
            <span>
              Exam scheduled for {new Date(exam.startTime).toDateString()}{" "}
              {new Date(exam.startTime).toLocaleTimeString()}
            </span>
            <span>
              Exam will start in {Math.floor(timeLeft / 3600)} hours{" "}
              {Math.floor((timeLeft / 60) % 60)} minutes {timeLeft % 60} seconds
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledExam;
