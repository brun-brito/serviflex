import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import api from "../../services/api";

export default function VerAgenda() {
  const { idProfissional } = useParams();
  const location = useLocation();
  const procedimento = location.state?.procedimento;
  const procedimentoId = procedimento?.id;
  const estabelecimentoId = location.state?.estabelecimentoId || "";
  const navigate = useNavigate();
  const idCliente = localStorage.getItem("usuarioId");

  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(new Date());
  const [horariosGerados, setHorariosGerados] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  // Buscar dias disponíveis (dias da semana com horários cadastrados)
  useEffect(() => {
    if (!idProfissional) return;
    const carregarDias = async () => {
      try {
        setStatus("loading");
        const response = await api.get(`/horarios/${idProfissional}`);
        if (Array.isArray(response.data)) {
          const dias = response.data
            .filter((h: any) => h.disponivel)
            .map((h: any) =>
              h.dia_semana
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            );
          setDiasDisponiveis(dias);
        }
        setStatus("ok");
      } catch {
        setStatus("error");
      }
    };
    carregarDias();
  }, [idProfissional]);

  // Buscar horários disponíveis para o dia selecionado e procedimento
  useEffect(() => {
    if (!idProfissional || !dataSelecionada || !procedimentoId) {
      setHorariosGerados([]);
      return;
    }
    const buscarHorarios = async () => {
      setStatus("loading");
      try {
        const dataStr = format(dataSelecionada, "yyyy-MM-dd");
        const resp = await api.get(
          `/profissionais/${idProfissional}/horarios-disponiveis?data=${dataStr}&procedimento_id=${procedimentoId}`
        );
        setHorariosGerados(Array.isArray(resp.data.horarios) ? resp.data.horarios : []);
        setStatus("ok");
      } catch {
        setHorariosGerados([]);
        setStatus("error");
      }
    };
    buscarHorarios();
  }, [idProfissional, dataSelecionada, procedimentoId]);

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
        estabelecimentoId,
        valor: procedimento?.preco || 0
      },
    });
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div style={{ minWidth: "350px", maxWidth: "400px", width: "100%" }}>
        <button
          className="btn btn-link mb-3"
          onClick={() =>
            procedimento?.profissional_id
              ? navigate(`/procedimentos/${procedimento.profissional_id}`)
              : navigate(-1)
          }
        >
          &larr; Voltar
        </button>
        <h2 className="text-center mb-4">
          {procedimento?.nome || "Agendamento"}
        </h2>

        <div className="d-flex justify-content-center mb-4">
          {status === "error" ? (
            <div className="alert alert-danger text-center">
              Não foi possível carregar os horários. Tente novamente mais tarde.
            </div>
          ) : (
            <>
              {status === "loading" && (
                <div className="alert alert-secondary text-center">
                  Carregando horários…
                </div>
              )}
              <DayPicker
                mode="single"
                selected={dataSelecionada}
                onSelect={setDataSelecionada}
                locale={ptBR}
                weekStartsOn={0}
                className="border rounded p-3"
                disabled={desabilitarDias}
              />
            </>
          )}
        </div>

        <h5 className="text-center mb-3">
          Horários disponíveis em:{" "}
          {dataSelecionada
            ? format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })
            : "Selecione uma data"}
        </h5>

        {horariosGerados.length === 0 ? (
          <div className="alert alert-info text-center">
            Nenhum horário disponível nesse dia.
          </div>
        ) : (
          <div
            className="d-grid"
            style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}
          >
            {horariosGerados.map((hora, idx) => (
              <button
                key={idx}
                className="btn btn-outline-primary w-100"
                onClick={() => selecionarHorario(hora)}
              >
                {hora}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
