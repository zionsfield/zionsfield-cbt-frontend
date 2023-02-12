export const padZero = (value: number, length = 2) => {
  let res = "";
  let times = length - value.toString().length;
  for (let i = 0; i < times; i++) {
    res = res += "0";
  }
  return res + `${value}`;
};
