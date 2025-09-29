import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createPerm = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/perm/createPerm",
    body: body,
  });
};

export const deletePermById = (id) => {
  return request.post({
    url: "/perm/deletePermById/" + id,
  });
};

export const updatePermById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/perm/updatePermById",
    body: body,
  });
};

export const pageQueryPerm = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/perm/pageQueryPerm",
    body: body,
  });
};

export const queryPermById = (id) => {
  return request.get({
    url: "/perm/queryPermById/" + id,
  });
};

export const listQueryPermByIds = (ids) => {
  return request.post({
    url: "/perm/listQueryPermByIds",
    body: {
      ids,
    }
  });
};
