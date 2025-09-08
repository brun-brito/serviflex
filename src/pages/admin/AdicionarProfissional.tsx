import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function AdicionarProfissional() {
  const [profissionalId, setProfissionalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profissionalId.trim()) {
      setErro("ID do profissional é obrigatório.");
      return;
    }

    setLoading(true);
    setErro("");
    
    try {
      await api.post("/estabelecimentos/profissionais/convidar", {
        profissional_uid: profissionalId.trim(),
        estabelecimento_id: id
      });
      
      // Redireciona de volta para a lista
      navigate(`/admin/estabelecimentos/${id}/profissionais`);
    } catch (err: any) {
      console.error("Erro completo:", err);
      console.error("Response data:", err.response?.data);
      
      setErro(
        err.response?.data?.error || 
        err.response?.data?.message ||
        `Erro ao enviar convite: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate(`/admin/estabelecimentos/${id}/profissionais`);
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="mb-4">
            <h2>Adicionar Profissional</h2>
            <p className="text-muted">
              Informe o ID do profissional que você deseja adicionar a este estabelecimento.
            </p>
          </div>

          {erro && (
            <div className="alert alert-danger" role="alert">
              {erro}
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="profissionalId" className="form-label">
                    ID do Profissional <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="profissionalId"
                    value={profissionalId}
                    onChange={(e) => setProfissionalId(e.target.value)}
                    placeholder="Digite o ID único do profissional"
                    required
                    disabled={loading}
                  />
                  <div className="form-text">
                    O profissional receberá uma notificação para aceitar o convite.
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading || !profissionalId.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando convite...
                      </>
                    ) : (
                      "Enviar Convite"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="alert alert-info mt-4">
            <h6>Como funciona:</h6>
            <ul className="mb-0">
              <li>Você envia um convite para o profissional usando o ID dele</li>
              <li>O profissional receberá uma notificação no sistema</li>
              <li>Ele pode aceitar ou recusar o convite</li>
              <li>Se aceito, ele aparecerá na lista de profissionais vinculados</li>
            </ul>
          </div>

          {/* Botão Voltar */}
          <div className="d-flex justify-content-center mt-4">
            <button 
              className="btn btn-outline-secondary"
              onClick={handleVoltar}
              disabled={loading}
            >
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
