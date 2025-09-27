import { Navigate, createBrowserRouter } from "react-router";

import FrontLayout from "@/pages/front/Layout";
import Home from "@/pages/front/home/Home";
import QuestionCollectionList from "@/pages/front/question_collection/QuestionCollectionList";
import Questions from "./pages/front/questions/Questions";

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
]);
