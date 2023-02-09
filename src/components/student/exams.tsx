import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { useAppSelector } from "../../store/hooks";
import { getObjectFromQuery, getQueryFromObject } from "../../utils/api";
import { LinkRoutes, Role, SideBarCurrent } from "../../utils/enums";
import { IExam } from "../../utils/typings.d";
import SideBar from "../SideBar";
import Exam from "./Exam";

type Props = {};

const StudentExams = (props: Props) => {
  const user = useAppSelector((state) => state.users.user);
  const [exams, setExams] = useState<IExam[]>([]);

  const [currentExams, setCurrentExams] = useState<IExam[]>([]);
  const [formerExams, setFormerExams] = useState<IExam[]>([]);
  const searchRef = useRef<HTMLInputElement>(null!);
  const navigate = useNavigate();
  const { doRequest: getExams } = useRequest({
    url: `/api/exams-by-student?student=${user!.id}`,
    method: "get",
    onSuccess: (data) => {
      console.log();
      setExams(
        data.data.filter(
          (exam: any) => exam.startTime > new Date().toISOString()
        )
      );
      setCurrentExams(
        data.data.filter(
          (exam: any) =>
            new Date(
              new Date(exam.startTime).getTime() + exam.duration * 60000
            ).toISOString() > new Date().toISOString() &&
            exam.startTime < new Date().toISOString()
        )
      );
      setFormerExams(
        data.data.filter(
          (exam: any) =>
            new Date(
              new Date(exam.startTime).getTime() + exam.duration * 60000
            ).toISOString() < new Date().toISOString()
        )
      );
    },
  });

  useEffect(() => {
    (async () => {
      await loadExams();
    })();
  }, []);

  const loadExams = async () => {
    const query = window.location.search;
    let queryObj = getObjectFromQuery(query);
    queryObj = getQueryFromObject({
      name: searchRef?.current?.value,
    });
    console.log(queryObj);

    const newQuery = getQueryFromObject({
      ...queryObj,
      name: searchRef?.current?.value,
    });

    navigate(`${LinkRoutes.DASHBOARD}?${queryObj}`);
    await getExams(
      {},
      `${queryObj ? `&${queryObj}` : ""}`
      // `${
      //   searchRef?.current?.value !== undefined &&
      //   `&${searchRef?.current?.value}`
      // }`
    );
  };
  const toExam = (examId: string) => {
    let queryObj = getObjectFromQuery(window.location.search);
    queryObj = {
      examId,
    };
    return getQueryFromObject(queryObj);
  };
  const display = () => {
    if (getObjectFromQuery(window.location.search)["examId"]) {
      const examId = getObjectFromQuery(window.location.search)["examId"];
      return <Exam examId={examId} />;
    } else
      return (
        <div className="flex mt-5">
          <SideBar current={SideBarCurrent.Exams} role={Role.STUDENT} />
          <div className="px-2 md:px-6 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">Exams</h1>
            <div className="mt-10">
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search any exam..."
                  className={`focus:border-blue-500 flex-1 shadow-md transition duration-300 ease-in outline-none px-5 py-2 w-full md:w-[70%] mx-auto border border-gray-400 rounded-md`}
                />
                <button
                  onClick={loadExams}
                  className="flex-1 bg-blue-500 rounded-md px-3 py-2 text-white shadow-md"
                >
                  Search
                </button>
              </div>
              <div className="mt-5">
                <div className="mb-2 rounded-md bg-gray-200 text-gray-600 px-5 py-4">
                  <h2>EXAM NAME - START TIME</h2>
                </div>

                <div>
                  <h2 className="font-semibold text-lg">Current Exams</h2>
                </div>
                {currentExams.map((exam, i) => (
                  <div
                    onClick={() =>
                      navigate(`${LinkRoutes.DASHBOARD}/?${toExam(exam.id)}`)
                    }
                    key={exam.id}
                    className={`${
                      i % 2 === 1 && "bg-gray-100"
                    } cursor-pointer hover:bg-gray-100 rounded-md text-gray-600 px-5 py-4 flex-col mb-2`}
                  >
                    <h2 className="text-black text-lg font-bold">
                      {exam.name}
                    </h2>
                    <h4 className="text-sm">
                      {new Date(exam.startTime).toDateString()}{" "}
                      {new Date(exam.startTime).toLocaleTimeString()} -{" "}
                      {new Date(
                        new Date(exam.startTime).getTime() +
                          exam.duration * 60000
                      ).toLocaleTimeString()}
                    </h4>
                  </div>
                ))}
                <div>
                  <h2 className="font-semibold text-lg">Scheduled Exams</h2>
                </div>
                {exams.map((exam, i) => (
                  <div
                    onClick={() =>
                      navigate(`${LinkRoutes.DASHBOARD}/?${toExam(exam.id)}`)
                    }
                    key={exam.id}
                    className={`${
                      i % 2 === 1 && "bg-gray-100"
                    } cursor-pointer hover:bg-gray-100 rounded-md text-gray-600 px-5 py-4 flex-col mb-2`}
                  >
                    <h2 className="text-black text-lg font-bold">
                      {exam.name}
                    </h2>
                    <h4 className="text-sm">
                      {new Date(exam.startTime).toDateString()}{" "}
                      {new Date(exam.startTime).toLocaleTimeString()} -{" "}
                      {new Date(
                        new Date(exam.startTime).getTime() +
                          exam.duration * 60000
                      ).toLocaleTimeString()}
                    </h4>
                  </div>
                ))}
                <div>
                  <h2 className="font-semibold text-lg">Former Exams</h2>
                </div>
                {formerExams.map((exam, i) => (
                  <div
                    key={exam.id}
                    className={`${
                      i % 2 === 1 && "bg-gray-100"
                    } cursor-pointer hover:bg-gray-100 rounded-md text-gray-600 px-5 py-4 flex-col mb-2`}
                  >
                    <h2 className="text-black text-lg font-bold">
                      {exam.name}
                    </h2>
                    <h4 className="text-sm">
                      {new Date(exam.startTime).toDateString()}{" "}
                      {new Date(exam.startTime).toLocaleTimeString()} -{" "}
                      {new Date(
                        new Date(exam.startTime).getTime() +
                          exam.duration * 60000
                      ).toLocaleTimeString()}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
  };
  return display();
};

export default StudentExams;
