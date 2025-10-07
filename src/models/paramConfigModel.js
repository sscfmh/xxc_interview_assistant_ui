import { useEffect, useState } from "react";

import { listQueryParamConfigByIds } from "@/api/paramConfigApi";

const parseJson = (json) => {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
};

export default () => {
  const [paramConfig, setParamConfig] = useState({});

  useEffect(() => {
    listQueryParamConfigByIds(null, false).then((res) => {
      if (res.success && res.data) {
        let newParamConfig = {};
        res.data.forEach((item) => {
          newParamConfig[item.paramType] = newParamConfig[item.paramType] || [];
          newParamConfig[item.paramType].push({
            configKey: item.paramKey,
            configValue: item.paramValue,
            label: item.paramValue || item.paramKey,
            extendInfo: parseJson(item.extendInfo || {}),
          });
          setParamConfig(newParamConfig);
        });
      }
    });
  }, []);

  const paramConfigForSelect = (configType) => {
    const options = (paramConfig[configType] || []).map((item) => ({
      value: item.configKey,
      label: item.label,
    }));
    return [
      {
        value: "",
        label: "ALL",
      },
      ...options,
    ];
  };

  const getTagInfo = (configType, configKey) => {
    let conf = paramConfig[configType]?.find(
      (item) => item.configKey === configKey,
    );
    let color = conf?.extendInfo?.ui?.tagColor;
    let label = conf?.extendInfo?.ui?.label;
    color = color && color.trim().length > 0 ? color : "gray";
    return {
      color,
      label: label ? label : conf?.label || configKey,
    };
  };

  return {
    paramConfig,
    paramConfigForSelect,
    getTagInfo,
  };
};
