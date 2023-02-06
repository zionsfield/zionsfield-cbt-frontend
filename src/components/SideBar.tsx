import React from "react";
import teacherIcon from "../assets/teacherIcon.png";
import studentIcon from "../assets/studentIcon.png";
import dashboardIcon from "../assets/dashboardIcon.jpeg";
import examIcon from "../assets/examIcon.png";
import { Link } from "react-router-dom";
import { LinkRoutes, Role, SideBarCurrent } from "../utils/enums";

type Props = {
  current: SideBarCurrent;
  role: Role;
};

const SideBar = ({ current, role }: Props) => {
  return (
    <div className="min-h-screen border-r pr-2 md:pr-6">
      <ul className="list-none">
        <Link
          to={LinkRoutes.DASHBOARD}
          onClick={() => {
            localStorage.setItem("current", SideBarCurrent.Dashboard);
            window.location.reload();
          }}
        >
          <li
            className={`${
              current === SideBarCurrent.Dashboard &&
              "bg-blue-100 text-blue-400 font-semibold rounded-md"
            } my-1 cursor-pointer border-b border-white px-6 md:pr-12 py-3 hover:bg-blue-100 hover:text-blue-400 hover:font-semibold hover:rounded-md`}
          >
            <span className="hidden md:inline-flex">Overview</span>
            <img src={dashboardIcon} className="w-6 h-6 md:hidden" />
          </li>
        </Link>
        {role === Role.PRINCIPAL && (
          <Link
            to={LinkRoutes.DASHBOARD}
            onClick={() => {
              localStorage.setItem("current", SideBarCurrent.Teachers);
              window.location.reload();
            }}
          >
            <li
              className={`${
                current === SideBarCurrent.Teachers &&
                "bg-blue-100 text-blue-400 font-semibold rounded-md"
              } my-1 cursor-pointer border-b border-white px-6 md:pr-12 py-3 hover:bg-blue-100 hover:text-blue-400 hover:font-semibold hover:rounded-md`}
            >
              <span className="hidden md:inline-flex">Teachers</span>
              <img src={teacherIcon} className="w-6 h-6 md:hidden" />
            </li>
          </Link>
        )}
        {(role === Role.TEACHER || role === Role.STUDENT) && (
          <Link
            to={LinkRoutes.DASHBOARD}
            onClick={() => {
              localStorage.setItem("current", SideBarCurrent.Exams);
              window.location.reload();
            }}
          >
            <li
              className={`${
                current === SideBarCurrent.Exams &&
                "bg-blue-100 text-blue-400 font-semibold rounded-md"
              } my-1 cursor-pointer border-b border-white px-6 md:pr-12 py-3 hover:bg-blue-100 hover:text-blue-400 hover:font-semibold hover:rounded-md`}
            >
              <span className="hidden md:inline-flex">Exams</span>
              <img src={examIcon} className="w-6 h-6 md:hidden" />
            </li>
          </Link>
        )}
        {(role === Role.TEACHER || role === Role.PRINCIPAL) && (
          <Link
            to={LinkRoutes.DASHBOARD}
            onClick={() => {
              localStorage.setItem("current", SideBarCurrent.Students);
              window.location.reload();
            }}
          >
            <li
              className={`${
                current === SideBarCurrent.Students &&
                "bg-blue-100 text-blue-400 font-semibold rounded-md"
              } my-1 cursor-pointer border-b border-white px-6 md:pr-12 py-3 hover:bg-blue-100 hover:text-blue-400 hover:font-semibold hover:rounded-md`}
            >
              <span className="hidden md:inline-flex">Students</span>
              <img src={studentIcon} className="w-6 h-6 md:hidden" />
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
};

export default SideBar;
