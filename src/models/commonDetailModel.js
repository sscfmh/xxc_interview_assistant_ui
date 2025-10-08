import { useEffect, useState } from "react";

export default () => {
  const [detail, _setDetail] = useState({
    title: "",
    descMeta: [],
    record: {},
  });

  useEffect(() => {
    let commonDetail_detail = localStorage.getItem("commonDetail_detail");
    if (commonDetail_detail) {
      _setDetail(JSON.parse(commonDetail_detail));
    }
  }, []);

  const setDetail = (detailInfo) => {
    _setDetail(detailInfo);
    localStorage.setItem("commonDetail_detail", JSON.stringify(detailInfo));
  };

  return {
    detail,
    setDetail,
  };
};
