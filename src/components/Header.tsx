import React from "react";
import reactLogo from "../assets/react.svg";
import { useNavigate, Link } from "react-router-dom";
import { LinkRoutes } from "../utils/enums";
import useRequest from "../hooks/useRequest";
import { useAppSelector } from "../store/hooks";
type Props = {};

const Header = ({}: Props) => {
  const user = useAppSelector((state) => state.users.user);
  const { doRequest: signout } = useRequest({
    url: "/api/users/signout",
    method: "post",
  });
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center px-3">
      <img
        src={reactLogo}
        className="w-10 cursor-pointer"
        onClick={() => navigate(LinkRoutes.HOME)}
      />
      {!!user && (
        <button
          className="bg-red-400 rounded-md px-3 py-2 text-white shadow-md"
          onClick={async () => {
            await signout();
            navigate(LinkRoutes.LOGIN);
            window.location.reload();
          }}
        >
          Sign out
        </button>
      )}
    </div>
  );
};

export default Header;
