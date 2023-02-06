import React from "react";
import { Role, SideBarCurrent } from "../../utils/enums";
import SideBar from "../SideBar";

type Props = {};

const Teachers = (props: Props) => {
  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Teachers} role={Role.PRINCIPAL} />
      <div className="px-2 md:px-6">
        <h1>Teachers List</h1>
      </div>
    </div>
  );
};

export default Teachers;
