import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

type Profissional = {
  UID: string;
  Nome: string;
  FotoURL?: string;
  procedimentos?: string[]; // nomes dos procedimentos
};

export default function ProfissionaisDoEstabelecimento() {
  const { id } = useParams<{ id: string }>();
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [, setProcedimentosPorProf] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErro("");
    api.get(`/estabelecimentos/${id}/profissionais`)
      .then(async res => {
        const lista = res.data || [];
        // Buscar dados completos de cada profissional e seus procedimentos
        const profissionaisCompletos: Profissional[] = await Promise.all(
          lista.map(async (prof: any) => {
            try {
              const profRes = await api.get(`/profissionais/${prof.UID}`);
              const procRes = await api.get(`/procedimentos/${prof.UID}`);
              const nomesProcedimentos = Array.isArray(procRes.data)
                ? procRes.data.map((p: any) => p.nome?.toLowerCase() || "")
                : [];
              setProcedimentosPorProf(prev => ({
                ...prev,
                [prof.UID]: nomesProcedimentos,
              }));
              return {
                UID: prof.UID,
                Nome: profRes.data.nome || prof.Nome,
                FotoURL: profRes.data.fotoUrl || profRes.data.imagem_url || "",
                procedimentos: nomesProcedimentos,
              };
            } catch {
              return {
                UID: prof.UID,
                Nome: prof.Nome,
                FotoURL: "",
                procedimentos: [],
              };
            }
          })
        );
        setProfissionais(profissionaisCompletos);
      })
      .catch(() => setErro("Erro ao carregar profissionais."))
      .finally(() => setLoading(false));
  }, [id]);

  // Filtra profissionais pelo nome do procedimento
  const profissionaisFiltrados = busca
    ? profissionais.filter((prof) =>
        (prof.procedimentos || []).some((proc) =>
          proc.includes(busca.toLowerCase())
        )
      )
    : profissionais;

  return (
    <div className="container my-4">
      <button className="btn btn-link mb-3" onClick={() => navigate("/listaEstabelecimentos")}>
        &larr; Voltar
      </button>
      <h2 className="mb-4 text-center">Profissionais do Estabelecimento</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar por procedimento..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : profissionaisFiltrados.length === 0 ? (
        <div className="alert alert-warning text-center">
          Nenhum profissional foi encontrado para esse procedimento.
        </div>
      ) : (
        <ul className="list-group">
          {profissionaisFiltrados.map((prof) => (
            <li key={prof.UID} className="list-group-item d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                {prof.FotoURL && (
                  <img
                    src={prof.FotoURL}
                    alt={prof.Nome}
                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "50%", marginRight: 16 }}
                  />
                )}
                <span style={{ fontWeight: 500 }}>{prof.Nome}</span>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/procedimentos/${prof.UID}`, { state: { estabelecimentoId: id } })}
              >
                Selecionar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
