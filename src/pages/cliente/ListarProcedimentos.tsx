import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api"; // API de requisições configurada
import { Procedimento } from "../../types"; // Definir tipo para Procedimento

export default function ListarProcedimentos() {
  const { id } = useParams(); // id do profissional
  const location = useLocation();
  const navigate = useNavigate();
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]); // Inicializa como array vazio
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [estabelecimentoId, setEstabelecimentoId] = useState<string>("");

  // Busca o estabelecimentoId do state, ou do referrer, ou da API do profissional
  useEffect(() => {
    let foundId =
      location.state?.estabelecimentoId ||
      (document.referrer.includes("/estabelecimento/") &&
        document.referrer.split("/estabelecimento/")[1]?.split("/")[0]) ||
      "";

    if (foundId) {
      setEstabelecimentoId(foundId);
    } else if (id) {
      // Busca o profissional para descobrir o estabelecimentoId
      api.get(`/profissionais/${id}`).then(res => {
        if (res.data && res.data.estabelecimentoId) {
          setEstabelecimentoId(res.data.estabelecimentoId);
        }
      });
    }
  }, [id, location.state]);

  useEffect(() => {
    const fetchProcedimentos = async () => {
      if (!id) return;
      setLoading(true);
      setErro("");
      try {
        const response = await api.get(`/procedimentos/${id}`);
        setProcedimentos(Array.isArray(response.data) ? response.data : []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setErro("Erro ao carregar os procedimentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProcedimentos();
  }, [id]);
 
  const procedimentosFiltrados = procedimentos.filter((proc) =>
    proc.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container my-4">
      <button
        className="btn btn-link mb-3"
        onClick={() =>
          estabelecimentoId
            ? navigate(`/estabelecimento/${estabelecimentoId}/profissionais`)
            : navigate(-1)
        }
      >
        &larr; Voltar
      </button>
      <h2 className="text-center mb-4">Procedimentos do Profissional</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar procedimento..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div>
          {procedimentosFiltrados.length > 0 ? (
            procedimentosFiltrados.map((procedimento) => (
              <div
                key={procedimento.id}
                className="d-flex align-items-start mb-4 p-4 border rounded shadow-sm procedimento-hover"
                style={{
                  backgroundColor: "#f9f9f9",
                  cursor: "pointer",
                  transition: "background 0.2s, box-shadow 0.2s",
                  position: "relative",
                }}
                onClick={() =>
                  navigate(`/verAgenda/${id}`, {
                    state: { procedimento, estabelecimentoId },
                  })
                }
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "#e9ecef";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "#f9f9f9";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {/* Imagem à esquerda */}
                <img
                  src={
                    procedimento.imagem_url ||
                    "https://placehold.co/120x120?text=Foto"
                  }
                  alt={procedimento.nome}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "20px",
                  }}
                />

                {/* Conteúdo do procedimento */}
                <div className="d-flex flex-column w-100">
                  <h5
                    className="mb-2"
                    style={{ fontWeight: "bold", color: "#333" }}
                  >
                    {procedimento.nome}
                  </h5>
                  <p
                    className="mb-2"
                    style={{ fontStyle: "italic", color: "#555" }}
                  >
                    {procedimento.descricao}
                  </p>

                  {/* Preço e duração centralizados */}
                  <div
                    className="d-flex justify-content-between mt-3"
                    style={{ width: "100%" }}
                  >
                    <div style={{ textAlign: "center", width: "48%" }}>
                      <strong>Preço:</strong> R${procedimento.preco}
                    </div>
                    <div style={{ textAlign: "center", width: "48%" }}>
                      <strong>Duração:</strong> {procedimento.duracao_min} min
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-outline-primary btn-sm ms-3"
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    borderRadius: "50%",
                    padding: "0.35rem 0.5rem",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/verAgenda/${id}`, { state: { procedimento, estabelecimentoId } });
                  }}
                  title="Agendar"
                >
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            ))
          ) : (
            <div className="alert alert-info">
              Nenhum procedimento encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
