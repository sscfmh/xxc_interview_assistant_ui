const func = {
  showMessage: () => {},
};

export const initRequest = (x) => {
  func.showMessage = x.showMessage;
};

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const _request = ({
  url,
  method,
  headers,
  params,
  body,
  needSuccessMsg = true,
}) => {
  // 处理查询参数
  let finalUrl = params
    ? `${url}?${new URLSearchParams(params).toString()}`
    : url;

  // 处理 headers，避免覆盖 FormData 自动生成的 Content-Type
  const defaultHeaders = {
    token: localStorage.getItem("token"),
  };
  // 仅在 body 不是 FormData 时设置默认 Content-Type
  if (!(body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  return fetch(BASE_URL + finalUrl, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })
    .then((res) => {
      // 处理 HTTP 错误状态码
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      // 尝试解析 JSON，若失败则返回文本
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return res.json();
      }
      return res.text().then((text) => ({ text })); // 非 JSON 响应包装为对象
    })
    .then((res) => {
      // 允许通过 headers 自定义成功判断逻辑（默认检查 success: true）
      const isSuccess = headers?.checkSuccess
        ? headers.checkSuccess(res)
        : res.success === true;
      if (isSuccess) {
        if (needSuccessMsg) {
          func.showMessage({
            type: "success",
            content: "success",
            duration: 1000,
          });
        }
        return res;
      } else {
        const errorMsg = res.message || res.resultMessage || "request error";
        return Promise.reject(new Error(errorMsg));
      }
    })
    .catch((error) => {
      func.showMessage({
        type: "error",
        content: error.message,
        duration: 1000,
      });

      return Promise.reject(error); // 重新抛出错误，让调用方处理
    });
};

export const request = {
  get: ({ url, params, headers = {}, needSuccessMsg = true }) => {
    return _request({
      url,
      method: "GET",
      headers,
      params,
      needSuccessMsg,
    });
  },
  post: ({ url, params, body, headers = {}, needSuccessMsg = true }) => {
    return _request({
      url,
      method: "POST",
      headers,
      params,
      body,
      needSuccessMsg,
    });
  },
};
