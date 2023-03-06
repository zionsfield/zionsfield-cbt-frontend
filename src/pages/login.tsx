import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import { LinkRoutes } from "../utils/enums";
import { IError } from "../utils/typings.d";

type Props = {};

interface FormData {
  email: string;
  password: string;
}

const Login = ({}: Props) => {
  const navigate = useNavigate();
  const { doRequest: signin } = useRequest({
    url: "/api/users/signin",
    method: "post",
  });
  const displayError = (errors: IError[], field?: string) => {
    if (errors.findIndex((e) => e.field === "email") > -1) {
      emailRef.current.style.borderColor = "rgb(239, 68, 68)";
    } else if (
      errors.findIndex((e) => e.field === "email") === -1 &&
      errors.length > 0
    ) {
      emailRef.current.style.borderColor = "rgb(156, 163, 175)";
    }
    if (errors.findIndex((e) => e.field === "password") > -1) {
      passwordRef.current.style.borderColor = "rgb(239, 68, 68)";
    } else if (
      errors.findIndex((e) => e.field === "password") === -1 &&
      errors.length > 0
    ) {
      passwordRef.current.style.borderColor = "rgb(156, 163, 175)";
    }
    return signinErrors
      .filter((e) => e.field === field)
      .map((e, i) => (
        <p
          className="text-red-500 font-semibold text-xs text-center"
          key={i + 1}
        >
          {e.message}
        </p>
      ));
  };
  const [signinErrors, setSigninErrors] = useState<IError[]>([]);
  const emailRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const submit = async (e: any) => {
    e.preventDefault();
    const formData: FormData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    const { data, errors } = await signin(formData);
    console.log(errors);
    setSigninErrors(errors);
    if (errors.length === 0) {
      console.log(data.data);
      // localStorage.setItem("refreshToken", data.data.refreshToken);
      navigate(LinkRoutes.DASHBOARD);
      window.location.reload();
    }
  };
  return (
    <div className="flex flex-col mt-10 space-y-20">
      <h1 className="text-center font-bold text-2xl">
        Welcome to Zionsfield CBT
      </h1>
      <form className="space-y-10" onSubmit={submit}>
        <div className="space-y-5">
          <div className="text-center">
            <input
              ref={emailRef}
              type="email"
              autoFocus
              placeholder="Email"
              className={`focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full md:w-[70%] mx-auto border-b-2 border-gray-400`}
            />
            {displayError(signinErrors, "email")}
          </div>
          <div className="text-center">
            <input
              ref={passwordRef}
              type="password"
              placeholder="Password"
              className="focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full md:w-[70%] mx-auto border-b-2 border-gray-400"
            />
            {displayError(signinErrors, "password")}
          </div>
        </div>
        {displayError(signinErrors)}
        <div className="text-center">
          <input
            value="Login"
            type="submit"
            className="cursor-pointer w-full md:w-[70%] bg-black rounded-md px-3 py-2 text-white shadow-md"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
