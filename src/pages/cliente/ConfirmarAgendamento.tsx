import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../../services/api";

export default function ConfirmarAgendamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cliente_id, profissional_id, procedimento, dataHora } =
    location.state;
  const dataHoraFinal = new Date(dataHora);
  const dataHoraFormatada = dataHoraFinal.toISOString().split(".")[0] + "Z";

  const confirmarAgendamento = async () => {
    try {
      const payload = {
        cliente_id,
        profissional_id,
        procedimento,
        data_hora: new Date(dataHora).toISOString(),
      };

      console.log("Enviando agendamento:", payload);

      await api.post("/agendamentos", {
        cliente_id,
        profissional_id,
        procedimento,
        data_hora: new Date(dataHoraFormatada).toISOString(),
      });

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
          <strong>Profissional:</strong> {localStorage.getItem("usuarioNome")}
        </p>
        <p>
          <strong>Procedimento:</strong> {procedimento}
        </p>
        <p>
          <strong>Data:</strong> {format(new Date(dataHora), "dd/MM/yyyy")}
        </p>
        <p>
          <strong>Hora:</strong> {format(new Date(dataHora), "HH:mm")}
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
