import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createParamConfig = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/paramConfig/createParamConfig",
    body: body,
  });
};

export const deleteParamConfigById = (id) => {
  return request.post({
    url: "/paramConfig/deleteParamConfigById/" + id,
  });
};

export const updateParamConfigById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/paramConfig/updateParamConfigById",
    body: body,
  });
};

export const pageQueryParamConfig = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/paramConfig/pageQueryParamConfig",
    body: body,
  });
};

export const queryParamConfigById = (id) => {
  return request.get({
    url: "/paramConfig/queryParamConfigById/" + id,
  });
};

export const listQueryParamConfigByIds = (ids) => {
  return request.post({
    url: "/paramConfig/listQueryParamConfigByIds",
    body: {
      ids,
    }
  });
};
