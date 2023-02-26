import { faArrowLeft, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { getObjectFromQuery, getQueryFromObject } from "../../utils/api";
import { LinkRoutes, Role, SideBarCurrent } from "../../utils/enums";
import { UserState } from "../../utils/typings";
import SideBar from "../SideBar";

type Props = {};

const ViewTeacher = (props: Props) => {
  const navigate = useNavigate();
  const [currentTeacher, setCurrentTeacher] = useState<UserState>();
  const { doRequest: getTeacherById } = useRequest({
    url: "/api/teachers",
    method: "get",
    onSuccess: (data) => setCurrentTeacher(data.data),
  });

  const editTeacher = () => {
    const queryObj = {
      userId: getObjectFromQuery(window.location.search)["userId"],
      action: "EDIT",
    };
    const query = getQueryFromObject(queryObj);
    return query;
  };

  useEffect(() => {
    (async () => {
      const queryObj = getObjectFromQuery(window.location.search);
      await getTeacherById({}, `/${queryObj.userId}`);
    })();
  }, []);

  return (
    <div className="flex mt-5">
      <div className="fixed bottom-3 right-3 md:right-5">
        <button
          onClick={() => navigate(`${LinkRoutes.DASHBOARD}/?${editTeacher()}`)}
          className="bg-blue-500 text-center text-white px-4 py-3 rounded-full z-50"
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
      </div>
      <SideBar current={SideBarCurrent.Teachers} role={Role.PRINCIPAL} />
      <div className="px-2 md:px-6 flex-1">
        <Link
          to={LinkRoutes.DASHBOARD}
          onClick={() => window.location.reload()}
        >
          <button className="flex space-x-2 font-bold items-center">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to teachers</span>
          </button>
        </Link>
        <div className="mt-5">
          <h1 className="font-bold text-xl md:text-2xl">Teacher Details</h1>
          <div className="space-y-10 mt-3">
            <div className="space-y-5">
              <div className="">
                <span className="font-semibold">Name</span>
                <p
                  className={`bg-gray-300 px-5 py-2 w-full mx-auto border-gray-400`}
                >
                  {currentTeacher?.name}
                </p>
              </div>
              <div className="">
                <span className="font-semibold">Email</span>
                <p
                  className={`bg-gray-300 px-5 py-2 w-full mx-auto border-gray-400`}
                >
                  {currentTeacher?.email}
                </p>
              </div>
              <div>
                <span className="text-lg font-semibold">Subject Classes</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 md:gap-x-2">
                  {currentTeacher?.subjectClasses.map((s) => (
                    <div
                      className={`bg-blue-400 text-white w-full border-blue-400 border px-3 py-1 rounded`}
                      key={s.id}
                    >
                      <span>
                        {s.class.className} {s.subject.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTeacher;
