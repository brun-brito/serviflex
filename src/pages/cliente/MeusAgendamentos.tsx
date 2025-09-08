import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

interface Agendamento {
  id: string;
  procedimento: string;
  data_hora: string;
  profissional_id: string;
  estabelecimento_id?: string;
  profissional_nome?: string;
  estabelecimento_nome?: string;
}

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  const idCliente = localStorage.getItem("usuarioId");

  useEffect(() => {
    carregarAgendamentos();
  }, [idCliente]);

  const carregarAgendamentos = async () => {
    try {
      const [agRes, profsRes, estRes] = await Promise.all([
        api.get(`/agendamentos/cliente/${idCliente}`),
        api.get("/profissionais"),
        api.get("/estabelecimentos"),
      ]);

      const profissionais: any[] = profsRes.data;
      const estabelecimentos: any[] = estRes.data;

      // Mapas de id para nome
      const mapaProfissionais: Record<string, string> = {};
      profissionais.forEach((p) => {
        mapaProfissionais[p.id] = p.nome;
      });

      const mapaEstabelecimentos: Record<string, string> = {};
      estabelecimentos.forEach((e) => {
        mapaEstabelecimentos[e.id] = e.nome;
      });

      let ags: Agendamento[] = agRes.data || [];

      // Ordenar por data/hora (mais recentes primeiro)
      ags = ags.sort((a, b) =>
        new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime()
      );

      // Substituir IDs por nomes
      const agendamentosComNomes = ags.map((ag: Agendamento) => ({
        ...ag,
        profissional_nome: mapaProfissionais[ag.profissional_id] || "Desconhecido",
        estabelecimento_nome: ag.estabelecimento_id
          ? mapaEstabelecimentos[ag.estabelecimento_id] || "Desconhecido"
          : "Não informado",
      }));

      setAgendamentos(agendamentosComNomes);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      alert("Erro ao carregar agendamentos");
    } finally {
      setCarregando(false);
    }
  };

  const cancelarAgendamento = async (agendamentoId: string) => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;

    try {
      await api.delete(`/agendamentos/${agendamentoId}`);
      alert("Agendamento cancelado com sucesso!");
      carregarAgendamentos(); // Recarregar a lista
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      alert("Erro ao cancelar agendamento");
    }
  };

  const editarAgendamento = (agendamento: Agendamento) => {
    // Navegar para tela de edição, passando os dados do agendamento
    navigate("/editar-agendamento", { state: { agendamento } });
  };

  const podeEditarOuCancelar = (dataHora: string) => {
    const agora = new Date();
    const dataAgendamento = new Date(dataHora);
    return dataAgendamento > agora;
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div style={{ minWidth: "350px", maxWidth: "500px", width: "100%" }}>
        <button
          className="btn btn-link mb-3"
          onClick={() => navigate("/listaEstabelecimentos")}
        >
          &larr; Voltar
        </button>
        <h2 className="text-center mb-4">Meus Agendamentos</h2>

        {carregando ? (
          <div className="text-center">Carregando agendamentos...</div>
        ) : agendamentos.length === 0 ? (
          <div className="alert alert-info text-center">
            Você ainda não tem agendamentos.
          </div>
        ) : (
          <div>
            {agendamentos.map((ag) => {
              const podeEditar = podeEditarOuCancelar(ag.data_hora);
              
              return (
                <div
                  key={ag.id}
                  className="mb-4"
                  style={{ wordBreak: "break-word" }}
                >
                  <div className="card shadow-sm p-3" style={{ width: "100%" }}>
                    <div className="card-body">
                      <h5 className="card-title text-center">{ag.procedimento}</h5>
                      <p className="card-text mb-2 text-center">
                        <strong>Data:</strong>{" "}
                        {format(
                          new Date(ag.data_hora),
                          "dd 'de' MMMM 'às' HH:mm",
                          {
                            locale: ptBR,
                          }
                        )}
                      </p>
                      <p className="card-text mb-2 text-center">
                        <strong>Profissional:</strong> {ag.profissional_nome}
                      </p>
                      <p className="card-text mb-3 text-center">
                        <strong>Estabelecimento:</strong> {ag.estabelecimento_nome}
                      </p>
                      
                      {!podeEditar && (
                        <p className="text-muted text-center mb-3 small">
                          <i className="bi bi-info-circle me-1"></i>
                          Agendamento já realizado
                        </p>
                      )}
                      
                      {podeEditar && (
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => editarAgendamento(ag)}
                          disabled={!podeEditar}
                          title={!podeEditar ? "Não é possível editar agendamentos passados" : ""}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Editar
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => cancelarAgendamento(ag.id)}
                          disabled={!podeEditar}
                          title={!podeEditar ? "Não é possível cancelar agendamentos passados" : ""}
                        >
                          <i className="bi bi-x me-1"></i>
                          Cancelar
                        </button>
                      </div>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
