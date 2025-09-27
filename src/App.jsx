import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router";

import "@/App.css";
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

const RouterComp = () => {
  return <RouterProvider router={router} />;
};

function App() {
  return (
    <>
      <ModelComp>
        <AntdThemeComp>
          <RouterComp />
        </AntdThemeComp>
      </ModelComp>
    </>
  );
}

export default App;
