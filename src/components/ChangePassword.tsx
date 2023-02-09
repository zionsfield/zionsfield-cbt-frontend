import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import { LinkRoutes } from "../utils/enums";
import { IError } from "../utils/typings.d";

type Props = {};

interface FormData {
  oldPsw: string;
  newPsw: string;
  repeatedPsw: string;
}

const ChangePassword = (props: Props) => {
  const { doRequest: changePassword } = useRequest({
    url: "/api/users/change-password",
    method: "patch",
  });
  const navigate = useNavigate();
  const formerPasswordRef = useRef<HTMLInputElement>(null!);
  const newPasswordRef = useRef<HTMLInputElement>(null!);
  const repeatPasswordRef = useRef<HTMLInputElement>(null!);
  const [changePasswordErrors, setChangePasswordErrors] = useState<IError[]>(
    []
  );
  const displayError = (errors: IError[], field?: string) => {
    if (errors.findIndex((e) => e.field === "oldPsw") > -1) {
      formerPasswordRef.current.style.borderColor = "rgb(239, 68, 68)";
    } else if (
      errors.findIndex((e) => e.field === "oldPsw") === -1 &&
      errors.length > 0
    ) {
      formerPasswordRef.current.style.borderColor = "rgb(156, 163, 175)";
    }
    if (errors.findIndex((e) => e.field === "newPsw") > -1) {
      newPasswordRef.current.style.borderColor = "rgb(239, 68, 68)";
    } else if (
      errors.findIndex((e) => e.field === "newPsw") === -1 &&
      errors.length > 0
    ) {
      newPasswordRef.current.style.borderColor = "rgb(156, 163, 175)";
    }
    if (errors.findIndex((e) => e.field === "repeatedPsw") > -1) {
      repeatPasswordRef.current.style.borderColor = "rgb(239, 68, 68)";
    } else if (
      errors.findIndex((e) => e.field === "repeatedPsw") === -1 &&
      errors.length > 0
    ) {
      repeatPasswordRef.current.style.borderColor = "rgb(156, 163, 175)";
    }
    return changePasswordErrors
      .filter((e) => e.field === field)
      .map((e, i) => (
        <p className="text-red-500 font-semibold text-xs" key={i + 1}>
          {e.message}
        </p>
      ));
  };
  const submit = async (e: any) => {
    e.preventDefault();
    const formData: FormData = {
      oldPsw: formerPasswordRef.current.value,
      newPsw: newPasswordRef.current.value,
      repeatedPsw: repeatPasswordRef.current.value,
    };
    if (formData.newPsw !== formData.repeatedPsw) {
      setChangePasswordErrors([{ message: "Passwords are different" }]);
      return;
    }
    const { repeatedPsw, ...others } = formData;
    const { data, errors } = await changePassword(others);
    console.log(errors);
    setChangePasswordErrors(errors);
    if (errors.length === 0) {
      navigate(LinkRoutes.DASHBOARD);
      window.location.reload();
    }
  };
  return (
    <div className="mt-5 flex flex-col space-y-5">
      <h1 className="font-bold text-xl">Change your password</h1>
      <form className="space-y-10" onSubmit={submit}>
        <div className="space-y-5">
          <div className="">
            <input
              ref={formerPasswordRef}
              type="password"
              placeholder="Former Password"
              className="focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full md:w-[70%] mx-auto border-b-2 border-gray-400"
            />
            {displayError(changePasswordErrors, "oldPsw")}
          </div>
          <div className="">
            <input
              ref={newPasswordRef}
              type="password"
              placeholder="New Password"
              className="focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full md:w-[70%] mx-auto border-b-2 border-gray-400"
            />
            {displayError(changePasswordErrors, "newPsw")}
          </div>
          <div className="">
            <input
              ref={repeatPasswordRef}
              type="password"
              placeholder="Repeat Password"
              className="focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full md:w-[70%] mx-auto border-b-2 border-gray-400"
            />
            {displayError(changePasswordErrors, "repeatedPsw")}
          </div>
        </div>
        {displayError(changePasswordErrors)}
        <div className="">
          <input
            value="Change Password"
            type="submit"
            className="cursor-pointer w-full md:w-[70%] bg-black rounded-md px-3 py-2 text-white shadow-md"
          />
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
