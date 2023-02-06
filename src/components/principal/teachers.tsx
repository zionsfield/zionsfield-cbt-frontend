import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";
import useRequest from "../../hooks/useRequest";
import { LinkRoutes, Role, SideBarCurrent } from "../../utils/enums";
import { UserState } from "../../utils/typings.d";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";
import { getObjectFromQuery, getQueryFromObject } from "../../utils/api";
import NewTeacher from "./newTeacher";

type Props = {};

const Teachers = (props: Props) => {
  const [teachers, setTeachers] = useState<UserState[]>([]);
  const [teachersCount, setTeachersCount] = useState(0);
  const [page, setPage] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null!);
  const navigate = useNavigate();
  const { doRequest: getTeachers } = useRequest({
    url: `/api/teachers`,
    method: "get",
    onSuccess: (data) => {
      setTeachers(data.data.teachers);
      setTeachersCount(data.data.count);
    },
  });

  useEffect(() => {
    (async () => {
      await loadTeachers();
    })();
  }, []);
  const toNew = () => {
    const query = window.location.search;
    const queryObj = getObjectFromQuery(query);
    queryObj["new"] = true;
    const newQuery = getQueryFromObject(queryObj);
    return newQuery;
  };
  const loadTeachers = async () => {
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
    await getTeachers({}, `/?name=${searchRef?.current?.value}&${newQuery}`);
  };
  return !getObjectFromQuery(window.location.search)["new"] ? (
    <div className="flex mt-5">
      <div className="text-sm md:text-base fixed bottom-5 w-full justify-center flex items-center space-x-2">
        <button
          disabled={page == 0}
          className={`${
            page == 0 && "text-gray-400"
          } border border-gray-400 text-black p-1 rounded-md`}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Prev
        </button>
        <p>
          Showing {parseInt(page as any) + 1} of {Math.ceil(teachersCount / 10)}
        </p>
        <button
          disabled={page == Math.floor(teachersCount / 10)}
          className={`${
            page == Math.floor(teachersCount / 10) && "text-gray-400"
          } border border-gray-500 text-black p-1 rounded-md`}
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
      <SideBar current={SideBarCurrent.Teachers} role={Role.PRINCIPAL} />
      <div className="px-2 md:px-6 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold">Teachers</h1>
        <div className="mt-10">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search any teacher..."
              className={`focus:border-blue-500 flex-1 shadow-md transition duration-300 ease-in outline-none px-5 py-2 w-full md:w-[70%] mx-auto border border-gray-400 rounded-md`}
            />
            <button
              onClick={loadTeachers}
              className="flex-1 bg-blue-500 rounded-md px-3 py-2 text-white shadow-md"
            >
              Search
            </button>
          </div>
          <div className="mt-5">
            <div className="mb-2 rounded-md bg-gray-200 text-gray-600 px-5 py-4">
              <h2>FULL NAME - EMAIL</h2>
            </div>
            {teachers.map((teacher, i) => (
              <div
                key={teacher.id}
                className={`${
                  i % 2 === 1 && "bg-gray-100"
                } cursor-pointer hover:bg-gray-100 rounded-md text-gray-600 px-5 py-4 flex-col mb-2`}
              >
                <h2 className="text-black text-lg font-bold">{teacher.name}</h2>
                <h4 className="text-sm">{teacher.email}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <NewTeacher />
  );
};

export default Teachers;
