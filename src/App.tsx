import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SongManagement from "./pages/SongManagement";
import Subscription from "./pages/Subscription";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import AddSong from "./pages/AddSong";
import EditSong from "./pages/EditSong";
import NotFound from "./pages/NotFound";
import { CustomRouteProps } from "./types/route";
import { getAuthData } from "./utils/auth";
import { Payload } from "./types/user";

function App() {
  const ProtectedRoute = ({
    redirectPath = "/notfound",
    path,
    children,
    routeType,
  }: CustomRouteProps): JSX.Element => {
    if (localStorage.getItem("token") === null) {
      return (
        <>
          <Navigate to="/login" />;
        </>
      );
    } else {
      let isAdmin = false;
      const payload: Payload = getAuthData();
      if (payload) {
        isAdmin = payload.isAdmin;
      }
      if (isAdmin === routeType) {
        if (routeType === false) {
          if (payload.userId != 0) {
            return children;
          } else {
            return <Navigate to={redirectPath} />;
          }
        }
        return children;
      } else {
        return (
          <>
            <Navigate to={redirectPath} />;
          </>
        );
      }
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/subscription"
          element={
            <ProtectedRoute routeType={true} path="/subscription">
              <Subscription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/song-management"
          element={
            <ProtectedRoute routeType={false} path="/song-management">
              <SongManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-song"
          element={
            <ProtectedRoute routeType={false} path="/add-song">
              <AddSong />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-song/"
          element={
            <ProtectedRoute routeType={false} path="/edit-song/:id">
              <EditSong/>
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
