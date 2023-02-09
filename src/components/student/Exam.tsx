import React, { useEffect, useState } from "react";
import useRequest from "../../hooks/useRequest";
import { IExam } from "../../utils/typings.d";
import CurrentExam from "./CurrentExam";
import ScheduledExam from "./ScheduledExam";

type Props = {
  examId: string;
};

const Exam = ({ examId }: Props) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentExam, setCurrentExam] = useState<IExam>();
  const { doRequest: getExamById } = useRequest({
    url: `/api/exams`,
    method: "get",
    onSuccess: (data) => setCurrentExam(data.data),
  });
  useEffect(() => {
    (async () => {
      await getExamById({}, `/${examId}`);
    })();
  }, []);
  useEffect(() => {
    const findTimeLeft = () => {
      if (!currentExam) return;
      const msLeft =
        new Date((currentExam as IExam).startTime).getTime() -
        new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, [currentExam]);
  const display = (currentExam: IExam) => {
    console.log(timeLeft);
    if (timeLeft < 0)
      return <CurrentExam timeLeft={timeLeft} exam={currentExam} />;
    else return <ScheduledExam timeLeft={timeLeft} exam={currentExam} />;
  };
  return currentExam ? display(currentExam) : <div>Loading...</div>;
};

export default Exam;
