import { useState, useEffect } from "react";
import styles from "./Formulario.module.css";

import logo from "../../assets/images/LAMPIAO logo.png";
import logo3 from "../../assets/images/lampiao-logo3.png";

import { UserCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";

interface Usuario {
  id: string;
  nome: string;
  email: string;
}


const Formulario = () => {
  const [anonimo, setAnonimo] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [classificacao, setClassificacao] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado.");
        return;
      }

      console.log({ anonimo, descricao, classificacao, files });

      const formData = new FormData();

      formData.append("descricao", descricao);
      formData.append("categoria", classificacao);
      formData.append("anonima", anonimo ? "1" : "0");
      formData.append("id_usuario", String(usuario?.id));

      const response = await axios.post(
        "http://localhost:3000/denuncias",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Denúncia enviada:", response.data);
      alert("Denúncia enviada com sucesso!");

      setDescricao("");
      setClassificacao("");
      setFiles(null);
      setAnonimo(false);

    } catch (error: any) {
      console.error("Erro ao enviar denúncia:", error);
      alert(error.response?.data?.message || "Erro ao enviar denúncia.");
    }
  };

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

  useEffect(() => {
    const loadData = async () => {
      await fetchUsuario();
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
          <h4 style={{ display: "flex", gap: "0.5rem" }}>
            <UserCircle /> {usuario?.nome}
          </h4>
        </header>

        <main className={styles.body}>
          <div className={styles.formWrapper}>
            <h1 className={styles.title}>Formulário de denúncia</h1>
            <p className={styles.subtitle}>
              Sua denúncia é importante. Você pode se identificar ou permanecer anônimo.
              As informações enviadas são confidenciais e avaliadas pela nossa equipe.
            </p>

            <hr className={styles.divider} />

            <form className={styles.formContent} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Prefere enviar essa denúncia de forma anônima?
                </label>

                <div className={styles.checkbox}>
                  <p className={styles.helpText}>
                    Se sim, seu nome não aparecerá para nossa equipe.
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Checkbox
                      checked={anonimo}
                      onCheckedChange={(v) => setAnonimo(Boolean(v))}
                      id="anonimo"
                      className="bg-white cursor-pointer"
                    />
                    <label htmlFor="anonimo" className={styles.checkboxLabel}>
                      Quero ficar anônimo.
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Queremos te ouvir, conte o que aconteceu:
                </label>
                <p className={styles.helpText}>
                  Cite data, horário, local e pessoas envolvidas.
                </p>

                <Textarea
                  className={styles.textarea}
                  placeholder="Descreva o que ocorreu."
                  onChange={(e) => setDescricao(e.target.value)}
                  value={descricao}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Como você sente que deve ser classificado?</label>
                <p className={styles.helpText}>
                  Essa classificação ajudará nossa equipe.
                </p>

                <Select value={classificacao} onValueChange={setClassificacao}>
                  <SelectTrigger className="w-[300px] bg-white">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="1">Agressão</SelectItem>
                    <SelectItem value="2">Assédio</SelectItem>
                    <SelectItem value="3">Discriminação</SelectItem>
                    <SelectItem value="4">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Se possível, adicione fotos ou áudios:</label>
                <p className={styles.helpText}>
                  Anexe o que achar relevante.
                </p>

                <label className={styles.uploadBox}>
                  <Upload size={28} />
                  <p className="text-sm mt-2">
                    <strong>Click to upload</strong> or drag and drop
                    <br />SVG, PNG, JPG or GIF (max. 800×400px)
                  </p>
                  <Input type="file" multiple className="hidden" />
                </label>
              </div>

              <Button
                className={styles.submitButton}
                type="submit"
              >
                Enviar
              </Button>

            </form>
          </div>
        </main>

        <footer className={styles.footer}>
          <img src={logo} className={styles.logo} alt="Coletivo Lampião da Esquina" />
        </footer>
      </div>
    </>
  );
};

export default Formulario;
