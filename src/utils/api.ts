import axios from "axios";
console.log(import.meta.env.VITE_BACKEND_URL);
export const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL!,
  withCredentials: true,
});

export function getQueryFromObject(obj: any): string {
  let query: string = "";
  Object.entries(obj).forEach((value: any) => {
    if (!value[1] && value[1] !== false && value[1] !== 0) return;
    if (value[1] === "null" || value[1] === "undefined") return;
    query = query.concat(`${value[0]}=${value[1]};`);
  });
  query = query
    .slice(0, query.length - 1)
    .split(";")
    .join("&");
  return query;
}

export function getObjectFromQuery(query: string): any {
  let obj: any = {};
  if (!query) return obj;
  for (const char of query.slice(1).split("&")) {
    const key = char.split("=")[0];
    const value = char.split("=")[1];
    obj[key] = value;
  }
  return obj;
}
