import {
  faArrowLeft,
  faArrowRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { useAppSelector } from "../../store/hooks";
import { getObjectFromQuery, getQueryFromObject } from "../../utils/api";
import { LinkRoutes, Role, SideBarCurrent } from "../../utils/enums";
import { UserState } from "../../utils/typings.d";
import SideBar from "../SideBar";

type Props = {};

const TeacherStudents = (props: Props) => {
  const user = useAppSelector((state) => state.users.user);
  const navigate = useNavigate();
  const [students, setStudents] = useState<UserState[]>([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [page, setPage] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null!);
  const { doRequest: getStudents } = useRequest({
    url: `/api/teachers/students`,
    method: "get",
    onSuccess: (data) => {
      console.log(data);
      setStudents(data.data.students);
    },
  });

  // const loadStudents = async () => {
  //   const query = window.location.search;
  //   const queryObj = getObjectFromQuery(query);
  //   console.log(query);
  //   if (!queryObj["page"]) {
  //     queryObj["page"] = 0;
  //   }
  //   console.log(queryObj);
  //   const newQuery = getQueryFromObject(queryObj);
  //   console.log(newQuery);
  //   navigate(`${LinkRoutes.DASHBOARD}?${newQuery}`);
  //   setPage(queryObj["page"]);
  //   await getStudents({}, `?${newQuery}`);
  // };

  // useEffect(() => {
  //   (async () => {
  //     await loadStudents();
  //   })();
  // }, []);

  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Students} role={Role.TEACHER} />
      <div className="px-2 md:px-6 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold">Students</h1>
        {/* <div className="mt-10">
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
          </div> */}
        <div className="mt-5">
          {user?.subjectClasses.map((sc) => (
            <div key={sc.id}>
              <div
                onClick={async () => {
                  localStorage.setItem("studentsOpen", sc.id);
                  await getStudents({}, `/${sc.id}`);
                }}
                className="cursor-pointer mb-2 rounded-md bg-gray-200 text-gray-600 px-5 py-4"
              >
                <h2>
                  {sc.class.className} - {sc.subject.name}
                </h2>
              </div>
              {localStorage.getItem("studentsOpen") === sc.id && (
                <div>
                  {students.map((student, i) => (
                    <div
                      key={student.id}
                      className={`${
                        i % 2 === 1 && "bg-gray-100"
                      } cursor-pointer hover:bg-gray-100 rounded-md text-gray-600 px-5 py-4 flex-col mb-2`}
                    >
                      <h2 className="text-black text-lg font-bold">
                        {student.name}
                      </h2>
                      <h4 className="text-sm">{student.email}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* <div className="mb-2 rounded-md bg-gray-200 text-gray-600 px-5 py-4">
            <h2>FULL NAME - EMAIL</h2>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudents;
