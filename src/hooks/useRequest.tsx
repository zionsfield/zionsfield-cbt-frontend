import React, { useState } from "react";
import axios from "axios";
import { http } from "../utils/api";

interface UseRequest {
  url: string;
  method: string;
  body?: any;
  onSuccess?: (data?: any) => void;
}

const useRequest = ({ url, method, body, onSuccess }: UseRequest) => {
  const doRequest = async (props = {}, extUrl = ""): Promise<any> => {
    try {
      // @ts-ignore
      const res = await http[method](
        url + extUrl,

        { ...body, ...props }
      );
      if (onSuccess) {
        onSuccess(res.data);
      }
      return { data: res.data, errors: [] };
    } catch (err: any) {
      console.log(err);
      if (err?.response?.status === 463) {
        console.log("fixing");
        await http.post("/api/users/refresh-token");
        // window.location.reload();
        return await doRequest(props, extUrl);
      }
      return {
        data: null,
        errorStatus: err?.response?.status,
        errors: err.response?.data?.errors,
      };
    }
  };

  return { doRequest };
};
export default useRequest;
