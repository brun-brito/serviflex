import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import api from "../../services/api";

interface Agendamento {
  id: string;
  procedimento: string;
  data_hora: string;
  profissional_id: string;
  estabelecimento_id?: string;
  cliente_id: string;
}

export default function EditarAgendamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const agendamento: Agendamento = location.state?.agendamento;

  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(
    agendamento ? new Date(agendamento.data_hora) : new Date()
  );
  const [horariosGerados, setHorariosGerados] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [procedimentos, setProcedimentos] = useState<any[]>([]);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState<any>(null);

  useEffect(() => {
    if (!agendamento) {
      alert("Erro: dados do agendamento não encontrados");
      navigate("/MeusAgendamentos");
      return;
    }
    carregarDadosIniciais();
  }, [agendamento]);

  const carregarDadosIniciais = async () => {
    try {
      setStatus("loading");
      
      // Buscar procedimentos do profissional
      const procResponse = await api.get(`/procedimentos/${agendamento.profissional_id}`);
      setProcedimentos(procResponse.data);
      
      // Encontrar o procedimento atual
      const procAtual = procResponse.data.find((p: any) => p.nome === agendamento.procedimento);
      setProcedimentoSelecionado(procAtual);

      // Buscar dias disponíveis do profissional
      const horariosResponse = await api.get(`/horarios/${agendamento.profissional_id}`);
      if (Array.isArray(horariosResponse.data)) {
        const dias = horariosResponse.data
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
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setStatus("error");
    }
  };

  // Buscar horários disponíveis quando mudar data ou procedimento
  useEffect(() => {
    if (!agendamento?.profissional_id || !dataSelecionada || !procedimentoSelecionado?.id) {
      setHorariosGerados([]);
      return;
    }
    buscarHorarios();
  }, [dataSelecionada, procedimentoSelecionado]);

  const buscarHorarios = async () => {
    setStatus("loading");
    try {
      const dataStr = format(dataSelecionada!, "yyyy-MM-dd");
      const resp = await api.get(
        `/profissionais/${agendamento.profissional_id}/horarios-disponiveis?data=${dataStr}&procedimento_id=${procedimentoSelecionado.id}`
      );
      setHorariosGerados(Array.isArray(resp.data.horarios) ? resp.data.horarios : []);
      setStatus("ok");
    } catch {
      setHorariosGerados([]);
      setStatus("error");
    }
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

  const salvarEdicao = async (hora: string) => {
    if (!dataSelecionada || !procedimentoSelecionado) return;

    const [h, m] = hora.split(":").map(Number);
    const novaDataHora = new Date(dataSelecionada);
    novaDataHora.setHours(h, m, 0, 0);

    try {
      const agendamentoAtualizado = {
        ...agendamento,
        procedimento: procedimentoSelecionado.nome,
        data_hora: novaDataHora.toISOString(),
      };

      await api.put(`/agendamentos/${agendamento.id}`, agendamentoAtualizado);
      alert("Agendamento atualizado com sucesso!");
      navigate("/MeusAgendamentos");
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      alert("Erro ao atualizar agendamento");
    }
  };

  if (!agendamento) return null;

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div style={{ minWidth: "350px", maxWidth: "500px", width: "100%" }}>
        <button
          className="btn btn-link mb-3"
          onClick={() => navigate("/MeusAgendamentos")}
        >
          &larr; Voltar
        </button>
        <h2 className="text-center mb-4">Editar Agendamento</h2>

        {/* Seleção de Procedimento */}
        <div className="mb-4">
          <label className="form-label">Procedimento:</label>
          <select
            className="form-select"
            value={procedimentoSelecionado?.id || ""}
            onChange={(e) => {
              const proc = procedimentos.find(p => p.id === e.target.value);
              setProcedimentoSelecionado(proc);
            }}
          >
            <option value="">Selecione um procedimento</option>
            {procedimentos.map((proc) => (
              <option key={proc.id} value={proc.id}>
                {proc.nome} - R$ {proc.preco} ({proc.duracao_min} min)
              </option>
            ))}
          </select>
        </div>

        {/* Calendário */}
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

        {!procedimentoSelecionado ? (
          <div className="alert alert-info text-center">
            Selecione um procedimento para ver os horários disponíveis.
          </div>
        ) : horariosGerados.length === 0 ? (
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
                onClick={() => salvarEdicao(hora)}
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
