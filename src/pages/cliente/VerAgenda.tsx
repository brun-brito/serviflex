import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { format, addHours, setHours, setMinutes } from "date-fns";
import api from "../../services/api";

interface HorarioDisponivel {
  id: string;
  profissional_id: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  disponivel: boolean;
}

// 🔤 Utilitário para remover acentos
const normalizarDia = (dia: string) =>
  dia
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function VerAgenda() {
  const { idProfissional } = useParams();
  const location = useLocation();
  const procedimento = location.state?.procedimento;
  const navigate = useNavigate();
  const idCliente = localStorage.getItem("usuarioId");

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<
    HorarioDisponivel[]
  >([]);
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(
    new Date()
  );
  const [horariosGerados, setHorariosGerados] = useState<string[]>([]);

  useEffect(() => {
    if (!idProfissional) return;

    const carregarHorarios = async () => {
      try {
        const response = await api.get(`/horarios/${idProfissional}`);
        if (Array.isArray(response.data)) {
          const horariosFiltrados = response.data.filter(
            (h: HorarioDisponivel) => h.disponivel
          );
          setHorariosDisponiveis(horariosFiltrados);

          const dias = horariosFiltrados.map((h: HorarioDisponivel) =>
            normalizarDia(h.dia_semana)
          );
          setDiasDisponiveis(dias);
        }
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      }
    };

    carregarHorarios();
  }, [idProfissional]);

  useEffect(() => {
    if (!dataSelecionada) return;

    const diasSemana = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];
    const diaSemana = diasSemana[dataSelecionada.getDay()];

    const horariosDoDia = horariosDisponiveis.filter(
      (h) => normalizarDia(h.dia_semana) === diaSemana && h.disponivel
    );

    if (horariosDoDia.length > 0) {
      const { hora_inicio, hora_fim } = horariosDoDia[0]; // assume um intervalo por dia
      const [hiH, hiM] = hora_inicio.split(":").map(Number);
      const [hfH, hfM] = hora_fim.split(":").map(Number);

      let atual = setMinutes(setHours(dataSelecionada, hiH), hiM);
      const fim = setMinutes(setHours(dataSelecionada, hfH), hfM);

      const horarios: string[] = [];
      while (atual < fim) {
        horarios.push(format(atual, "HH:mm"));
        atual = addHours(atual, 1);
      }

      setHorariosGerados(horarios);
    } else {
      setHorariosGerados([]);
    }
  }, [dataSelecionada, horariosDisponiveis]);

  const selecionarHorario = (hora: string) => {
    if (!dataSelecionada) return;

    const [h, m] = hora.split(":").map(Number);
    const dataHora = new Date(dataSelecionada);
    dataHora.setHours(h, m, 0, 0);

    navigate("/ConfirmarAgendamento", {
      state: {
        cliente_id: idCliente,
        profissional_id: idProfissional,
        procedimento: procedimento?.nome || "Procedimento",
        dataHora,
      },
    });
  };

  const desabilitarDias = (date: Date) => {
    const diasSemana = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];
    const nomeDia = diasSemana[date.getDay()];
    return !diasDisponiveis.includes(nomeDia);
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div style={{ minWidth: "350px", maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">
          {procedimento?.nome || "Agendamento"}
        </h2>

        <div className="d-flex justify-content-center mb-4">
          <DayPicker
            mode="single"
            selected={dataSelecionada}
            onSelect={setDataSelecionada}
            locale={ptBR}
            weekStartsOn={0}
            className="border rounded p-3"
            disabled={desabilitarDias}
          />
        </div>

        <h5 className="text-center mb-3">
          Horários disponíveis em:{" "}
          {dataSelecionada
            ? format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
            : "Selecione uma data"}
        </h5>

        {horariosGerados.length === 0 ? (
          <div className="alert alert-info text-center">
            Nenhum horário disponível nesse dia.
          </div>
        ) : (
          <div className="row justify-content-center">
            {horariosGerados.map((hora, idx) => (
              <div key={idx} className="col-3 col-md-2 m-2">
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => selecionarHorario(hora)}
                >
                  {hora}
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          className="btn btn-secondary mt-4"
          onClick={() => navigate(`/procedimentos/${idProfissional}`)}
        >
          Voltar para os procedimentos
        </button>
      </div>
    </div>
  );
}
