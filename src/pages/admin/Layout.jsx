import { Avatar, Breadcrumb, Dropdown, Layout, Menu } from "antd";
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import Brand from "@/components/brand/Brand";
import LDSwitch from "@/components/theme/LDSwitch";

import { logout } from "@/api/userAccountApi";
import useModel from "@/hooks/useModel";

const { Header, Sider, Content } = Layout;

const MyHeader = () => {
  const { isDark, toggleTheme } = useModel("themeModel");
  const navigate = useNavigate();
  const { userLoginInfo } = useModel("userInfoModel");
  return (
    <div className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-8 dark:bg-neutral-800">
      <div className="cursor-pointer">
        <Brand
          onClick={() => {
            navigate("/admin");
          }}
          brandName="Interview Assistant"
        />
      </div>
      <div className="flex items-center gap-2">
        <LDSwitch toggleTheme={toggleTheme} isDark={isDark} />
        <Dropdown
          className="cursor-pointer"
          menu={{
            items: [
              {
                key: "1",
                label: (
                  <a rel="noopener noreferrer" href="#">
                    个人中心
                  </a>
                ),
              },
              {
                key: "2",
                label: (
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    onClick={() => {
                      logout()
                        .then(() => {
                          localStorage.removeItem("token");
                          navigate("/login?type=admin");
                        })
                        .catch(() => {
                          localStorage.removeItem("token");
                          navigate("/login?type=admin");
                        });
                    }}
                  >
                    退出
                  </a>
                ),
              },
            ],
          }}
        >
          <Avatar size="large" src={userLoginInfo?.avatar} alt="404" />
        </Dropdown>
        <div className="md:min-w-6"></div>
      </div>
    </div>
  );
};

const menuItems = [
  {
    key: "/admin/dashboard",
    label: "Dashboard",

    icon: <i className="fa fa-dashboard" />,
  },
  {
    key: "/admin/user-account",
    label: "User Account",

    icon: <i className="fa fa-user" />,
    children: [
      {
        key: "/admin/user-account/user",
        label: "用户管理",

        icon: <i className="fa fa-user" />,
      },
      {
        key: "/admin/user-account/role",
        label: "角色管理",

        icon: <i className="fa fa-user-secret" />,
      },
      {
        key: "/admin/user-account/perm",
        label: "权限管理",

        icon: <i className="fa fa-lock" />,
      },
      {
        key: "/admin/user-account/role-perm-rel",
        label: "角色权限关系管理",
        icon: <i className="fa fa-lock" />,
      },
    ],
  },
  {
    key: "/admin/question",
    label: "Question",
    icon: <i className="fa fa-question" />,
  },
  {
    key: "/admin/question-collection",
    label: "Question Collection",
    icon: <i className="fa fa-book" />,
  },
  {
    key: "/admin/question-qc-rel",
    label: "Question QC Rel",
    icon: <i className="fa fa-book" />,
  },
  {
    key: "/admin/question-comment",
    label: "Question Comment",
    icon: <i className="fa fa-comments" />,
  },
  {
    key: "/admin/answer",
    label: "Answer",
    icon: <i className="fa fa-question-circle" />,
  },
  {
    key: "/admin/tag",
    label: "Tag",
    icon: <i className="fa fa-tags" />,
  },
  {
    key: "/admin/user-fav",
    label: "User Fav",
    icon: <i className="fa fa-star" />,
  },
  {
    key: "/admin/sign-in-record",
    label: "Sign In Record",
    icon: <i className="fa fa-sign-in" />,
  },
  {
    key: "/admin/param-config",
    label: "Param Config",
    icon: <i className="fa fa-cog" />,
  },
];

const MySider = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        height: "100%",
        minHeight: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
        overflowY: "auto",
        position: "sticky",
        top: "64px",
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        items={menuItems}
        onClick={(x) => {
          navigate(x.key);
        }}
      />
    </Sider>
  );
};

export default function AdminLayout() {
  const location = useLocation();
  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <MyHeader />
      <Layout>
        <MySider />
        <Content
          style={{ margin: "8px 16px", minHeight: "calc(100vh - 86px)" }}
        >
          <Breadcrumb
            separator=">"
            items={location.pathname
              .split("/")
              .filter((x) => x !== "admin")
              .map((x) => {
                return { title: x };
              })}
          ></Breadcrumb>
          <div className="mt-2 bg-white p-4 dark:bg-neutral-800">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
