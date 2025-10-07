import { request } from "./request";

export const login = (data) => {
  return request.post({
    url: "/userAccount/login",
    body: data,
  });
};

export const logout = () => {
  return request.post({
    url: "/userAccount/logout",
  });
};

export const getUserLoginInfo = (needSuccessMsg = true) => {
  return request.post({
    url: "/userAccount/getUserLoginInfo",
    needSuccessMsg,
  });
};
