import React, { useEffect, useState } from "react";
import useRequest from "../../hooks/useRequest";
import { useAppSelector } from "../../store/hooks";
import { Role, SideBarCurrent } from "../../utils/enums";
import { IExam, IResult } from "../../utils/typings.d";
import SideBar from "../SideBar";

type Props = {
  exam: IExam;
};

const FormerExam = ({ exam }: Props) => {
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
      console.log(data);
      console.log(exam.questions);
    })();
  }, []);

  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Exams} role={Role.STUDENT} />
      <div className="px-2 md:px-6 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold">{exam.name}</h1>

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
          {result ? (
            <div className="mt-5">
              <h1 className="font-bold text-lg">
                Score: {result?.marks} / {exam.questions.length}
              </h1>
              <div className="space-y-2">
                {exam.questions.map((q, index) =>
                  result.correctQuestions.findIndex(
                    (cq) => cq.questionId === q.id
                  ) > -1 ? (
                    <div
                      key={q.id}
                      className="flex flex-col space-y-2 rounded-md border-green-400 p-2 border-2"
                    >
                      <p>
                        <span className="font-semibold">{index + 1}.</span>{" "}
                        {q.question}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div
                          className={`${
                            result.correctQuestions.findIndex(
                              (cq) =>
                                cq.questionId === q.id &&
                                cq.optionPicked === "A"
                            ) > -1 && "bg-green-500 border-green-500 text-white"
                          } w-full border-blue-400 border px-3 py-1 rounded`}
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
                            result.correctQuestions.findIndex(
                              (cq) =>
                                cq.questionId === q.id &&
                                cq.optionPicked === "B"
                            ) > -1 && "bg-green-500 border-green-500 text-white"
                          } w-full border-blue-400 border px-3 py-1 rounded`}
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
                            result.correctQuestions.findIndex(
                              (cq) =>
                                cq.questionId === q.id &&
                                cq.optionPicked === "C"
                            ) > -1 && "bg-green-500 border-green-500 text-white"
                          } w-full border-blue-400 border px-3 py-1 rounded`}
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
                            result.correctQuestions.findIndex(
                              (cq) =>
                                cq.questionId === q.id &&
                                cq.optionPicked === "D"
                            ) > -1 && "bg-green-500 border-green-500 text-white"
                          } w-full border-blue-400 border px-3 py-1 rounded`}
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
                  ) : (
                    <div
                      key={q.id}
                      className="flex flex-col space-y-2 rounded-md border-red-400 p-2 border-2"
                    >
                      <p>
                        <span className="font-semibold">{index + 1}.</span>{" "}
                        {q.question}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div
                          className={`${
                            result.incorrectQuestions.findIndex(
                              (cq) =>
                                cq.questionId === q.id &&
                                cq.optionPicked === "A"
                            ) > -1 && "bg-red-500 border-red-500 text-white"
                          } ${
                            q.correctOption === "A" &&
                            "bg-green-500 border-green-500 text-white"
                          } w-full border-blue-400 border px-3 py-1 rounded`}
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
                            result.incorrectQuestions.findIndex(
                              (cq) =>
                                cq.questionId === q.id &&
                                cq.optionPicked === "B"
                            ) > -1 && "bg-red-500 border-red-500 text-white"
                          } ${
                            q.correctOption === "B" &&
                            "bg-green-500 border-green-500 text-white"
                          } w-full border-blue-400 border px-3 py-1 rounded`}
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
                            result.incorrectQuestions.findIndex(
                              (cq) =>
                                cq.questionId === q.id &&
                                cq.optionPicked === "C"
                            ) > -1 && "500 border-red-500 text-white"
                          } ${
                            q.correctOption === "C" &&
                            "bg-green-500 border-green-500 text-white"
                          } w-full border-blue-400 border px-3 py-1 rounded`}
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
                            result.incorrectQuestions.findIndex(
                              (cq) =>
                                cq.questionId === q.id &&
                                cq.optionPicked === "D"
                            ) > -1 && "bg-red-500 border-red-500 text-white"
                          } ${
                            q.correctOption === "D" &&
                            "bg-green-500 border-green-500 text-white"
                          } w-full border-blue-400 border px-3 py-1 rounded`}
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
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <h1 className="font-bold text-lg">You did not take this exam</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormerExam;
