import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../../services/api";

export default function ConfirmarAgendamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cliente_id, profissional_id, procedimento, dataHora, estabelecimentoId, valor } =
    location.state;
  // const dataHoraFinal = new Date(dataHora);
  // const dataHoraFormatada = dataHoraFinal.toISOString().split(".")[0] + "Z";

  const [profissionalNome, setProfissionalNome] = useState<string>("");

  useEffect(() => {
    const buscarProfissional = async () => {
      if (!profissional_id) return;
      try {
        const res = await api.get(`/profissionais/${profissional_id}`);
        setProfissionalNome(res.data?.nome || "Profissional");
      } catch {
        setProfissionalNome("Profissional");
      }
    };
    buscarProfissional();
  }, [profissional_id]);

  const confirmarAgendamento = async () => {
    try {
      const payload = {
        cliente_id,
        profissional_id,
        procedimento,
        data_hora: new Date(dataHora).toISOString(),
        estabelecimento_id: estabelecimentoId,
      };

      console.log("Enviando agendamento:", payload);

      await api.post("/agendamentos", payload);

      alert("Agendamento confirmado com sucesso!");
      navigate("/MeusAgendamentos"); // Redireciona após confirmação
    } catch (error) {
      console.error("Erro ao agendar:", error);
      alert("Erro ao confirmar agendamento.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Confirmar Agendamento</h2>
      <div className="card p-4">
        <p>
          <strong>Profissional:</strong> {profissionalNome}
        </p>
        <p>
          <strong>Procedimento:</strong> {procedimento}
        </p>
        <p>
          <strong>Data:</strong> {format(new Date(dataHora), "dd/MM/yyyy")}
        </p>
        <p>
          <strong>Horário:</strong> {format(new Date(dataHora), "HH:mm")}
        </p>
        <p>
          <strong>Valor:</strong> R${valor.toFixed(2)}
        </p>

        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={confirmarAgendamento}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
