import { useState } from "react";

export default () => {
  const [detail, setDetail] = useState({
    title: "",
    data: [],
  });

  return {
    detail,
    setDetail,
  };
};
