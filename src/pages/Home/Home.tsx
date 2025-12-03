import { useState, useEffect } from "react"
import styles from "./Home.module.css";
import logo from "../../assets/images/LAMPIAO logo.png";
import logo3 from "../../assets/images/lampiao-logo3.png";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button"
import { IoMdMegaphone } from "react-icons/io";
import DenunciaCard from "@/components/denuncia";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface DenunciaResponse {
  id: string;
  tipo: string;
  descricao: string;
  data: string;
  status: string;
}

const Home = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [denuncias, setDenuncias] = useState<DenunciaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchUsuario = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:3000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsuario(response.data);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
    }
  };

  const fetchDenuncias = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/denuncias/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDenuncias(response.data);
    } catch (err) {
      console.error("Erro ao buscar denúncias:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUsuario();
      await fetchDenuncias();
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <p>Carregando...</p>;


  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <img src={logo3} alt="Coletivo Lampião da Esquina" />
          <p>Olá {usuario?.nome}, como podemos te ajudar?</p>
          <h4 style={{ display: "flex", gap: "0.5rem" }}><UserCircle />{usuario?.nome}</h4>
        </header>
        <main className={styles.body}>
          <Button
            type="submit"
            onClick={() => navigate("/Formulario")}
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
          <div className={styles.cardsContainer}>
            {denuncias.length === 0 ? (
              <p>Você não possui denúncias feitas</p>
            ) : (
              <div className={styles.cardsContainer}>
                {denuncias.map((d) => (
                  <DenunciaCard
                    key={d.id}
                    tipo={d.tipo}
                    descricao={d.descricao}
                    data={d.data}
                    status={d.status as "Pendente" | "Em Análise" | "Resolvida"}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
        <footer className={styles.footer}>
          <img src={logo} className={styles.logo} alt="Coletivo Lampião da Esquina" />
        </footer>
      </div>
    </>
  )
}

export default Home