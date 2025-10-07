import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createQuestionQcRel = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/questionQcRel/createQuestionQcRel",
    body: body,
  });
};

export const deleteQuestionQcRelById = (id) => {
  return request.post({
    url: "/questionQcRel/deleteQuestionQcRelById/" + id,
  });
};

export const updateQuestionQcRelById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/questionQcRel/updateQuestionQcRelById",
    body: body,
  });
};

export const pageQueryQuestionQcRel = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/questionQcRel/pageQueryQuestionQcRel",
    body: body,
  });
};

export const queryQuestionQcRelById = (id) => {
  return request.get({
    url: "/questionQcRel/queryQuestionQcRelById/" + id,
  });
};

export const listQueryQuestionQcRelByIds = (ids) => {
  return request.post({
    url: "/questionQcRel/listQueryQuestionQcRelByIds",
    body: {
      ids,
    }
  });
};
