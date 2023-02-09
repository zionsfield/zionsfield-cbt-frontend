import React, { useEffect } from "react";
import { Role, SideBarCurrent } from "../../utils/enums";
import { IExam } from "../../utils/typings.d";
import SideBar from "../SideBar";

type Props = {
  exam: IExam;
  timeLeft: number;
};

const ScheduledExam = ({ exam, timeLeft }: Props) => {
  // useEffect(() => {
  //   console.log(exam);
  // }, []);
  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Exams} role={Role.STUDENT} />
      <div className="px-2 md:px-6 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold">{exam.name}</h1>
        <div className="mt-5 flex flex-col items-center">
          <span>
            Exam scheduled for {new Date(exam.startTime).toDateString()}{" "}
            {new Date(exam.startTime).toLocaleTimeString()}
          </span>
          <span>
            Exam will start in {Math.floor(timeLeft / 60)} minutes{" "}
            {timeLeft % 60} seconds
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScheduledExam;
