<<<<<<< HEAD
import { useState } from "react"

import { Button } from "@/components/ui/button"
=======
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
>>>>>>> a2a0cd52ef31b658078c8d35180b522e8cdf74a6
import {
  Card,
  CardContent,
  CardFooter,
<<<<<<< HEAD
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { PasswordInput } from "@/components/password-input"

=======
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
>>>>>>> a2a0cd52ef31b658078c8d35180b522e8cdf74a6
import styles from "./Login.module.css";
import background from "../../assets/images/backkground.png";
import logo from "../../assets/images/LAMPIAO logo.png";
import logo2 from "../../assets/images/lampiao-logo2.png";

const Login = () => {
<<<<<<< HEAD
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email:", email)
    console.log("Password:", password)
  }
=======
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // -------------------------
  //     HANDLE LOGIN
  // -------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {
          email,
          senha,
        }
      );

      console.log("Login success:", response.data);

      // Save token
      localStorage.setItem("token", response.data.token);

      // Redirect somewhere
      // window.location.href = "/dashboard";

    } catch (error: any) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais."
      );
    }
  };
>>>>>>> a2a0cd52ef31b658078c8d35180b522e8cdf74a6

  return (
    <>
      <div className={styles.container}>
<<<<<<< HEAD
        <div 
          className={styles.background} 
          style={{ backgroundImage: `url(${background})` }}
        >
          <img className={styles.logo} src={logo} alt="Coletivo Lampião da Esquina" />
=======
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${background})` }}
        >
          <img
            className={styles.logo}
            src={logo}
            alt="Coletivo Lampião da Esquina"
          />
>>>>>>> a2a0cd52ef31b658078c8d35180b522e8cdf74a6
        </div>

        <div className={styles.forms}>
<<<<<<< HEAD

          <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
            <img src={logo2} alt="Logo Lampião da Esquina" /> 
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
              <h2 style={{fontSize: '30px', fontWeight: '600'}}>Entre na sua conta</h2>
              <h4 style={{fontSize: '20px'}}>Digite seu email e senha para entrar.</h4>
=======
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={logo2} alt="Logo Lampião da Esquina" />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "30px", fontWeight: "600" }}>
                Entre na sua conta
              </h2>
              <h4 style={{ fontSize: "20px" }}>
                Digite seu email e senha para entrar.
              </h4>
>>>>>>> a2a0cd52ef31b658078c8d35180b522e8cdf74a6
            </div>
          </div>

          <Card className="w-full max-w-sm">
            <CardContent>
<<<<<<< HEAD
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="E-mail"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <PasswordInput
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      placeholder="Senha"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <label className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          checked={rememberMe} 
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 cursor-pointer"
                        />
                        Manter conectado
                      </label>
=======
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />

>>>>>>> a2a0cd52ef31b658078c8d35180b522e8cdf74a6
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-600"
                    >
                      Esqueceu a senha?
                    </a>
                    </div>
                  </div>

                </div>
              </form>
            </CardContent>
<<<<<<< HEAD
            <CardFooter className="flex-col gap-2">
              <Button 
                type="submit"
                onClick={handleSubmit}
                className="
                  w-full h-12 rounded-xl font-inter text-white text-base
                  bg-[#76477C] hover:bg-[#603366]
                  border shadow-sm cursor-pointer transition
                ">
                Log In
              </Button>

              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span>Não tem uma conta?</span>
                <a 
                  href="#" 
                  className="inline-block text-sm underline-offset-4 hover:underline text-blue-600">
                  Cadastre-se
                </a>
              </div>

            </CardFooter>

          </Card>

=======

            <CardFooter className="flex-col gap-2">
              <Button
                onClick={handleLogin}
                className="w-full bg-fuchsia-800 hover:bg-fuchsia-900 h-11"
              >
                Log In
              </Button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <a>Não tem uma conta?</a>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-600"
                >
                  Cadastre-se
                </a>
              </div>
            </CardFooter>
          </Card>
>>>>>>> a2a0cd52ef31b658078c8d35180b522e8cdf74a6
        </div>

      </div>
    </>
  );
};

export default Login;
