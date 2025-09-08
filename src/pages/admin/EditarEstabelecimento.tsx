import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { Estabelecimento } from "../../types";

export default function EditarEstabelecimento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingEstabelecimento, setLoadingEstabelecimento] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento>({
    nome: "",
    descricao: "",
    fotoURL: "",
    categoria: "",
    localizacao: {
      endereco: "",
      cidade: "",
      uf: ""
    }
  });

  const carregarEstabelecimento = async () => {
    if (!id) {
      setErro("ID do estabelecimento não fornecido");
      return;
    }

    setLoadingEstabelecimento(true);
    setErro("");

    try {
      const response = await api.get(`/estabelecimentos/${id}`);
      
      // Garantir que todas as propriedades existam com valores padrão
      const dadosEstabelecimento: Estabelecimento = {
        id: response.data.id || "",
        nome: response.data.nome || "",
        descricao: response.data.descricao || "",
        fotoURL: response.data.fotoURL || "",
        categoria: response.data.categoria || "",
        localizacao: {
          endereco: response.data.localizacao?.Endereco || response.data.localizacao?.endereco || "",
          cidade: response.data.localizacao?.Cidade || response.data.localizacao?.cidade || "", 
          uf: response.data.localizacao?.UF || response.data.localizacao?.uf || ""
        },
        criadoEm: response.data.criadoEm,
        responsavelUid: response.data.responsavelUid
      };
      
      setEstabelecimento(dadosEstabelecimento);
    } catch (err: any) {
      setErro(err.response?.data?.error || "Erro ao carregar estabelecimento");
      console.error(err);
    } finally {
      setLoadingEstabelecimento(false);
    }
  };

  useEffect(() => {
    carregarEstabelecimento();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('localizacao.')) {
      const field = name.split('.')[1];
      setEstabelecimento(prev => ({
        ...prev,
        localizacao: {
          ...prev.localizacao,
          [field]: value
        }
      }));
    } else {
      setEstabelecimento(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso("");

    console.log("=== DEBUG: Dados sendo enviados ===");
    console.log("Estabelecimento completo:", JSON.stringify(estabelecimento, null, 2));
    console.log("FotoURL:", estabelecimento.fotoURL);
    console.log("==================================");

    try {
      await api.put(`/estabelecimentos/${id}`, estabelecimento);
      setSucesso("Estabelecimento atualizado com sucesso!");
      
      // Aguarda um pouco para mostrar a mensagem de sucesso, depois navega
      setTimeout(() => {
        navigate("/admin/estabelecimentos");
      }, 1500);
    } catch (err: any) {
      setErro(err.response?.data?.error || "Erro ao atualizar estabelecimento");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate("/admin/estabelecimentos");
  };

  if (loadingEstabelecimento) {
    return (
      <div className="container my-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando dados do estabelecimento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Editar Estabelecimento</h3>
            </div>

            <div className="card-body">
              {erro && <div className="alert alert-danger">{erro}</div>}
              {sucesso && <div className="alert alert-success">{sucesso}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row align-items-end">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nome" className="form-label">
                      Nome do Estabelecimento <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nome"
                      name="nome"
                      value={estabelecimento.nome}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="categoria" className="form-label">
                      Categoria <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="categoria"
                      name="categoria"
                      value={estabelecimento.categoria}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="Beleza">Beleza</option>
                      <option value="Estética">Estética</option>
                      <option value="Barbearia">Barbearia</option>
                      <option value="Spa">Spa</option>
                      <option value="Salão">Salão</option>
                      <option value="Clínica">Clínica</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="descricao" className="form-label">
                    Descrição
                  </label>
                  <textarea
                    className="form-control"
                    id="descricao"
                    name="descricao"
                    rows={3}
                    value={estabelecimento.descricao}
                    onChange={handleInputChange}
                    placeholder="Descreva o estabelecimento..."
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="fotoURL" className="form-label">
                    URL da Foto
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="fotoURL"
                    name="fotoURL"
                    value={estabelecimento.fotoURL || ""}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                  {estabelecimento.fotoURL && (
                    <div className="mt-2">
                      <small className="text-muted">Preview:</small>
                      <div className="mt-1">
                        <img
                          src={estabelecimento.fotoURL}
                          alt="Preview"
                          className="img-thumbnail"
                          style={{ maxHeight: "100px", maxWidth: "200px" }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-12 mb-3">
                    <label htmlFor="localizacao.endereco" className="form-label">
                      Endereço <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="localizacao.endereco"
                      name="localizacao.endereco"
                      value={estabelecimento.localizacao?.endereco || ""}
                      onChange={handleInputChange}
                      required
                      placeholder="Rua, número, bairro"
                    />
                  </div>

                  <div className="col-md-8 mb-3">
                    <label htmlFor="localizacao.cidade" className="form-label">
                      Cidade <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="localizacao.cidade"
                      name="localizacao.cidade"
                      value={estabelecimento.localizacao?.cidade || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="localizacao.uf" className="form-label">
                      UF <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="localizacao.uf"
                      name="localizacao.uf"
                      value={estabelecimento.localizacao?.uf || ""}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">UF</option>
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Salvando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleVoltar}
                    disabled={loading}
                  >
                    Voltar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
