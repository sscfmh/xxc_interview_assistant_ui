import { Descriptions } from "antd";
import { Tag } from "antd";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

import React from "react";

import "@/components/md/md.css";

import useModel from "@/hooks/useModel";

const TagItem = ({ tagType, tagKey }) => {
  const { getTagInfo } = useModel("paramConfigModel");
  const { color, label } = getTagInfo(tagType, tagKey);
  return <Tag color={color}>{label}</Tag>;
};

const convertToDescItem = ({ key, label, value, type, tagType }) => {
  if (!type || type === "text" || !value) {
    return {
      key,
      label,
      children: value,
    };
  }
  if (type === "tag") {
    return {
      key,
      label,
      children: <TagItem tagType={tagType} tagKey={value} />,
    };
  }
  switch (type) {
    case "md":
      return {
        key,
        label,
        children: (
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: marked.parse(value) }}
          />
        ),
      };
    case "image":
      return {
        key,
        label,
        children: <img src={value} alt="404" />,
      };
    case "jsonStr":
      return {
        key,
        label,
        children: (
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{
              __html: marked.parse("```json\n" + value + "\n```"),
            }}
          />
        ),
      };
    case "array":
      return {
        key,
        label,
        children: (
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{
              __html: marked.parse(
                "```json\n" + value
                  ? JSON.stringify(value)
                  : "<empty array>" + "\n```",
              ),
            }}
          />
        ),
      };
    default:
      return { key, label, children: value };
  }
};

export default function CommonDetail() {
  const { detail } = useModel("commonDetailModel");
  const { title, descMeta, record } = detail;
  const items = descMeta?.map((item) =>
    convertToDescItem({
      key: item.key,
      label: item.label,
      value: record[item.dataIndex],
      type: item.type,
      tagType: item.tagType,
    }),
  );
  return (
    <div>
      <Descriptions title={title} items={items} />
    </div>
  );
}
