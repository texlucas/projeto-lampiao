import { useState } from "react"
import styles from "./Home.module.css";
import logo from "../../assets/images/LAMPIAO logo.png";
import logo3 from "../../assets/images/lampiao-logo3.png";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button"
import { IoMdMegaphone } from "react-icons/io";

const Home = () => {


  return (
    <>
    <div className={styles.container}>
        <header className={styles.header}>
            <img src={logo3} alt="Coletivo Lampião da Esquina" />
            <p>Olá João, como podemos te ajudar?</p>
            <h4 style={{display: "flex", gap: "0.5rem"}}><UserCircle />João</h4>
        </header>
        <main className={styles.body}>
            <Button 
                type="submit"
                className="
                    w-[28rem] mx-400 h-12
                    bg-[#FBDAFF] border border-[#A567AD] 
                    text-[#76477C] font-semibold tracking-wide uppercase
                    flex items-center justify-center gap-2
                    hover:bg-[#edc4f2] transition cursor-pointer
                ">
                <IoMdMegaphone />
                FAZER DENÚNCIA
            </Button>
            <p>Você não possui denúncias feitas</p>
        </main>
        <footer className={styles.footer}>
            <img src={logo} className={styles.logo} alt="Coletivo Lampião da Esquina" />
        </footer>
    </div>
    </>
  )
}

export default Home
