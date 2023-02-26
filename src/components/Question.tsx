import React, { useEffect, useState } from "react";

type Props = {
  index: number;
  setQuestionObjs: React.Dispatch<React.SetStateAction<any[]>>;
  questionObjs: any[];
  fakeId: string;
};

const Question = ({ setQuestionObjs, index, questionObjs, fakeId }: Props) => {
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("A");
  useEffect(() => {
    const cachedExams = localStorage.getItem("exams");
    if (cachedExams) {
      const examsCached: any[] = JSON.parse(cachedExams);
      const foundExamIndex = examsCached.findIndex((e) => e.fakeId === fakeId);
      if (foundExamIndex > -1) {
        const foundExam = examsCached[foundExamIndex];
        if (foundExam.questions[index]) {
          setQuestion(foundExam.questions[index].question);
          setOptionA(foundExam.questions[index].optionA);
          setOptionB(foundExam.questions[index].optionB);
          setOptionC(foundExam.questions[index].optionC);
          setOptionD(foundExam.questions[index].optionD);
          setCorrectOption(foundExam.questions[index].correctOption);
          setQuestionObjs((prev) => {
            prev[index] = {
              question: foundExam.questions[index].question,
              optionA: foundExam.questions[index].optionA,
              optionB: foundExam.questions[index].optionB,
              optionC: foundExam.questions[index].optionC,
              optionD: foundExam.questions[index].optionD,
              correctOption: foundExam.questions[index].correctOption,
            };
            return prev;
          });
        }
      }
    }
  }, []);
  useEffect(() => {
    setQuestionObjs((prev) => {
      prev[index] = {
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
      };
      return prev;
    });
  }, [question, optionA, optionB, optionC, optionD, correctOption]);

  return (
    <div className="flex flex-col space-y-2 rounded-md border-blue-400 p-2 border-2">
      <div className="flex">
        <h2 className="font-semibold text-lg flex-1">Question {index + 1}</h2>
        <select
          defaultValue={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
          className={`focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-3 py-2 mx-auto border-b-2 border-gray-400`}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>
      <div className="">
        <input
          defaultValue={question}
          onChange={(e) => setQuestion(e.target.value)}
          type="text"
          placeholder="Question"
          className={`focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full mx-auto border-b-2 border-gray-400`}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border">
        <input
          defaultValue={optionA}
          onChange={(e) => setOptionA(e.target.value)}
          type="text"
          placeholder="Option A"
          className={`focus:border-blue-500 w-full transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 mx-auto border-b-2 border-gray-400`}
        />
        <input
          defaultValue={optionB}
          onChange={(e) => setOptionB(e.target.value)}
          type="text"
          placeholder="Option B"
          className={`focus:border-blue-500 w-full transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 mx-auto border-b-2 border-gray-400`}
        />
        <input
          defaultValue={optionC}
          onChange={(e) => setOptionC(e.target.value)}
          type="text"
          placeholder="Option C"
          className={`focus:border-blue-500 w-full transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 mx-auto border-b-2 border-gray-400`}
        />
        <input
          defaultValue={optionD}
          onChange={(e) => setOptionD(e.target.value)}
          type="text"
          placeholder="Option D"
          className={`focus:border-blue-500 w-full transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 mx-auto border-b-2 border-gray-400`}
        />
      </div>
    </div>
  );
};

export default Question;
