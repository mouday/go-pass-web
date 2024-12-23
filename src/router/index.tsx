/**
 * 路由
 */
import React from "react";
import { Navigate } from "react-router-dom";
import AppLayout from "../layout/layout";
import Login from "../views/Login/Login";

// import Home from "../views/Home/Home";
// import About from "../views/About/About";

const Home = React.lazy(() => import("../views/Home/Home"));
const About = React.lazy(() => import("../views/About/About"));
const QuestionList = React.lazy(() => import("../views/QuestionList/QuestionList"));
const QuestionDetail = React.lazy(() => import("../views/QuestionDetail/QuestionDetail"));

const TaskLogList = React.lazy(() => import("../views/TaskLogList/TaskLogList"));
const Form = React.lazy(() => import("../views/Form/Form"));
const Log = React.lazy(() => import("../views/Log/Log"));
const User = React.lazy(() => import("../views/User/User"));
const RunnerList = React.lazy(() => import("../views/RunnerList/RunnerList"));

const withLoadingComponent = (component) => (
  <React.Suspense fallback={<div></div>}>{component}</React.Suspense>
);

export const routes: Route[] = [
  {
    path: "/",
    // 重定向
    element: <Navigate to="/question-list" />,
  },
  {
    path: "/",
    element: <AppLayout></AppLayout>,

    children: [
      // {
      //   path: "/home",
      //   element: withLoadingComponent(<Home />),
      //   auth: true,
      // },
      // {
      //   path: "/about",
      //   element: withLoadingComponent(<About />),
      // },
      {
        path: "/question-list",
        element: withLoadingComponent(<QuestionList />),
      },
      {
        path: "/question-detail/:id",
        element: withLoadingComponent(<QuestionDetail />),
      },
      
      {
        path: "/task-log-list",
        element: withLoadingComponent(<TaskLogList />),
      },
      
      // {
      //   path: "/form",
      //   element: withLoadingComponent(<Form />),
      // },
      {
        path: "/task-log/:taskLogId",
        element: withLoadingComponent(<Log />),
      },

      {
        path: "/runner-list",
        element: withLoadingComponent(<RunnerList />),
      },

      // {
      //   path: "/user",
      //   element: withLoadingComponent(<User />),
      // },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "*",
    // 重定向
    element: <Navigate to="/home" />,
  },
];
