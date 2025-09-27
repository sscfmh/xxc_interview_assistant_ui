import React from "react";

import { ModelContext } from "./ModelContext";
import models from "@/models";

export const ModelProvider = ({ children }) => {
  const value = {};

  Object.keys(models).forEach((key) => {
    value[key] = models[key]();
  });
  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
};

export default ModelProvider;
