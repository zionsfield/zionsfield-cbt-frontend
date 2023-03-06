export const padZero = (value: number, length = 2) => {
  let res = "";
  let times = length - value.toString().length;
  for (let i = 0; i < times; i++) {
    res = res += "0";
  }
  return res + `${value}`;
};

export const deleteSavedExam = (fakeId: string) => {
  const cachedExams = localStorage.getItem("exams");
  if (cachedExams) {
    const examsCached: any[] = JSON.parse(cachedExams);
    const foundExamIndex = examsCached.findIndex((e) => e.fakeId === fakeId);
    if (foundExamIndex > -1) examsCached.splice(foundExamIndex, 1);
    localStorage.setItem("exams", JSON.stringify(examsCached));
  }
};
