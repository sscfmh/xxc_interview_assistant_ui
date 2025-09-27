import { useContext } from "react";

import { ModelContext } from "@/contexts/model/ModelContext.js";

export const useModel = (model) => {
  const context = useContext(ModelContext);
  return context ? context[model] : {};
};

export default useModel;
