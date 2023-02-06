import React from "react";
import { Navigate } from "react-router-dom";
import Principal from "../../components/principal/principal";
import PrincipalStudents from "../../components/principal/students";
import Teachers from "../../components/principal/teachers";
import StudentExams from "../../components/student/exams";
import Student from "../../components/student/student";
import TeacherExams from "../../components/teacher/exams";
import TeacherStudents from "../../components/teacher/students";
import Teacher from "../../components/teacher/teacher";
import { useAppSelector } from "../../store/hooks";
import { LinkRoutes, Role, SideBarCurrent } from "../../utils/enums";

type Props = {};

const Dashboard = ({}: Props) => {
  const user = useAppSelector((state) => state.users.user);
  const displayPrincipal = () => {
    const current = localStorage.getItem("current");
    console.log(current);
    if (!current) return <Principal />;
    if (current === SideBarCurrent.Dashboard) return <Principal />;
    else if (current === SideBarCurrent.Teachers) return <Teachers />;
    else if (current === SideBarCurrent.Students) return <PrincipalStudents />;
    else return <Principal />;
  };
  const displayTeacher = () => {
    const current = localStorage.getItem("current");
    console.log(current);
    if (!current) return <Teacher />;
    if (current === SideBarCurrent.Dashboard) return <Teacher />;
    else if (current === SideBarCurrent.Exams) return <TeacherExams />;
    else if (current === SideBarCurrent.Students) return <TeacherStudents />;
    else return <Teacher />;
  };
  const displayStudent = () => {
    const current = localStorage.getItem("current");
    console.log(current);
    if (!current) return <Student />;
    if (current === SideBarCurrent.Dashboard) return <Student />;
    else if (current === SideBarCurrent.Exams) return <StudentExams />;
    else return <Student />;
  };
  const displayDashboard = () => {
    if (!user) return <Navigate to={LinkRoutes.LOGIN} />;
    if (user.role === Role.PRINCIPAL) return displayPrincipal();
    else if (user.role === Role.TEACHER) return displayTeacher();
    else if (user.role === Role.STUDENT) return displayStudent();
    else return <Navigate to={LinkRoutes.LOGIN} />;
  };
  return displayDashboard();
};

export default Dashboard;
