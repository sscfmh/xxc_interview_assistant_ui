import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createRolePermRel = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/rolePermRel/createRolePermRel",
    body: body,
  });
};

export const deleteRolePermRelById = (id) => {
  return request.post({
    url: "/rolePermRel/deleteRolePermRelById/" + id,
  });
};

export const updateRolePermRelById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/rolePermRel/updateRolePermRelById",
    body: body,
  });
};

export const pageQueryRolePermRel = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/rolePermRel/pageQueryRolePermRel",
    body: body,
  });
};

export const queryRolePermRelById = (id) => {
  return request.get({
    url: "/rolePermRel/queryRolePermRelById/" + id,
  });
};

export const listQueryRolePermRelByIds = (ids) => {
  return request.post({
    url: "/rolePermRel/listQueryRolePermRelByIds",
    body: {
      ids,
    }
  });
};
