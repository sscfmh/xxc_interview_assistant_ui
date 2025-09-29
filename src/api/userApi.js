import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createUser = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/user/createUser",
    body: body,
  });
};

export const deleteUserById = (id) => {
  return request.post({
    url: "/user/deleteUserById/" + id,
  });
};

export const updateUserById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/user/updateUserById",
    body: body,
  });
};

export const pageQueryUser = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/user/pageQueryUser",
    body: body,
  });
};

export const queryUserById = (id) => {
  return request.get({
    url: "/user/queryUserById/" + id,
  });
};

export const listQueryUserByIds = (ids) => {
  return request.post({
    url: "/user/listQueryUserByIds",
    body: {
      ids,
    }
  });
};
