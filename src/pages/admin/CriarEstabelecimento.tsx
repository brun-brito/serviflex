import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Estabelecimento } from "../../types";

export default function CriarEstabelecimento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento>({
    nome: "",
    descricao: "",
    fotoURL: "",
    categoria: "",
    localizacao: {
      Endereco: "",
      Cidade: "",
      UF: ""
    },
    responsavel_uid: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('localizacao.')) {
      const field = name.split('.')[1];
      setEstabelecimento(prev => ({
        ...prev,
        localizacao: {
          ...prev.localizacao,
          [field.charAt(0).toUpperCase() + field.slice(1)]: value
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

    // Vincular responsavel_uid do usuário logado
    const usuarioId = localStorage.getItem("usuarioId");
    const estabelecimentoPayload = {
      ...estabelecimento,
      responsavel_uid: usuarioId,
    };

    console.log("=== DEBUG: Criando estabelecimento ===");
    console.log("Dados sendo enviados:", JSON.stringify(estabelecimentoPayload, null, 2));
    console.log("FotoURL:", estabelecimentoPayload.fotoURL);
    console.log("=====================================");

    try {
      const response = await api.post("/estabelecimentos", estabelecimentoPayload);
      setSucesso("Estabelecimento criado com sucesso!");
      console.log("Estabelecimento criado:", response.data);
      
      // Aguarda um pouco para mostrar a mensagem de sucesso, depois navega
      setTimeout(() => {
        navigate("/admin/estabelecimentos");
      }, 1500);
    } catch (err: any) {
      setErro(err.response?.data?.error || "Erro ao criar estabelecimento");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate("/admin/estabelecimentos");
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Criar Novo Estabelecimento</h3>
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
                      placeholder="Digite o nome do estabelecimento"
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
                      <option value="Salão de Beleza">Salão de Beleza</option>
                      <option value="Barbearia">Barbearia</option>
                      <option value="Spa">Spa</option>
                      <option value="Clínica Estética">Clínica Estética</option>
                      <option value="Manicure/Pedicure">Manicure/Pedicure</option>
                      <option value="Massagem">Massagem</option>
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
                    value={estabelecimento.fotoURL}
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
                    <label htmlFor="localizacao.Endereco" className="form-label">
                      Endereço <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="localizacao.Endereco"
                      name="localizacao.Endereco"
                      value={estabelecimento.localizacao.Endereco}
                      onChange={handleInputChange}
                      required
                      placeholder="Rua, número, bairro"
                    />
                  </div>

                  <div className="col-md-8 mb-3">
                    <label htmlFor="localizacao.Cidade" className="form-label">
                      Cidade <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="localizacao.Cidade"
                      name="localizacao.Cidade"
                      value={estabelecimento.localizacao.Cidade}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="localizacao.UF" className="form-label">
                      UF <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="localizacao.UF"
                      name="localizacao.UF"
                      value={estabelecimento.localizacao.UF}
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
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Criando...
                      </>
                    ) : (
                      "Criar Estabelecimento"
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
