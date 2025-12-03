import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { PasswordInput } from "@/components/password-input"

import styles from "./Login.module.css";
import background from "../../assets/images/backkground.png";
import logo from "../../assets/images/LAMPIAO logo.png";
import logo2 from "../../assets/images/lampiao-logo2.png";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email:", email)
    console.log("Password:", password)
  }

  return (
    <>
      <div className={styles.container}>
        <div 
          className={styles.background} 
          style={{ backgroundImage: `url(${background})` }}
        >
          <img className={styles.logo} src={logo} alt="Coletivo Lampião da Esquina" />
        </div>
        <div className={styles.forms}>

          <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
            <img src={logo2} alt="Logo Lampião da Esquina" /> 
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
              <h2 style={{fontSize: '30px', fontWeight: '600'}}>Entre na sua conta</h2>
              <h4 style={{fontSize: '20px'}}>Digite seu email e senha para entrar.</h4>
            </div>
          </div>
          <Card className="w-full max-w-sm">
            <CardContent>
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

        </div>

      </div>
    </>
  )
}

export default Login
