import { Button } from "@/components/ui/button"
import * as React from "react"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import styles from "./Register.module.css";
import background2 from "../../assets/images/backgroun2.png";
import logo from"../../assets/images/LAMPIAO logo.png";
import logo2 from"../../assets/images/lampiao-logo2.png";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PhoneInput } from "@/components/phone-input"
import { PasswordInput } from "@/components/password-input"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}
function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

const Register = () => {
    const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [value, setValue] = React.useState(formatDate(date))
  const [password, setPassword] = React.useState("")

  return (
    <>
      <div className={styles.container}>
        <div className={styles.background} style={{ backgroundImage: `url(${background2})` }}>
            <img className={styles.logo} src={logo} alt="Coletivo Lampião da Esquina" />
        </div>
        <div className={styles.forms}>
          <div  style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
            <img src={logo2} alt="Logo Lampião da Esquina" /> 
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                <h2 style={{fontSize: '30px', fontWeight: '600'}}>Cadastre-se</h2>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <h4 style={{fontSize: '20px'}}>Já possui uma conta?</h4>
                    <a href="#"className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-600 text-xl">
                      Log in
                    </a>
                </div>
            </div>
          </div>
          <Card className="w-full max-w-sm">
              <CardContent>
                  <form>
                  <div className="flex flex-col gap-3">
                      <div className="grid gap-2">
                      <div style={{display: 'flex', gap: '1rem'}}>
                        <Input
                          id="name"
                          type="name"
                          placeholder="Seu nome"
                          required
                        />
                        <Input
                            id="name2"
                            type="name2"
                            placeholder="Sobrenome"
                            required
                        />
                      </div>
                      <div className="relative flex gap-2"></div>
                      <Input
                          id="email"
                          type="email"
                          placeholder="E-mail"
                          required
                      />
                      </div>
                      <div className="grid gap-2">
                         <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={(e) => {
            const date = new Date(e.target.value)
            setValue(e.target.value)
            if (isValidDate(date)) {
              setDate(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Selecionar a data</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date)
                setValue(formatDate(date))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <PhoneInput id="telephone" type="telephone" placeholder="(XX) 99999-9999" />
    </div>
    <div className="relative flex gap-2"></div>                  
        <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
        />
        </div>
    </div>
    </form>
    </CardContent>
    <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full h-12 rounded-xl font-inter text-white text-base bg-[#76477C] hover:bg-[#603366] border shadow-sm cursor-pointer transition">
        Cadastrar
        </Button>
    </CardFooter>
    </Card>
        </div>
      </div>
    </>
  )
}

export default Register
