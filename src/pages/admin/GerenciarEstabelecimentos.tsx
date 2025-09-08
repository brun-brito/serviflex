import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Estabelecimento } from "../../types";

export default function GerenciarEstabelecimentos() {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const carregarEstabelecimentos = async () => {
    setLoading(true);
    setErro("");
    try {
      const response = await api.get("/estabelecimentos");
      setEstabelecimentos(response.data || []);
    } catch (err) {
      setErro("Erro ao carregar estabelecimentos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEstabelecimentos();
  }, []);

  // Filtrar estabelecimentos pelo responsavelUid do usuário logado
  const usuarioId = localStorage.getItem("usuarioId");
  const estabelecimentosFiltrados = estabelecimentos.filter(
    (est) => est.responsavelUid === usuarioId
  );

  const handleEditar = (id: string) => {
    if (id) {
      navigate(`/admin/estabelecimentos/editar/${id}`);
    } else {
      console.error("ID do estabelecimento não fornecido");
    }
  };

  const handleProfissionais = (id: string) => {
    if (id) {
      navigate(`/admin/estabelecimentos/${id}/profissionais`);
    } else {
      console.error("ID do estabelecimento não fornecido");
    }
  };

  const handleAdicionar = () => {
    navigate("/admin/estabelecimentos/criar");
  };

  const handleVoltar = () => {
    navigate("/admin");
  };

  return (
    <div className="container my-4">
      <div className="mb-4">
        <h2>Gerenciar Estabelecimentos</h2>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            {estabelecimentosFiltrados.length === 0 ? (
              <div className="text-center text-muted py-4">
                <p>Nenhum estabelecimento encontrado.</p>
                <button
                  className="btn btn-primary"
                  onClick={handleAdicionar}
                >
                  Criar primeiro estabelecimento
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Estabelecimento</th>
                      <th>Categoria</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {estabelecimentosFiltrados.map((estabelecimento, index) => (
                      <tr key={estabelecimento.id || index}>
                        <td style={{ width: "60%" }}>
                          <div className="d-flex align-items-center">
                            {/* Área da foto - sempre presente mesmo que vazia */}
                            <div className="me-3 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", flexShrink: 0 }}>
                              {estabelecimento.fotoURL && (
                                <img
                                  src={estabelecimento.fotoURL}
                                  alt={estabelecimento.nome}
                                  className="rounded"
                                  style={{ 
                                    width: "60px", 
                                    height: "60px", 
                                    objectFit: "cover" 
                                  }}
                                />
                              )}
                            </div>
                            
                            {/* Informações do estabelecimento */}
                            <div className="flex-grow-1">
                              <div className="fw-bold fs-6 mb-1">{estabelecimento.nome}</div>
                              {estabelecimento.descricao && (
                                <div 
                                  className="text-muted small"
                                  style={{ 
                                    wordWrap: "break-word",
                                    wordBreak: "break-word",
                                    lineHeight: "1.3",
                                    maxHeight: "3.9em", // Aproximadamente 3 linhas
                                    maxWidth: "350px", // Limite de largura para controlar chars por linha
                                    overflow: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3, // Máximo 3 linhas
                                    WebkitBoxOrient: "vertical"
                                  }}
                                  title={estabelecimento.descricao} // Tooltip com texto completo
                                >
                                  {estabelecimento.descricao.length > 120 
                                    ? `${estabelecimento.descricao.substring(0, 120)}...`
                                    : estabelecimento.descricao}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="align-middle">
                          <span className="badge bg-secondary">
                            {estabelecimento.categoria}
                          </span>
                        </td>
                        
                        <td className="align-middle">
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditar(estabelecimento.id!)}
                              disabled={!estabelecimento.id}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => handleProfissionais(estabelecimento.id!)}
                              disabled={!estabelecimento.id}
                            >
                              Profissionais
                            </button>
                          </div>
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

      {/* Botão Adicionar na parte inferior */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-success btn-lg"
          onClick={handleAdicionar}
        >
          + Adicionar Estabelecimento
        </button>
      </div>

      {/* Botão Voltar */}
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-secondary"
          onClick={handleVoltar}
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}
