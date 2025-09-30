import { Button, Checkbox, Input, message } from "antd";
import { useNavigate, useSearchParams } from "react-router";

import React, { useEffect, useState } from "react";

import { login } from "@/api/userAccountApi";
import useModel from "@/hooks/useModel";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const pageType = searchParams.get("type");

  const [loginReq, setLoginReq] = useState({
    userId: "",
    password: "",
  });
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const password = localStorage.getItem("password");
    if (userId && password) {
      setLoginReq({
        userId,
        password,
      });
      setRememberMe(true);
    }
  }, []);
  const [rememberMe, setRememberMe] = useState(false);
  const { messageApi } = message.useMessage();
  const { paramConfig } = useModel("paramConfigModel");
  const { refreshUserLoginInfo } = useModel("userInfoModel");

  return (
    <div
      className="bg-primary-50 flex h-screen w-full items-center justify-center bg-center"
      style={{
        backgroundImage: `url(${paramConfig.adminLoginPageBgImg?.find((x) => x || true).configValue})`,
      }}
    >
      <div className="flex flex-col gap-10 rounded-xl bg-white p-10 opacity-90 md:w-7/24 dark:bg-gray-800">
        <div className="text-primary-500 text-2xl font-bold">
          Welcome to Interview Assistant
        </div>
        <Input
          size="large"
          value={loginReq.userId}
          onChange={(e) => setLoginReq({ ...loginReq, userId: e.target.value })}
          prefix={<span className="mr-4 text-primary/70">Account:</span>}
          placeholder="Account..."
        />
        <Input.Password
          size="large"
          value={loginReq.password}
          onChange={(e) =>
            setLoginReq({ ...loginReq, password: e.target.value })
          }
          prefix={<span className="mr-4 text-primary/70">Password:</span>}
          placeholder="Password..."
        />
        <div className="flex">
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            Remember Me
          </Checkbox>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="primary"
            onClick={() => {
              if (!loginReq.userId || !loginReq.password) {
                messageApi.error("account or password is blank.");
                return;
              }
              login({
                ...loginReq,
              }).then((res) => {
                if (res?.success) {
                  if (rememberMe) {
                    localStorage.setItem("userId", loginReq.userId);
                    localStorage.setItem("password", loginReq.password);
                  }
                  localStorage.setItem("token", res.data.token);
                  refreshUserLoginInfo();
                  if ("admin" === pageType) {
                    navigate("/admin");
                  } else {
                    navigate("/");
                  }
                }
              });
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
