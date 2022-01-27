import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Login from "./components/dashboard/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserManagement from "./components/user/UserManagement";
import Dashboard from "./components/dashboard/Dashboard";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <App>
            <Dashboard />
          </App>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Login />} />
      <Route
        path="/users"
        element={
          <App>
            <UserManagement />
          </App>
        }
      />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
