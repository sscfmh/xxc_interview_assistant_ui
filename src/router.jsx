import { Navigate, createBrowserRouter } from "react-router";

import AdminLayout from "@/pages/admin/Layout";
import CommonDetail from "@/pages/admin/common/CommonDetail";
import Dashboard from "@/pages/admin/dashboard/Dashboard";
import Perm from "@/pages/admin/perm/Perm";
import Role from "@/pages/admin/role/Role";
import User from "@/pages/admin/user/User";
import FrontLayout from "@/pages/front/Layout";
import Home from "@/pages/front/home/Home";
import QuestionCollectionList from "@/pages/front/question_collection/QuestionCollectionList";
import Questions from "@/pages/front/questions/Questions";

export const router = createBrowserRouter([
  {
    path: "/",
    // 根路径重定向到首页
    // replace避免在历史记录中留下原路径
    element: <Navigate to="/front" replace />,
  },
  {
    path: "/front",
    Component: FrontLayout,
    children: [
      {
        index: true,
        // path: "/front/home",
        Component: Home,
      },
      {
        path: "/front/question-collection/list",
        Component: QuestionCollectionList,
      },
      {
        path: "/front/question",
        Component: Questions,
      },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "/admin/dashboard",
        Component: Dashboard,
      },
      {
        path: "/admin/user-account/role",
        Component: Role,
      },
      {
        path: "/admin/user-account/user",
        Component: User,
      },
      {
        path: "/admin/user-account/perm",
        Component: Perm,
      },
      {
        path: "/admin/common/common-detail",
        Component: CommonDetail,
      },
    ],
  },
]);
