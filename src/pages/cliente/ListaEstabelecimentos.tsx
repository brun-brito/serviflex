import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // API de requisições configurada
import { Estabelecimento } from "../../types"; // Definir tipo para Estabelecimento

export default function ListarEstabelecimentos() {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Função que busca os estabelecimentos na API
    const fetchEstabelecimentos = async () => {
      setLoading(true);
      setErro("");
      try {
        const response = await api.get("/estabelecimentos");
        setEstabelecimentos(response.data); // Armazena os estabelecimentos no estado
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setErro("Erro ao carregar os estabelecimentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEstabelecimentos();
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Lista de Estabelecimentos</h2>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : !estabelecimentos || estabelecimentos.length === 0 ? (
        <div className="alert alert-warning text-center">Nenhum estabelecimento encontrado.</div>
      ) : (
        <div>
          {estabelecimentos.map((estabelecimento) => (
            <div
              key={estabelecimento.id}
              className="d-flex align-items-center mb-4 p-3 border rounded shadow-sm"
              style={{ backgroundColor: "#f9f9f9" }}
            >
              {estabelecimento.imagem_url && (
                <img
                  src={estabelecimento.imagem_url}
                  alt={estabelecimento.nome}
                  className="img-fluid"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "20px",
                  }}
                />
              )}
              <div className="d-flex flex-column">
                <h5 className="mb-2" style={{ fontWeight: "bold" }}>
                  {estabelecimento.nome}
                </h5>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/procedimentos/${estabelecimento.id}`)}
                  style={{ alignSelf: "flex-start" }}
                >
                  Selecionar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate("/MeusAgendamentos")}
      >
        Meus Agendamentos
      </button>
    </div>
  );
}
