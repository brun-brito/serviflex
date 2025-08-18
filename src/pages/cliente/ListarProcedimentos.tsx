import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; // API de requisições configurada
import { Procedimento } from "../../types"; // Definir tipo para Procedimento

export default function ListarProcedimentos() {
  const { id } = useParams(); // Pega o id do profissional da URL
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]); // Inicializa como array vazio
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

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

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Procedimentos do Profissional</h2>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div>
          {procedimentos.length > 0 ? (
            procedimentos.map((procedimento) => (
              <div
                key={procedimento.id}
                className="d-flex align-items-start mb-4 p-4 border rounded shadow-sm"
                style={{ backgroundColor: "#f9f9f9" }}
                onClick={() =>
                  navigate(`/verAgenda/${id}`, {
                    state: { procedimento },
                  })
                }
              >
                {/* Imagem à esquerda */}
                <img
                  src={
                    procedimento.imagem_url || "https://placehold.co/120x120?text=Foto"
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
              </div>
            ))
          ) : (
            <div className="alert alert-info">
              Nenhum procedimento encontrado.
            </div>
          )}
        </div>
      )}
      <button
        className="btn btn-secondary"
        onClick={() => navigate("/listaEstabelecimentos")}
      >
        Voltar para os estabelecimentos
      </button>
    </div>
  );
}
