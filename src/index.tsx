import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";

import AppWrapper from "./AppWrapper";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/dashboard/Login";
import TaskScheduler from "./components/scheduler/TaskScheduler";
import UserManagement from "./components/user/UserManagement";

const routes = [{
    path: "/",
    element: <AppWrapper><Dashboard /></AppWrapper>
},
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/logout",
        element: <Login />
    },
    {
        path: "/scheduler",
        element: <AppWrapper><TaskScheduler /></AppWrapper>
    },
    {
        path: "/users",
        element: <AppWrapper><UserManagement /></AppWrapper>
}]

ReactDOM.render(
  <BrowserRouter>
    <Routes>
        {routes.map(({path, element}) => <Route path={path} element={element}/> )}
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);