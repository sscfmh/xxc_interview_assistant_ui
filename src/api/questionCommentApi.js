import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createQuestionComment = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/questionComment/createQuestionComment",
    body: body,
  });
};

export const deleteQuestionCommentById = (id) => {
  return request.post({
    url: "/questionComment/deleteQuestionCommentById/" + id,
  });
};

export const updateQuestionCommentById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/questionComment/updateQuestionCommentById",
    body: body,
  });
};

export const pageQueryQuestionComment = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/questionComment/pageQueryQuestionComment",
    body: body,
  });
};

export const queryQuestionCommentById = (id) => {
  return request.get({
    url: "/questionComment/queryQuestionCommentById/" + id,
  });
};

export const listQueryQuestionCommentByIds = (ids) => {
  return request.post({
    url: "/questionComment/listQueryQuestionCommentByIds",
    body: {
      ids,
    },
  });
};

// 增加点赞数
export const addQuestionCommentHeartCnt = (id) => {
  return request.post({
    url: "/questionComment/addQuestionCommentHeartCnt",
    body: {
      id,
    },
  });
};
