import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createAnswer = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/answer/createAnswer",
    body: body,
  });
};

export const deleteAnswerById = (id) => {
  return request.post({
    url: "/answer/deleteAnswerById/" + id,
  });
};

export const updateAnswerById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/answer/updateAnswerById",
    body: body,
  });
};

export const pageQueryAnswer = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/answer/pageQueryAnswer",
    body: body,
  });
};

export const queryAnswerById = (id) => {
  return request.get({
    url: "/answer/queryAnswerById/" + id,
  });
};

export const listQueryAnswerByIds = (ids) => {
  return request.post({
    url: "/answer/listQueryAnswerByIds",
    body: {
      ids,
    },
  });
};

export const queryUserCommitAnswer = (data) => {
  return request.post({
    url: "/answer/queryUserCommitAnswer",
    body: data,
  });
};

export const userCommitQuestionAnswer = (data) => {
  return request.post({
    url: "/answer/userCommitQuestionAnswer",
    body: data,
  });
};
