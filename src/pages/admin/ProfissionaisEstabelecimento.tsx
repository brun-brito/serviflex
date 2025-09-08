import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

interface ProfissionalEstabelecimento {
  UID: string;
  Nome?: string;
  Status: string;
  AdicionadoEm: string;
}

export default function ProfissionaisEstabelecimento() {
  const [profissionais, setProfissionais] = useState<ProfissionalEstabelecimento[]>([]);
  const [nomesProfissionais, setNomesProfissionais] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [estabelecimentoNome, setEstabelecimentoNome] = useState("");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const carregarProfissionais = async () => {
    if (!id) return;
    setLoading(true);
    setErro("");
    try {
      const response = await api.get(`/estabelecimentos/${id}/profissionais`);
      setProfissionais(response.data || []);
      // Buscar nomes dos profissionais
      const uids = (response.data || []).map((p: ProfissionalEstabelecimento) => p.UID);
      const nomes: Record<string, string> = {};
      await Promise.all(
        uids.map(async (uid: string) => {
          try {
            const res = await api.get(`/profissionais/${uid}`);
            nomes[uid] = res.data?.nome || "Nome não informado";
          } catch {
            nomes[uid] = "Nome não informado";
          }
        })
      );
      setNomesProfissionais(nomes);
    } catch (err) {
      setErro("Erro ao carregar profissionais.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const carregarEstabelecimento = async () => {
    if (!id) return;
    try {
      const response = await api.get(`/estabelecimentos/${id}`);
      setEstabelecimentoNome(response.data?.nome || "");
    } catch (err) {
      console.error("Erro ao carregar estabelecimento:", err);
    }
  };

  useEffect(() => {
    carregarProfissionais();
    carregarEstabelecimento();
  }, [id]);

  const handleAdicionarProfissional = () => {
    navigate(`/admin/estabelecimentos/${id}/profissionais/adicionar`);
  };

  const handleRemoverProfissional = async (profissionalId: string) => {
    if (!window.confirm("Tem certeza que deseja remover este profissional?")) {
      return;
    }
    try {
      await api.delete(`/estabelecimentos/${id}/profissionais/${profissionalId}`);
      await carregarProfissionais();
    } catch (err) {
      alert("Erro ao remover profissional.");
      console.error(err);
    }
  };

  const handleVoltar = () => {
    navigate("/admin/estabelecimentos");
  };

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="container my-4">
      <div className="mb-4">
        <h2>Profissionais do Estabelecimento</h2>
        {estabelecimentoNome && (
          <h5 className="text-muted">{estabelecimentoNome}</h5>
        )}
      </div>

      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando profissionais...</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            {profissionais.length === 0 ? (
              <div className="text-center py-5">
                <h5>Nenhum profissional vinculado</h5>
                <p className="text-muted">Este estabelecimento ainda não possui profissionais vinculados.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID do Profissional</th>
                      <th>Nome</th>
                      <th>Status</th>
                      <th>Adicionado em</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {profissionais.map((profissional) => (
                      <tr key={profissional.UID}>
                        <td className="font-monospace">{profissional.UID}</td>
                        <td>{nomesProfissionais[profissional.UID] || "Nome não informado"}</td>
                        <td>
                          <span className={`badge ${
                            profissional.Status === 'ativo' ? 'bg-success' : 'bg-warning'
                          }`}>
                            {profissional.Status}
                          </span>
                        </td>
                        <td>{formatarData(profissional.AdicionadoEm)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoverProfissional(profissional.UID)}
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botão Adicionar Profissional */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-success btn-lg"
          onClick={handleAdicionarProfissional}
        >
          + Adicionar Profissional
        </button>
      </div>

      {/* Botão Voltar */}
      <div className="d-flex justify-content-center mt-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={handleVoltar}
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}
