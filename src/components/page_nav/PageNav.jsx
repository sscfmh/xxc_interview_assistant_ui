import { Drawer, Menu } from "antd";

import React, { useState } from "react";

const buildMenuItems = (appRouter) => {
  if (!appRouter?.routes) {
    return [];
  }
  const menuItems = appRouter.routes.map((item) => {
    if (!item.children) {
      return {
        key: item.path,
        label: item.path,
      };
    }
    return {
      key: item.path + "/[dir]",
      label: item.path,
      children: item.children.map((child) => {
        if (child.index) {
          return {
            key: item.path,
            label: item.path + "/[index]",
          };
        } else {
          return {
            key: child.path,
            label: child.path,
          };
        }
      }),
    };
  });
  return menuItems;
};

export default function PageNav({ appRouter }) {
  const navigate = appRouter.navigate;
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const menuItems = buildMenuItems(appRouter);

  return (
    <>
      <Drawer
        title="All Page"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(x) => {
            navigate(x.key);
          }}
        />
      </Drawer>
      <div
        onClick={showDrawer}
        className="fixed right-1/24 bottom-1/12 z-20 size-10 cursor-pointer rounded-full bg-gray-400 p-2 dark:bg-gray-600"
      >
        <div className="rounded-full bg-primary text-center text-white">
          <i className="fa fa-list"></i>
        </div>
      </div>
    </>
  );
}
