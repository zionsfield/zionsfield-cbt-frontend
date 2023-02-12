import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { useAppSelector } from "../../store/hooks";
import { Role, SideBarCurrent } from "../../utils/enums";
import { UserState } from "../../utils/typings.d";
import SideBar from "../SideBar";

type Props = {};

const TeacherStudents = (props: Props) => {
  const user = useAppSelector((state) => state.users.user);
  const navigate = useNavigate();
  const [students, setStudents] = useState<UserState[]>([]);
  const { doRequest: getStudents } = useRequest({
    url: `/api/teachers/students`,
    method: "get",
    onSuccess: (data) => {
      console.log(data);
      setStudents(data.data.students);
    },
  });

  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Students} role={Role.TEACHER} />
      <div className="px-2 md:px-6 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold">Students</h1>
        <div className="mt-5">
          {user?.subjectClasses.map((sc) => (
            <div key={sc.id}>
              <div
                onClick={async () => {
                  localStorage.setItem("studentsOpen", sc.id);
                  await getStudents({}, `/${sc.id}`);
                }}
                className="cursor-pointer mb-2 rounded-md bg-gray-200 text-gray-600 px-5 py-4"
              >
                <h2>
                  {sc.class.className} - {sc.subject.name}
                </h2>
              </div>
              {localStorage.getItem("studentsOpen") === sc.id && (
                <div>
                  {students.map((student, i) => (
                    <div
                      key={student.id}
                      className={`${
                        i % 2 === 1 && "bg-gray-100"
                      } cursor-pointer hover:bg-gray-100 rounded-md text-gray-600 px-5 py-4 flex-col mb-2`}
                    >
                      <h2 className="text-black text-lg font-bold">
                        {student.name}
                      </h2>
                      <h4 className="text-sm">{student.email}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudents;
