import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Formulario from "../pages/Formulario/Formulario";
import ProtectedRoute from "./ProtectedRoute";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/formulario"
        element={
          <ProtectedRoute>
            <Formulario />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;