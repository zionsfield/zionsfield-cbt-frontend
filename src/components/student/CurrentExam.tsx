import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { useAppSelector } from "../../store/hooks";
import { IExam, IResult } from "../../utils/typings.d";

type Props = {
  exam: IExam;
};

interface OptionPicked {
  [id: string]: string;
}

const CurrentExam = ({ exam }: Props) => {
  const user = useAppSelector((state) => state.users.user);
  const [result, setResult] = useState<IResult>();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<OptionPicked>({});
  const [timeLeft, setTimeLeft] = useState(0);

  const inputSelected = (qId: string, option: string) => {
    if (timeLeft < 0) return;
    setSelected((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  const { doRequest: submitExam } = useRequest({
    url: `/api/students/submit-response`,
    method: "post",
    onSuccess: () => window.location.reload(),
  });
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
  useEffect(() => {
    const timeToSubmit = async () => {
      const endTime = new Date(
        new Date(exam.startTime).getTime() + exam.duration * 60000
      );
      const t = Math.round((endTime.getTime() - new Date().getTime()) / 1000);
      setTimeLeft(t);
      // if (t < -5) {
      //   console.log("submitting");
      //   await submit();
      // }
    };
    const timerId = setInterval(timeToSubmit, 1000);
    return () => clearInterval(timerId);
  }, [selected]);
  const submit = async () => {
    const responses = exam.questions.map((q) => ({
      examId: exam.id,
      studentId: user?.id,
      questionId: q.id,
      optionPicked: selected[q.id] ? selected[q.id] : "",
    }));
    console.log(responses);
    await submitExam({ responses });
  };
  return result ? (
    <div className="flex mt-5">
      <h1 className="font-bold text-xl">You have already written this exam</h1>
    </div>
  ) : (
    <div className="flex mt-5">
      <div className="fixed top-28 right-10">
        <span
          className={`${timeLeft <= 10 && "text-red-500"} font-bold text-lg`}
        >
          {timeLeft >= 0
            ? `${Math.floor(timeLeft / 60)} m ${timeLeft % 60} s`
            : `Submit Now`}
        </span>
      </div>
      <div className="px-2 md:px-6 flex-1">
        <h1 className="text-xl md:text-3xl font-bold">
          {exam.name} {exam.rescheduled && " (rescheduled)"}
        </h1>
        <div className="mt-5">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold">Student Details</h2>
            <p>
              Name: <span className="font-semibold">{user?.name}</span>
            </p>
            <p>
              Class:{" "}
              <span className="font-semibold">
                {exam.subjectClass.class.className}
              </span>
            </p>
            <p>
              Subject:{" "}
              <span className="font-semibold">
                {exam.subjectClass.subject.name}
              </span>
            </p>
            <p>
              Term:{" "}
              <span className="font-semibold">
                {exam.term.startYear}/{exam.term.endYear} Term {exam.term.term}
              </span>
            </p>
          </div>
          <div className="mt-5">
            <h3 className="font-bold text-xl md:text-2xl mb-2">
              Answer all questions
            </h3>
            <div className="space-y-2">
              {exam.questions.map((q, index) => (
                <div
                  key={q.id}
                  className="flex flex-col space-y-2 rounded-md border-blue-400 p-2 border-2"
                >
                  <p>
                    <span className="font-semibold">{index + 1}.</span>{" "}
                    {q.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div
                      className={`${
                        selected[q.id] === "A" && "bg-blue-400 text-white"
                      } hover:bg-blue-400 hover:text-white transition duration-300 ease-in w-full cursor-pointer border-blue-400 border px-3 py-1 rounded`}
                      onClick={() => inputSelected(q.id, "A")}
                    >
                      <input
                        defaultChecked
                        type="radio"
                        className="hidden"
                        name="subjectClass"
                      />
                      <span>{q.optionA}</span>
                    </div>
                    <div
                      className={`${
                        selected[q.id] === "B" && "bg-blue-400 text-white"
                      } hover:bg-blue-400 hover:text-white transition duration-300 ease-in w-full cursor-pointer border-blue-400 border px-3 py-1 rounded`}
                      onClick={() => inputSelected(q.id, "B")}
                    >
                      <input
                        defaultChecked
                        type="radio"
                        className="hidden"
                        name="subjectClass"
                      />
                      <span>{q.optionB}</span>
                    </div>
                    <div
                      className={`${
                        selected[q.id] === "C" && "bg-blue-400 text-white"
                      } hover:bg-blue-400 hover:text-white transition duration-300 ease-in w-full cursor-pointer border-blue-400 border px-3 py-1 rounded`}
                      onClick={() => inputSelected(q.id, "C")}
                    >
                      <input
                        defaultChecked
                        type="radio"
                        className="hidden"
                        name="subjectClass"
                      />
                      <span>{q.optionC}</span>
                    </div>
                    <div
                      className={`${
                        selected[q.id] === "D" && "bg-blue-400 text-white"
                      } hover:bg-blue-400 hover:text-white transition duration-300 ease-in w-full cursor-pointer border-blue-400 border px-3 py-1 rounded`}
                      onClick={() => inputSelected(q.id, "D")}
                    >
                      <input
                        defaultChecked
                        type="radio"
                        className="hidden"
                        name="subjectClass"
                      />
                      <span>{q.optionD}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <button
              disabled={timeLeft > 0}
              onClick={submit}
              className={`${
                timeLeft <= 0 && "cursor-pointer"
              } w-full bg-black rounded-md px-3 py-2 text-white shadow-md`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentExam;
