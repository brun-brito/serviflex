import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Estabelecimento } from "../../types";

export default function ListarEstabelecimentos() {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [cidadeFiltro, setCidadeFiltro] = useState("");
  const [todasCidades, setTodasCidades] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstabelecimentos = async () => {
      setLoading(true);
      setErro("");
      try {
        const response = await api.get("/estabelecimentos");
        setEstabelecimentos(response.data);

        // Coletar todas as cidades únicas
        const cidadesSet = new Set<string>();
        response.data.forEach((est: any) => {
          if (est.localizacao?.Cidade) cidadesSet.add(est.localizacao.Cidade);
        });
        setTodasCidades(Array.from(cidadesSet).sort());
      } catch (err) {
        setErro("Erro ao carregar os estabelecimentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEstabelecimentos();
  }, []);

  const estabelecimentosFiltrados = (estabelecimentos || []).filter(est => {
    const nomeOk = est.nome.toLowerCase().includes(busca.toLowerCase());
    const cidadeOk = !cidadeFiltro || (est.localizacao?.Cidade === cidadeFiltro);
    return nomeOk && cidadeOk;
  });

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Lista de Estabelecimentos</h2>
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar por nome..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={cidadeFiltro}
            onChange={e => setCidadeFiltro(e.target.value)}
          >
            <option value="">Todas as cidades</option>
            {todasCidades.map(cidade => (
              <option key={cidade} value={cidade}>{cidade}</option>
            ))}
          </select>
        </div>
      </div>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : estabelecimentosFiltrados.length === 0 ? (
        <div className="alert alert-warning text-center">Nenhum estabelecimento encontrado.</div>
      ) : (
        <div>
          {estabelecimentosFiltrados.map((estabelecimento) => (
            <div
              key={estabelecimento.id}
              className="mb-4 p-3 border rounded shadow-sm"
              style={{ backgroundColor: "#f9f9f9" }}
            >
              {estabelecimento.fotoURL && (
                <img
                  src={estabelecimento.fotoURL}
                  alt={estabelecimento.nome}
                  className="img-fluid mb-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "20px",
                  }}
                />
              )}
              <div className="d-flex align-items-center mb-1">
                <h5 style={{ fontWeight: "bold", marginBottom: 0 }}>{estabelecimento.nome}</h5>
                {estabelecimento.localizacao?.Cidade && (
                  <span className="ms-3 text-secondary d-flex align-items-center" style={{ fontSize: 15 }}>
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    {estabelecimento.localizacao.Cidade}
                  </span>
                )}
              </div>
              <p className="mb-1">
                {estabelecimento.descricao}
              </p>
              <button
                className="btn btn-primary mb-2"
                onClick={() => navigate(`/estabelecimento/${estabelecimento.id}/profissionais`)}
              >
                Selecionar
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        className="btn btn-secondary mt-4 me-2 d-inline-flex align-items-center"
        onClick={() => navigate("/MeusAgendamentos")}
      >
        <i className="bi bi-calendar-event me-2"></i>
        Meus Agendamentos
      </button>
      <button
        className="btn btn-outline-primary mt-4 d-inline-flex align-items-center"
        onClick={() => navigate("/cliente/editar-perfil")}
      >
        <i className="bi bi-pencil me-2"></i>
        Editar Perfil
      </button>
    </div>
  );
}
