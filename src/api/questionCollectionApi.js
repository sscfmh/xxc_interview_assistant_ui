import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createQuestionCollection = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/questionCollection/createQuestionCollection",
    body: body,
  });
};

export const deleteQuestionCollectionById = (id) => {
  return request.post({
    url: "/questionCollection/deleteQuestionCollectionById/" + id,
  });
};

export const updateQuestionCollectionById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/questionCollection/updateQuestionCollectionById",
    body: body,
  });
};

export const pageQueryQuestionCollection = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/questionCollection/pageQueryQuestionCollection",
    body: body,
  });
};

export const queryQuestionCollectionById = (id) => {
  return request.get({
    url: "/questionCollection/queryQuestionCollectionById/" + id,
  });
};

export const listQueryQuestionCollectionByIds = (ids) => {
  return request.post({
    url: "/questionCollection/listQueryQuestionCollectionByIds",
    body: {
      ids,
    }
  });
};
