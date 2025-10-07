import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createTag = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/tag/createTag",
    body: body,
  });
};

export const deleteTagById = (id) => {
  return request.post({
    url: "/tag/deleteTagById/" + id,
  });
};

export const updateTagById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/tag/updateTagById",
    body: body,
  });
};

export const pageQueryTag = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/tag/pageQueryTag",
    body: body,
  });
};

export const queryTagById = (id) => {
  return request.get({
    url: "/tag/queryTagById/" + id,
  });
};

export const listQueryTagByIds = (ids) => {
  return request.post({
    url: "/tag/listQueryTagByIds",
    body: {
      ids,
    }
  });
};
