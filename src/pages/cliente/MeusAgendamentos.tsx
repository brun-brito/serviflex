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
  profissional_nome?: string;
}

interface Estabelecimento {
  id: string;
  nome: string;
  imagem_url?: string;
}

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  const idCliente = localStorage.getItem("usuarioId");

  useEffect(() => {
    const carregarAgendamentosComNomes = async () => {
      try {
        const [agRes, profRes] = await Promise.all([
          api.get(`/agendamentos/cliente/${idCliente}`),
          api.get("/estabelecimentos"),
        ]);

        const profissionais: Estabelecimento[] = profRes.data;

        // Criar mapa de ID para nome
        const mapaNomes: Record<string, string> = {};
        profissionais.forEach((p) => {
          mapaNomes[p.id] = p.nome;
        });

        // Substituir IDs por nomes
        const agendamentosComNomes = agRes.data.map((ag: Agendamento) => ({
          ...ag,
          profissional_nome: mapaNomes[ag.profissional_id] || "Desconhecido",
        }));

        setAgendamentos(agendamentosComNomes);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      } finally {
        setCarregando(false);
      }
    };

    if (idCliente) {
      carregarAgendamentosComNomes();
    }
  }, [idCliente]);

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div style={{ minWidth: "350px", maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Meus Agendamentos</h2>

        {carregando ? (
          <div className="text-center">Carregando agendamentos...</div>
        ) : agendamentos.length === 0 ? (
          <div className="alert alert-info text-center">
            Você ainda não tem agendamentos.
          </div>
        ) : (
          <div>
            {agendamentos.map((ag) => (
              <div
                key={ag.id}
                className="mb-4 card-body text-center"
                style={{ wordBreak: "break-word" }}
              >
                <div
                  className="card shadow-sm p-3"
                  style={{ width: "100%" }}
                >
                  <div className="card-body text-center">
                    <h5 className="card-title">{ag.procedimento}</h5>
                    <p className="card-text mb-2">
                      <strong>Data:</strong>{" "}
                      {format(new Date(ag.data_hora), "dd 'de' MMMM 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                    <p className="card-text mb-0">
                      <strong>Profissional:</strong> {ag.profissional_nome}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/listaEstabelecimentos")}
        >
          Voltar para os estabelecimentos
        </button>
      </div>
    </div>
  );
}
