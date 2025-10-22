import { useEffect, useState } from "react";

import { listQueryTagByIds } from "@/api/tagApi";

const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "geekblue",
  "magenta",
  "volcano",
  "gold",
  "lime",
  "pink",
];

const getTagColor = (idx) => {
  return colors[idx % colors.length];
};

export default () => {
  const [allTag, setAllTag] = useState([]);
  useEffect(() => {
    listQueryTagByIds().then((res) => {
      if (res.success) {
        setAllTag(
          res.data.map((tag, idx) => {
            return {
              ...tag,
              color: getTagColor(idx),
            };
          }),
        );
      }
    });
  }, []);
  return {
    allTag,
  };
};
