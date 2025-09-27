import { theme as antdTheme } from "antd";

import React, { useEffect, useState } from "react";

export default () => {
  // 从localStorage读取保存的主题，默认亮色
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [colors, setColors] = useState({
    colorPrimary: "#1668dc",
  });
  useEffect(() => {
    setColors((prev) => ({
      ...prev,
      colorPrimary: "#49aa19",
    }));
  }, []);
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--color-primary",
      colors.colorPrimary,
    );
  }, [colors]);

  // 同步主题到DOM（用于Tailwind的dark类）
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 切换主题的方法
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
    antdTheme: {
      token: {
        ...colors,
      },
      algorithm:
        theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      cssVar: true,
      components: {
      }
    },
    setColors,
  };
};
