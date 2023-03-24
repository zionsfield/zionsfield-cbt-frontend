import { Role, Option } from "./enums";

export interface UserState {
  id: string;
  name: string;
  email: string;
  role: string;
  subjectClasses: ISubjectClass[];
  blocked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubject {
  id: string;
  name: string;
  classes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IClass {
  id: string;
  className: string;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSubjectClass {
  id: string;
  inUse: boolean;
}

export interface ISubjectClass {
  id: string;
  class: IClass;
  subject: ISubject;
  inUse: boolean;
}

export interface IExam {
  id: string;
  name: string;
  rescheduled: boolean;
  subjectClass: ISubjectClass;
  questions: IQuestion[];
  questionNumber: number;
  startTime: string;
  duration: number;
  term: ITerm;
  teacher: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CorrectQuestion {
  questionId: string;
  optionPicked: Option;
}

export interface IResult {
  id: string;
  examId: string;
  studentId: string;
  marks: number;
  correctQuestions: CorrectQuestion[];
  incorrectQuestions: CorrectQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IResponse {
  id: string;
  examId: string;
  studentId: string;
  questionId: string;
  optionPicked: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}

export interface IError {
  message: string;
  field?: string;
}

export interface IRes<T> {
  data: T;
  message?: string;
}

export interface ITerm {
  id: string;
  startYear: number;
  endYear: number;
  term: number;
}

export interface TeacherResult {
  name: string;
  marks?: number;
}
