import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { LinkRoutes, Role, SideBarCurrent } from "../../utils/enums";
import SideBar from "../SideBar";
import { Link, useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { IError, ISubjectClass } from "../../utils/typings.d";

type Props = {};

interface FormData {
  name: string;
  email: string;
  password: string;
  subjectClasses: string[];
}

interface SubjectClass {
  [id: string]: boolean;
}

const NewTeacher = (props: Props) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<SubjectClass>({});
  const nameRef = useRef<HTMLInputElement>(null!);
  const emailRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const { doRequest: newTeacher } = useRequest({
    url: "/api/teachers",
    method: "post",
  });
  const { doRequest: getSubjectClasses } = useRequest({
    url: `/api/subject-classes?inUse=false`,
    method: "get",
  });
  const [newTeacherErrors, setNewTeacherErrors] = useState<IError[]>([]);
  const [subjectClasses, setSubjectClasses] = useState<ISubjectClass[]>([]);
  useEffect(() => {
    (async () => {
      const { data, errors } = await getSubjectClasses();
      setSubjectClasses(data.data);
    })();
  }, []);
  const displayError = (errors: IError[], field?: string) => {
    if (errors.findIndex((e) => e.field === "name") > -1) {
      nameRef.current.style.borderColor = "rgb(239, 68, 68)";
    } else if (
      errors.findIndex((e) => e.field === "name") === -1 &&
      errors.length > 0
    ) {
      nameRef.current.style.borderColor = "rgb(156, 163, 175)";
    }
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
    return newTeacherErrors
      .filter((e) => e.field === field)
      .map((e, i) => (
        <p className="text-red-500 font-semibold text-xs" key={i + 1}>
          {e.message}
        </p>
      ));
  };
  const submit = async (e: any) => {
    e.preventDefault();
    const subjectClassesList = Object.keys(selected).filter(
      (key) => selected[key]
    );
    const formData: FormData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      subjectClasses: subjectClassesList,
    };
    console.log(formData);
    const { data, errors } = await newTeacher(formData);
    console.log(errors);
    setNewTeacherErrors(errors);
    if (errors.length === 0) {
      navigate(LinkRoutes.DASHBOARD);
      window.location.reload();
    }
  };

  return (
    <div className="flex mt-5">
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
          <h1 className="font-bold text-xl md:text-2xl">Create new teacher</h1>
          <form className="space-y-10 mt-3" onSubmit={submit}>
            <div className="space-y-5">
              <div className="">
                <input
                  ref={nameRef}
                  type="text"
                  placeholder="Full Name"
                  className={`focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full md:w-[70%] mx-auto border-b-2 border-gray-400`}
                />
                {displayError(newTeacherErrors, "name")}
              </div>
              <div className="">
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Email"
                  className={`focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full md:w-[70%] mx-auto border-b-2 border-gray-400`}
                />
                {displayError(newTeacherErrors, "email")}
              </div>
              <div className="">
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Password"
                  className="focus:border-blue-500 transition duration-300 ease-in bg-gray-300 outline-none px-5 py-2 w-full md:w-[70%] mx-auto border-b-2 border-gray-400"
                />
                {displayError(newTeacherErrors, "password")}
              </div>
              <div>
                <label className="text-lg font-semibold">Subject Classes</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 md:gap-x-2">
                  {subjectClasses.map((s) => (
                    <div
                      className={`${
                        selected[s.id] === true && "bg-blue-400 text-white"
                      } hover:bg-blue-400 hover:text-white transition duration-300 ease-in w-full cursor-pointer border-blue-400 border px-3 py-1 rounded`}
                      key={s.id}
                      onClick={() => {
                        const current = document.getElementById(s.id);
                        if (!current) throw new Error();
                        // (current as HTMLInputElement).value === "off"
                        const value = !selected[s.id] ? "on" : "off";
                        (current as HTMLInputElement).value = value;
                        setSelected((prev) => ({
                          ...prev,
                          [s.id]: value === "on",
                        }));
                      }}
                    >
                      <input
                        id={s.id}
                        defaultValue={"off"}
                        type="checkbox"
                        className="hidden"
                        name="subjectClass"
                      />
                      <span>
                        {s.class.className} {s.subject.name}
                      </span>
                    </div>
                  ))}
                </div>
                {displayError(newTeacherErrors, "subjectClasses")}
              </div>
            </div>
            {displayError(newTeacherErrors)}
            <div className="">
              <input
                value="Create Teacher"
                type="submit"
                className="cursor-pointer w-full md:w-[70%] bg-black rounded-md px-3 py-2 text-white shadow-md"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTeacher;
