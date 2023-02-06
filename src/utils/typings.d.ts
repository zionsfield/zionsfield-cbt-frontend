import { Role } from "./enums";

export interface UserState {
  id: string;
  name: string;
  email: string;
  role: string;
  subjectClasses: string[];
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

export interface ISubjectClass {
  id: string;
  class: IClass;
  subject: ISubject;
  inUse: boolean;
}

export interface IExam {
  id: string;
  name: string;
  subjectClass: string;
  questions: string[];
  questionNumber: number;
  startTime: Date;
  duration: number;
  term: string;
  teacher: string;
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
