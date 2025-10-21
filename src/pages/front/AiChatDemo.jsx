import { Button, Input } from "antd";
import clsx from "clsx";

import React, { useState } from "react";

import Viewer from "@/components/md/Viewer";

const chatId = Math.random() * 1000 + "";

const MessageItem = ({ role, content }) => {
  return (
    <div
      className={clsx("flex w-full items-center justify-end gap-4", {
        "flex-row-reverse": role === "ai",
      })}
    >
      <div className="max-w-1/2 rounded-2xl border-1 border-primary p-6">
        <Viewer value={content} />
      </div>
      <img
        className="size-10 self-start rounded-full border-2 border-primary"
        alt={role}
      />
    </div>
  );
};

export default function AiChatDemo() {
  const [messageList, setMessageList] = useState([
    {
      role: "ai",
      content: "有什么我可以帮你的吗",
    },
  ]);
  const [userMsg, setUserMsg] = useState("");
  const handSendMsg = async () => {
    setMessageList((prev) => [
      ...prev,
      {
        role: "user",
        content: userMsg,
      },
      {
        role: "ai",
        content: "",
      },
    ]);
    setUserMsg("");
    const response = await fetch(
      "http://localhost:8080/ai/streamChat/chatWithUserControlledTools?chatId=" + chatId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMsg: userMsg }),
      },
    );
    if (!response.ok) {
      setMessageList((prev) => {
        const lastIndex = prev.length - 1;
        const lastItem = prev[lastIndex];
        return [
          ...prev.slice(0, lastIndex),
          {
            ...lastItem,
            content: lastItem.content + "error: " + response.statusText,
          },
        ];
      });
      throw new Error(`HTTP ${response.status}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const appendContent = decoder.decode(value, { stream: true });

      setMessageList((prev) => {
        const lastIndex = prev.length - 1;
        const lastItem = prev[lastIndex];
        return [
          ...prev.slice(0, lastIndex),
          {
            ...lastItem,
            content: (lastItem.content + appendContent).replaceAll("\\n", "\n").replaceAll("\\\"", "\""),
          },
        ];
      });
    }
  };
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="w-full">
        {messageList.map((item, index) => (
          <MessageItem key={index} {...item} />
        ))}
      </div>
      <Input.TextArea
        size={"large"}
        placeholder={"请输入你的问题"}
        allowClear={true}
        value={userMsg}
        onChange={(e) => setUserMsg(e.target.value)}
      />
      <div>
        <Button onClick={handSendMsg} type="primary">
          {"->"}
        </Button>
      </div>
    </div>
  );
}
