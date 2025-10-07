import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createQuestion = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/question/createQuestion",
    body: body,
  });
};

export const deleteQuestionById = (id) => {
  return request.post({
    url: "/question/deleteQuestionById/" + id,
  });
};

export const updateQuestionById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/question/updateQuestionById",
    body: body,
  });
};

export const pageQueryQuestion = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/question/pageQueryQuestion",
    body: body,
  });
};

export const queryQuestionById = (id) => {
  return request.get({
    url: "/question/queryQuestionById/" + id,
  });
};

export const listQueryQuestionByIds = (ids) => {
  return request.post({
    url: "/question/listQueryQuestionByIds",
    body: {
      ids,
    }
  });
};
