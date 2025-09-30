import { useEffect, useState } from "react";

import { getUserLoginInfo } from "@/api/userAccountApi";

export default () => {
  const [userLoginInfo, setUserLoginInfo] = useState({});

  useEffect(() => {
    getUserLoginInfo().then((res) => {
      if (res.success) {
        setUserLoginInfo(res.data || {});
      }
    });
  }, []);

  const refreshUserLoginInfo = () => {
    getUserLoginInfo().then((res) => {
      if (res.success) {
        setUserLoginInfo(res.data || {});
      }
    });
  };

  return {
    userLoginInfo,
    refreshUserLoginInfo,
  };
};
