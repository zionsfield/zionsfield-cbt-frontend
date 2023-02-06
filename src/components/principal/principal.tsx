import React from "react";
import { useAppSelector } from "../../store/hooks";
import { Role, SideBarCurrent } from "../../utils/enums";
import SideBar from "../SideBar";

type Props = {};

const Principal = ({}: Props) => {
  const user = useAppSelector((state) => state.users.user);
  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Dashboard} role={Role.PRINCIPAL} />
      <div className="px-2 md:px-6">
        <h1>Welcome {user?.name}</h1>
      </div>
    </div>
  );
};

export default Principal;
