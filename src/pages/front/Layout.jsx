import { Avatar, Menu } from "antd";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";

import React from "react";

import Brand from "@/components/brand/Brand";
import LDSwitch from "@/components/theme/LDSwitch";

import useModel from "@/hooks/useModel";

const MyHeader = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useModel("themeModel");
  return (
    <div className="sticky top-0 z-1 flex w-full items-center bg-white px-8 dark:bg-gray-800">
      <div className="flex flex-1 items-center gap-2">
        <div className="cursor-pointer">
          <Brand brandName="Interview Assistant" />
        </div>
        <Menu
          className="flex h-16 flex-1 items-center"
          style={{
            backgroundColor: isDark ? "var(--color-gray-800)" : "unset",
          }}
          mode="horizontal"
          onClick={(item) => {
            navigate(item.key);
          }}
          items={[
            {
              label: "Home",
              key: "/front",
              icon: <i className="fa fa-home" />,
            },
            {
              label: "Question Collection",
              key: "/front/question-collection/list",
              icon: <i className="fa fa-book" />,
            },
            {
              label: "Question",
              key: "/front/question",
              icon: <i className="fa fa-question" />,
            },
          ]}
        />
      </div>
      <div className="flex items-center gap-2">
        <LDSwitch toggleTheme={toggleTheme} isDark={isDark} />
        <Avatar size="large" alt="404" />
      </div>
    </div>
  );
};

const MyFooter = () => {
  return (
    <div className="flex h-16 items-center justify-center bg-white dark:bg-gray-800">
      Interview Assistant ©{new Date().getFullYear()} Created by xxx
    </div>
  );
};

export default function FrontLayout() {
  return (
    <>
      <MyHeader />
      <Outlet />
      <MyFooter />
    </>
  );
}
