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
  const [allBlocked, setAllBlocked] = useState<boolean>();
  const { doRequest: getStudents } = useRequest({
    url: `/api/teachers/students`,
    method: "get",
    onSuccess: (data) => {
      console.log(data);
      const isBlocked =
        data.data.students.length > 0 ? data.data.students[0].blocked : false;
      setAllBlocked(isBlocked);
      setStudents(data.data.students);
    },
  });

  const { doRequest: blockAll } = useRequest({
    url: "/api/students/block-all",
    method: "patch",
    onSuccess: () => window.location.reload(),
  });

  const { doRequest: block } = useRequest({
    url: "/api/students/block",
    method: "patch",
    onSuccess: () => window.location.reload(),
  });

  return (
    <div className="flex mt-5">
      <SideBar current={SideBarCurrent.Students} role={Role.TEACHER} />
      <div className="px-2 md:px-6 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold">Students</h1>
        <div className="mt-5">
          {user?.subjectClasses.map((sc) => (
            <div key={sc.id}>
              <div className="flex justify-between items-center mb-2 rounded-md bg-gray-200 text-gray-600 px-5">
                <h2
                  onClick={async () => {
                    localStorage.setItem("studentsOpen", sc.id);
                    await getStudents({}, `/${sc.id}`);
                  }}
                  className="flex-1 py-4 cursor-pointer"
                >
                  {sc.class.className} - {sc.subject.name}
                </h2>
                {localStorage.getItem("studentsOpen") === sc.id &&
                  students.length > 0 &&
                  (allBlocked ? (
                    <button
                      onClick={() =>
                        blockAll({ block: false }, `?subjectClass=${sc.id}`)
                      }
                      className="bg-blue-400 text-white p-2 rounded"
                    >
                      Unblock All
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        blockAll({ block: true }, `?subjectClass=${sc.id}`)
                      }
                      className="bg-blue-400 text-white p-2 rounded"
                    >
                      Block All
                    </button>
                  ))}
              </div>
              {localStorage.getItem("studentsOpen") === sc.id && (
                <div>
                  {students.map((student, i) => (
                    <div
                      key={student.id}
                      className={`${
                        i % 2 === 1 && "bg-gray-100"
                      } hover:bg-gray-100 rounded-md text-gray-600 px-5 flex justify-between items-center mb-2`}
                    >
                      <div className="cursor-pointer py-4 flex-1 flex flex-col">
                        <h2 className="text-black text-lg font-bold">
                          {student.name}
                        </h2>
                        <h4 className="text-sm">{student.email}</h4>
                      </div>
                      {student.blocked ? (
                        <button
                          onClick={() =>
                            block({ block: false }, `?id=${student.id}`)
                          }
                          className="bg-blue-400 text-white p-2 rounded"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            block({ block: true }, `?id=${student.id}`)
                          }
                          className="bg-blue-400 text-white p-2 rounded"
                        >
                          Block
                        </button>
                      )}
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
