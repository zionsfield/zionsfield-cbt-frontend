import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { useAppSelector } from "../../store/hooks";
import { getObjectFromQuery, getQueryFromObject } from "../../utils/api";
import { LinkRoutes, Role, SideBarCurrent } from "../../utils/enums";
import { IExam, ITerm } from "../../utils/typings.d";
import SideBar from "../SideBar";
import FormerExam from "./FormerExam";
import NewExam from "./newExam";

type Props = {};

const TeacherExams = (props: Props) => {
  const user = useAppSelector((state) => state.users.user);
  const [exams, setExams] = useState<IExam[]>([]);
  const [savedExams, setSavedExams] = useState<any[]>([]);
  // const [examsCount, setExamsCount] = useState(0);
  const [currentExams, setCurrentExams] = useState<IExam[]>([]);
  const [formerExams, setFormerExams] = useState<IExam[]>([]);
  const searchRef = useRef<HTMLInputElement>(null!);
  const navigate = useNavigate();
  const [terms, setTerms] = useState<ITerm[]>([]);
  const { doRequest: getTerms } = useRequest({
    url: "/api/terms",
    method: "get",
    onSuccess: (data) => setTerms(data.data),
  });
  const { doRequest: getExams } = useRequest({
    url: `/api/exams-by-teacher?teacher=${user!.id}`,
    method: "get",
    onSuccess: (data) => {
      console.log(data.data);
      setExams(
        data.data.exams.filter(
          (exam: any) => new Date(exam.startTime) > new Date()
        )
      );
      setCurrentExams(
        data.data.exams.filter(
          (exam: any) =>
            new Date(
              new Date(exam.startTime).getTime() + exam.duration * 60000
            ) > new Date() && new Date(exam.startTime) < new Date()
        )
      );
      setFormerExams(
        data.data.exams.filter(
          (exam: any) =>
            new Date(
              new Date(exam.startTime).getTime() + exam.duration * 60000
            ) < new Date()
        )
      );
    },
  });

  useEffect(() => {
    (async () => {
      await loadExams();
      await getTerms();
      const cachedExams = localStorage.getItem("exams");
      if (cachedExams) {
        const examsCached: any[] = JSON.parse(cachedExams);
        setSavedExams(examsCached);
      }
    })();
  }, []);
  const toNew = (fakeId?: string) => {
    const query = window.location.search;
    const queryObj = getObjectFromQuery(query);
    queryObj["new"] = true;
    fakeId && (queryObj["fakeId"] = fakeId);
    const newQuery = getQueryFromObject(queryObj);
    return newQuery;
  };
  const loadExams = async () => {
    const query = window.location.search;
    const queryObj = getObjectFromQuery(query);

    const newQuery = getQueryFromObject({
      ...queryObj,
      name: searchRef?.current?.value,
    });

    navigate(`${LinkRoutes.DASHBOARD}?${newQuery}`);
    await getExams(
      {},
      `${searchRef?.current?.value && `&${searchRef?.current?.value}`}`
    );
  };
  const toResult = (examId: string) => {
    let queryObj = getObjectFromQuery(window.location.search);
    queryObj = {
      examId,
      result: true,
    };
    return getQueryFromObject(queryObj);
  };
  const display = () => {
    if (getObjectFromQuery(window.location.search)["result"]) {
      const examId = getObjectFromQuery(window.location.search)["examId"];
      return <FormerExam examId={examId} />;
    } else if (getObjectFromQuery(window.location.search)["new"])
      return (
        <NewExam
          fakeId={
            getObjectFromQuery(window.location.search)["fakeId"] ||
            Math.random().toString()
          }
        />
      );
    return (
      <div className="flex mt-5">
        <div className="fixed bottom-3 right-3 md:right-5">
          <button
            onClick={() => navigate(`${LinkRoutes.DASHBOARD}?${toNew()}`)}
            className="bg-blue-500 text-center text-white px-4 py-3 rounded-full z-50"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <SideBar current={SideBarCurrent.Exams} role={Role.TEACHER} />
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
                <h2 className="font-semibold text-lg">Saved Exams</h2>
              </div>
              {savedExams.map((exam, i) => (
                <div
                  key={i + 1}
                  onClick={() =>
                    navigate(`${LinkRoutes.DASHBOARD}?${toNew(exam.fakeId)}`)
                  }
                  className={`${
                    i % 2 === 1 && "bg-gray-100"
                  } cursor-pointer hover:bg-gray-100 rounded-md text-gray-600 px-5 py-4 flex-col mb-2`}
                >
                  <h2 className="text-black text-lg font-bold">{exam.name}</h2>
                  <h4 className="text-sm">
                    {exam.startTime
                      ? `${new Date(exam.startTime).toDateString()} ${new Date(
                          exam.startTime
                        ).toLocaleTimeString()}`
                      : "No Date Set"}
                  </h4>
                </div>
              ))}
              <div>
                <h2 className="font-semibold text-lg">Current Exams</h2>
              </div>
              {currentExams.map((exam, i) => (
                <div
                  key={exam.id}
                  className={`${
                    i % 2 === 1 && "bg-gray-100"
                  } cursor-pointer hover:bg-gray-100 rounded-md text-gray-600 px-5 py-4 flex-col mb-2`}
                >
                  <h2 className="text-black text-lg font-bold">{exam.name}</h2>
                  <h4 className="text-sm">
                    {new Date(exam.startTime).toDateString()}{" "}
                    {new Date(exam.startTime).toLocaleTimeString()} -{" "}
                    {new Date(
                      new Date(exam.startTime).getTime() + exam.duration * 60000
                    ).toLocaleTimeString()}
                  </h4>
                </div>
              ))}
              <div>
                <h2 className="font-semibold text-lg">Scheduled Exams</h2>
              </div>
              {exams.map((exam, i) => (
                <div
                  key={exam.id}
                  className={`${
                    i % 2 === 1 && "bg-gray-100"
                  } cursor-pointer hover:bg-gray-100 rounded-md text-gray-600 px-5 py-4 flex-col mb-2`}
                >
                  <h2 className="text-black text-lg font-bold">{exam.name}</h2>
                  <h4 className="text-sm">
                    {new Date(exam.startTime).toDateString()}{" "}
                    {new Date(exam.startTime).toLocaleTimeString()} -{" "}
                    {new Date(
                      new Date(exam.startTime).getTime() + exam.duration * 60000
                    ).toLocaleTimeString()}
                  </h4>
                </div>
              ))}
              <div>
                <h2 className="font-semibold text-lg">Past Exams</h2>
              </div>
              {terms.map((term) => (
                <div key={term.id}>
                  <p className="font-bold text-lg cursor-pointer">
                    {term.startYear}/{term.endYear} Term {term.term}
                  </p>
                  {formerExams
                    .filter((e) => e.term.id === term.id)
                    .map((exam, i) => (
                      <div
                        onClick={() =>
                          navigate(
                            `${LinkRoutes.DASHBOARD}/?${toResult(exam.id)}`
                          )
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

export default TeacherExams;
