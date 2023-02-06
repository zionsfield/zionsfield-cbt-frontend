import React from "react";
import { Role, SideBarCurrent } from "../../utils/enums";
import SideBar from "../SideBar";

type Props = {};

const TeacherExams = (props: Props) => {
  const l = window.location.search;
  const query = new URLSearchParams(l);
  console.log(query);
  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Exams} role={Role.TEACHER} />
      <div className="px-2 md:px-6">List of Exams</div>
    </div>
  );
};

export default TeacherExams;
