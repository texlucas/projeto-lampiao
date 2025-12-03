import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Formulario from "../pages/Formulario/Formulario";

const Router = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/formulario" element={<Formulario />} />
        </Routes>
    </div>
  )
}

export default Router