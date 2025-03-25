import { ref } from "vue";
import { computedAsync } from "@vueuse/core";

interface apiRequest {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: any;
  body?: any;
}

interface apiResponse {
  data: resData | null;
  status: number | null;
  error: string | null;
  success: boolean;
}

const data = ref<apiResponse>({});

const request = {
  url: "https://api.restful-api.dev/objects",
  method: "POST",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  body: {
    name: "Apple MacBook Pro 16",
    data: {
      year: 2019,
      price: 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB",
    },
  },
};

export async function useApiRequest(apiReq: apiRequest): apiResponse {
  const apiFetch = computedAsync(async (): apiResponse => {
    let resData = null;
    let resStatus = null;
    let resError = null;
    let resSuccess = false;
    try {
      const apiData = { ...apiReq };
      delete apiData.url;
      if (apiData.body) {
        apiData.body = await JSON.stringify(apiData.body);
      }
      const response = await fetch(apiReq.url, apiData);
      resData = await response.json();
      resStatus = response.status;
      resSuccess = response.ok;
    } catch (err) {
      resError = err.message;
      resSuccess = false;
    }

    return {
      data: resData,
      status: resStatus,
      error: resError,
      success: resSuccess,
    };
  });
  return await apiFetch;
}