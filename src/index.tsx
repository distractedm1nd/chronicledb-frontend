import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppWrapper from "./AppWrapper";
import Login from "./components/dashboard/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserManagement from "./components/user/UserManagement";
import Dashboard from "./components/dashboard/Dashboard";
import TaskScheduler from "./components/scheduler/TaskScheduler";

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
        path: "/logout",
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