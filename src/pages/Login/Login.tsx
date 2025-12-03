import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "./Login.module.css";
import background from "../../assets/images/backkground.png";
import logo from "../../assets/images/LAMPIAO logo.png";
import logo2 from "../../assets/images/lampiao-logo2.png";

const Login = () => {
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

  return (
    <>
      <div className={styles.container}>
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${background})` }}
        >
          <img
            className={styles.logo}
            src={logo}
            alt="Coletivo Lampião da Esquina"
          />
        </div>

        <div className={styles.forms}>
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
            </div>
          </div>

          <Card className="w-full max-w-sm">
            <CardContent>
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

                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-600"
                    >
                      Esqueceu a senha?
                    </a>
                    </div>
                  </div>
              </form>
            </CardContent>

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
        </div>

      </div>
    </>
  );
};

export default Login;
