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
  const doRequest = async (props = {}, extUrl = "", isFd = false) => {
    try {
      // @ts-ignore
      const res = await http[method](
        url + extUrl,
        // @ts-ignore
        { ...body, ...props }
      );
      if (onSuccess) {
        onSuccess(res.data);
      }
      return { data: res.data, errors: [] };
    } catch (err: any) {
      return { data: null, errors: err.response?.data?.errors };
    }
  };

  return { doRequest };
};
export default useRequest;
