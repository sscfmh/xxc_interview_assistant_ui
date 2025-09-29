import { ConfigProvider, message } from "antd";
import { RouterProvider } from "react-router";

import { useEffect } from "react";

import "@/App.css";
import { initRequest } from "@/api/request";
import ModelProvider from "@/contexts/model/ModelProvider";
import useModel from "@/hooks/useModel";
import { router } from "@/router";

const ModelComp = ({ children }) => {
  return <ModelProvider>{children}</ModelProvider>;
};

const AntdThemeComp = ({ children }) => {
  const { antdTheme } = useModel("themeModel");
  return (
    <>
      {/* antd主题 */}
      <ConfigProvider
        theme={{
          ...antdTheme,
        }}
      >
        {children}
      </ConfigProvider>
    </>
  );
};

const MsgComp = () => {
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    initRequest({
      showMessage: ({ type, content }) => {
        messageApi[type](content);
      },
    });
  }, [messageApi]);

  return <>{contextHolder}</>;
};

const RouterComp = () => {
  return <RouterProvider router={router} />;
};

function App() {
  return (
    <>
      <ModelComp>
        <AntdThemeComp>
          <MsgComp />
          <RouterComp />
        </AntdThemeComp>
      </ModelComp>
    </>
  );
}

export default App;
