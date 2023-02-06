import React from "react";
import { useAppSelector } from "../../store/hooks";
import { Role, SideBarCurrent } from "../../utils/enums";
import SideBar from "../SideBar";

type Props = {};

const Student = (props: Props) => {
  const user = useAppSelector((state) => state.users.user);
  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Dashboard} role={Role.STUDENT} />
      <div className="px-2 md:px-6">Welcome {user?.name}</div>
    </div>
  );
};

export default Student;
