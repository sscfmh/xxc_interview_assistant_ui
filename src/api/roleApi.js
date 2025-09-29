import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createRole = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/role/createRole",
    body: body,
  });
};

export const deleteRoleById = (id) => {
  return request.post({
    url: "/role/deleteRoleById/" + id,
  });
};

export const updateRoleById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/role/updateRoleById",
    body: body,
  });
};

export const pageQueryRole = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/role/pageQueryRole",
    body: body,
  });
};

export const queryRoleById = (id) => {
  return request.get({
    url: "/role/queryRoleById/" + id,
  });
};

export const listQueryRoleByIds = (ids) => {
  return request.post({
    url: "/role/listQueryRoleByIds",
    body: {
      ids,
    }
  });
};
