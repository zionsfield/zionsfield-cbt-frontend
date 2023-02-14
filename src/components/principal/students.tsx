import {
  faArrowLeft,
  faArrowRight,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { getObjectFromQuery, getQueryFromObject } from "../../utils/api";
import { LinkRoutes, Role, SideBarCurrent } from "../../utils/enums";
import { UserState } from "../../utils/typings.d";
import SideBar from "../SideBar";
import EditStudent from "./editStudent";
import NewStudent from "./newStudent";

type Props = {};

const PrincipalStudents = (props: Props) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<UserState[]>([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [page, setPage] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null!);
  const { doRequest: getStudents } = useRequest({
    url: `/api/students`,
    method: "get",
    onSuccess: (data) => {
      setStudents(data.data.students);
      setStudentsCount(data.data.count);
    },
  });

  const { doRequest: deleteStudent } = useRequest({
    url: `/api/students`,
    method: "delete",
    onSuccess: () => window.location.reload(),
  });

  const loadStudents = async () => {
    const query = window.location.search;
    const queryObj = getObjectFromQuery(query);
    console.log(query);
    if (!queryObj["page"]) {
      queryObj["page"] = 0;
    }
    console.log(queryObj);
    const newQuery = getQueryFromObject(queryObj);
    console.log(newQuery);
    navigate(`${LinkRoutes.DASHBOARD}?${newQuery}`);
    setPage(queryObj["page"]);
    await getStudents({}, `/?name=${searchRef?.current?.value}&${newQuery}`);
  };

  useEffect(() => {
    (async () => {
      await loadStudents();
    })();
  }, []);
  const toNew = () => {
    // const query = window.location.search;
    // const queryObj = getObjectFromQuery(query);
    // queryObj["new"] = true;
    const queryObj = {
      new: true,
    };
    const newQuery = getQueryFromObject(queryObj);
    return newQuery;
  };
  const editStudent = (userId: string) => {
    const queryObj = {
      userId,
      edit: true,
    };
    const query = getQueryFromObject(queryObj);
    return query;
  };
  const incPage = async () => {
    setPage((prev) => prev++);
    const queryObj = getObjectFromQuery(window.location.search);
    queryObj["page"] = parseInt(page.toString()) + 1;
    const newQuery = getQueryFromObject(queryObj);
    console.log(newQuery);
    navigate(`${LinkRoutes.DASHBOARD}?${newQuery}`);
    await loadStudents();
  };
  const decPage = async () => {
    setPage((prev) => prev--);
    const queryObj = getObjectFromQuery(window.location.search);
    queryObj["page"] = parseInt(page.toString()) - 1;
    const newQuery = getQueryFromObject(queryObj);
    console.log(newQuery);
    navigate(`${LinkRoutes.DASHBOARD}?${newQuery}`);
    await loadStudents();
  };
  const display = () => {
    if (getObjectFromQuery(window.location.search)["new"])
      return <NewStudent />;
    else if (getObjectFromQuery(window.location.search)["edit"])
      return <EditStudent />;
    else
      return (
        <div className="flex mt-5">
          <div className="text-sm md:text-base fixed bottom-5 w-full justify-center flex items-center space-x-2">
            <button
              onClick={decPage}
              disabled={page == 0}
              className={`${
                page == 0 ? "text-gray-400" : "text-black"
              } border border-gray-400 p-1 rounded-md`}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Prev
            </button>
            <p>
              Showing {parseInt(page as any) + 1} of{" "}
              {studentsCount === 0 ? 1 : Math.ceil(studentsCount / 10)}
            </p>
            <button
              onClick={incPage}
              disabled={
                page == Math.ceil(studentsCount / 10) - 1 || studentsCount === 0
              }
              className={`${
                page == Math.ceil(studentsCount / 10) - 1 || studentsCount === 0
                  ? "text-gray-400"
                  : "text-black"
              } border border-gray-500 p-1 rounded-md`}
            >
              Next <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
          <div className="fixed bottom-3 right-3 md:right-5">
            <button
              onClick={() => navigate(`${LinkRoutes.DASHBOARD}?${toNew()}`)}
              className="bg-blue-500 text-center text-white px-4 py-3 rounded-full z-50"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <SideBar current={SideBarCurrent.Students} role={Role.PRINCIPAL} />
          <div className="px-2 md:px-6 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">Students</h1>
            <div className="mt-10">
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search any student..."
                  className={`focus:border-blue-500 flex-1 shadow-md transition duration-300 ease-in outline-none px-5 py-2 w-full md:w-[70%] mx-auto border border-gray-400 rounded-md`}
                />
                <button
                  onClick={loadStudents}
                  className="flex-1 bg-blue-500 rounded-md px-3 py-2 text-white shadow-md"
                >
                  Search
                </button>
              </div>
              <div className="mt-5">
                <div className="mb-2 rounded-md bg-gray-200 text-gray-600 px-5 py-4">
                  <h2>FULL NAME - EMAIL</h2>
                </div>
                {students.map((student, i) => (
                  <div
                    key={student.id}
                    className={`${
                      i % 2 === 1 && "bg-gray-100"
                    } cursor-pointer hover:bg-gray-100 rounded-md text-gray-600 px-5 items-center flex mb-2`}
                  >
                    <div
                      onClick={() =>
                        navigate(
                          `${LinkRoutes.DASHBOARD}/?${editStudent(student.id)}`
                        )
                      }
                      className="flex-1 py-4"
                    >
                      <h2 className="text-black text-lg font-bold">
                        {student.name}
                      </h2>
                      <h4 className="text-sm">{student.email}</h4>
                    </div>
                    <div className="">
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => deleteStudent({}, `/${student.id}`)}
                        className="hover:text-red-500"
                      />
                    </div>
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

export default PrincipalStudents;
