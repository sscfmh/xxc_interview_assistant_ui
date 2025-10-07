import strUtils from "@/utils/strUtils";

import { request } from "./request";

export const createUserFav = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/userFav/createUserFav",
    body: body,
  });
};

export const deleteUserFavById = (id) => {
  return request.post({
    url: "/userFav/deleteUserFavById/" + id,
  });
};

export const updateUserFavById = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/userFav/updateUserFavById",
    body: body,
  });
};

export const pageQueryUserFav = (body) => {
  body = strUtils.convertBlankToNull(body);
  return request.post({
    url: "/userFav/pageQueryUserFav",
    body: body,
  });
};

export const queryUserFavById = (id) => {
  return request.get({
    url: "/userFav/queryUserFavById/" + id,
  });
};

export const listQueryUserFavByIds = (ids) => {
  return request.post({
    url: "/userFav/listQueryUserFavByIds",
    body: {
      ids,
    }
  });
};
