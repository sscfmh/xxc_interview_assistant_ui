import { Navigate, createBrowserRouter } from "react-router";

import Login from "@/pages/Login";
import AdminLayout from "@/pages/admin/Layout";
import Answer from "@/pages/admin/answer/Answer";
import CommonDetail from "@/pages/admin/common/CommonDetail";
import Dashboard from "@/pages/admin/dashboard/Dashboard";
import ParamConfig from "@/pages/admin/param_config/ParamConfig";
import Question from "@/pages/admin/question/Question";
import EditQc from "@/pages/admin/question_collection/EditQc";
import QuestionCollection from "@/pages/admin/question_collection/QuestionCollection";
import QuestionComment from "@/pages/admin/question_comment/QuestionComment";
import QuestionQcRel from "@/pages/admin/question_qc_rel/QuestionQcRel";
import SignInRecord from "@/pages/admin/sign_in_record/SignInRecord";
import Tag from "@/pages/admin/tag/Tag";
import Perm from "@/pages/admin/user_account/perm/Perm";
import Role from "@/pages/admin/user_account/role/Role";
import RolePermRel from "@/pages/admin/user_account/role_perm_rel/RolePermRel";
import User from "@/pages/admin/user_account/user/User";
import UserFav from "@/pages/admin/user_fav/UserFav";
import AiChatDemo from "@/pages/front/AiChatDemo";
import FrontLayout from "@/pages/front/Layout";
import Home from "@/pages/front/home/Home";
import QuestionCollectionDetail from "@/pages/front/question_collection/QuestionCollectionDetail";
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
    path: "/login",
    Component: Login,
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
        path: "/front/question-collection/detail",
        Component: QuestionCollectionDetail,
      },
      {
        path: "/front/question",
        Component: Questions,
      },
      {
        path: "/front/ai-chat-demo",
        Component: AiChatDemo,
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
        path: "/admin/user-account/role-perm-rel",
        Component: RolePermRel,
      },
      {
        path: "/admin/param-config",
        Component: ParamConfig,
      },
      {
        path: "/admin/question",
        Component: Question,
      },
      {
        path: "/admin/question-collection",
        Component: QuestionCollection,
      },
      {
        path: "/admin/question-collection/edit",
        Component: EditQc,
      },
      {
        path: "/admin/question-qc-rel",
        Component: QuestionQcRel,
      },
      {
        path: "/admin/question-comment",
        Component: QuestionComment,
      },
      {
        path: "/admin/answer",
        Component: Answer,
      },
      {
        path: "/admin/tag",
        Component: Tag,
      },
      {
        path: "/admin/sign-in-record",
        Component: SignInRecord,
      },
      {
        path: "/admin/user-fav",
        Component: UserFav,
      },
      {
        path: "/admin/common/common-detail",
        Component: CommonDetail,
      },
    ],
  },
]);
