import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createSignInRecord = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/signInRecord/createSignInRecord",
    body: body,
  });
};

export const deleteSignInRecordById = (id) => {
  return request.post({
    url: "/signInRecord/deleteSignInRecordById/" + id,
  });
};

export const updateSignInRecordById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/signInRecord/updateSignInRecordById",
    body: body,
  });
};

export const pageQuerySignInRecord = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/signInRecord/pageQuerySignInRecord",
    body: body,
  });
};

export const querySignInRecordById = (id) => {
  return request.get({
    url: "/signInRecord/querySignInRecordById/" + id,
  });
};

export const listQuerySignInRecordByIds = (ids) => {
  return request.post({
    url: "/signInRecord/listQuerySignInRecordByIds",
    body: {
      ids,
    },
  });
};

export const queryUserAQSignIn = (data) => {
  return request.post({
    url: "/signInRecord/queryUserAQSignIn",
    body: data || {},
  });
};
