import { useState } from "react";
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
import { useNavigate } from "react-router-dom";


const Formulario = () => {
  const [anonimo, setAnonimo] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <img src={logo3} alt="Coletivo Lampião da Esquina" onClick={() => navigate("/home")} style={{cursor: "pointer"}} />
          <p>Olá João, como podemos te ajudar?</p>
          <h4 style={{ display: "flex", gap: "0.5rem" }}>
            <UserCircle /> João
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

            <form className={styles.formContent}>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Prefere enviar essa denúncia de forma anônima?
                </label>

                <div className={styles.checkbox}>
                <p className={styles.helpText}>
                  Se sim, seu nome não aparecerá para nossa equipe.
                </p>
                <div style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
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
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Como você sente que deve ser classificado?</label>
                <p className={styles.helpText}>
                  Essa classificação ajudará nossa equipe.
                </p>

                <Select>
                  <SelectTrigger className="w-[300px] bg-white">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="agressao">Agressão</SelectItem>
                    <SelectItem value="assedio">Assédio</SelectItem>
                    <SelectItem value="discriminacao">Discriminação</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
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
