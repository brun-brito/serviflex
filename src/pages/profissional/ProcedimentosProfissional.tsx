import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function ListarProcedimentos() {
  const { id } = useParams();
  const [procedimentos, setProcedimentos] = useState<any[] | null>(null);
  const [erro, setErro] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nomeEdit, setNomeEdit] = useState("");
  const [descricaoEdit, setDescricaoEdit] = useState("");
  const [precoEdit, setPrecoEdit] = useState("");
  const [duracaoEdit, setDuracaoEdit] = useState("");
  const [imagemEdit, setImagemEdit] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novaDuracao, setNovaDuracao] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const carregarProcedimentos = async () => {
    try {
      const response = await api.get(`/procedimentos/${id}`);
      setProcedimentos(response.data);
      setErro(""); // limpa erro no sucesso
    } catch (error) {
      setErro("Erro ao carregar procedimentos.");
    }
  };

  useEffect(() => {
    carregarProcedimentos();
  }, [id]);

  const deletar = async (procId: string) => {
    if (confirm("Tem certeza que deseja deletar este procedimento?")) {
      try {
        await api.delete(`/procedimentos/${procId}`);
        setErro(""); // limpa erro no sucesso
        carregarProcedimentos();
      } catch {
        setErro("Erro ao deletar.");
      }
    }
  };

  const salvarEdicao = async (procId: string) => {
    // mesma validação do adicionar
    if (!nomeEdit || !descricaoEdit || !precoEdit || !duracaoEdit) {
      setErro("Preencha todos os campos antes de adicionar.");
      return;
    }

    try {
      await api.put(`/procedimentos/${procId}`, {
        id: procId,
        nome: nomeEdit,
        descricao: descricaoEdit,
        preco: parseFloat(precoEdit),
        duracao_min: parseInt(duracaoEdit),
        profissional_id: id,
      });
      if (imagemEdit) {
        await api.put(`/upload/procedimento/${procId}`, {
          imagem_url: imagemEdit,
        });
      }
      setErro(""); // limpa erro no sucesso
      setEditandoId(null);
      carregarProcedimentos();
    } catch {
      setErro("Erro ao atualizar procedimento.");
    }
  };

  const adicionarProcedimento = async () => {
    setErro(""); // limpa erro antes de tentar novamente

    if (!novoNome || !novaDescricao || !novoPreco || !novaDuracao) {
      setErro("Preencha todos os campos antes de adicionar.");
      return;
    }

    try {
      const response = await api.post("/procedimentos", {
        nome: novoNome,
        descricao: novaDescricao,
        preco: parseFloat(novoPreco),
        duracao_min: parseInt(novaDuracao),
        profissional_id: id,
      });

      const novoId = response.data.id;
      if (imagemEdit) {
        await api.put(`/upload/procedimento/${novoId}`, {
          imagem_url: imagemEdit,
        });
      }

      setNovoNome("");
      setNovaDescricao("");
      setNovoPreco("");
      setNovaDuracao("");
      setImagemEdit("");
      setMostrarFormulario(false);
      setErro(""); // limpa erro no sucesso
      carregarProcedimentos();
    } catch {
      setErro("Erro ao adicionar procedimento.");
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div style={{ minWidth: "350px", maxWidth: "400px", width: "100%" }}>
        <div className="mb-3">
          <a href="/agendaProfissional" className="btn btn-link p-0">
            &larr; Voltar para Agenda
          </a>
        </div>
        <h2 className="mb-4 text-center">Seus Procedimentos</h2>

        {erro && <div className="alert alert-danger">{erro}</div>}

        {!mostrarFormulario ? (
          <div className="text-end mb-4">
            <button
              className="btn btn-success"
              onClick={() => setMostrarFormulario(true)}
            >
              <i className="bi bi-plus-circle me-1"></i> Novo Procedimento
            </button>
          </div>
        ) : (
          <div className="border rounded p-3 mb-4 shadow-sm bg-light">
            <h5 className="mb-3">Adicionar Novo Procedimento</h5>
            <input
              className="form-control mb-2"
              placeholder="Nome"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Descrição"
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
            />
            <input
              className="form-control mb-2"
              type="number"
              placeholder="Preço"
              value={novoPreco}
              onChange={(e) => setNovoPreco(e.target.value)}
            />
            <input
              className="form-control mb-2"
              type="number"
              placeholder="Duração (min)"
              value={novaDuracao}
              onChange={(e) => setNovaDuracao(e.target.value)}
            />
            <input
              className="form-control mb-2"
              type="text"
              placeholder="URL da imagem (opcional)"
              value={imagemEdit}
              onChange={(e) => setImagemEdit(e.target.value)}
            />
            <div className="text-end">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-success"
                onClick={adicionarProcedimento}
              >
                <i className="bi bi-check-lg"></i> Adicionar
              </button>
            </div>
          </div>
        )}

        {!procedimentos || procedimentos.length === 0 ? (
          <div className="alert alert-info text-center">
            Nenhum procedimento encontrado.
          </div>
        ) : (
          procedimentos.map((proc: any) => (
            <div className="border rounded p-3 mb-3 shadow-sm" key={proc.id}>
              <div className="d-flex align-items-center">
                <img
                  src={
                    proc.imagem_url || "https://placehold.co/120x120?text=Foto"
                  }
                  alt={proc.nome}
                  className="img-fluid me-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div className="flex-grow-1">
                  {editandoId === proc.id ? (
                    <>
                      <input
                        className="form-control mb-2"
                        value={nomeEdit}
                        onChange={(e) => setNomeEdit(e.target.value)}
                      />
                      <textarea
                        className="form-control mb-2"
                        value={descricaoEdit}
                        onChange={(e) => setDescricaoEdit(e.target.value)}
                      />
                      <input
                        className="form-control mb-2"
                        type="number"
                        value={precoEdit}
                        onChange={(e) => setPrecoEdit(e.target.value)}
                      />
                      <input
                        className="form-control mb-2"
                        type="number"
                        value={duracaoEdit}
                        onChange={(e) => setDuracaoEdit(e.target.value)}
                        placeholder="Duração (min)"
                      />
                      <input
                        className="form-control mb-2"
                        type="text"
                        placeholder="URL da imagem"
                        value={imagemEdit}
                        onChange={(e) => setImagemEdit(e.target.value)}
                      />
                      <div className="text-end">
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => salvarEdicao(proc.id)}
                        >
                          <i className="bi bi-check-lg"></i> Salvar
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setEditandoId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h5>{proc.nome}</h5>
                      <p>
                        <strong>Descrição:</strong> {proc.descricao}
                      </p>
                      <p>
                        <strong>Preço:</strong> R${" "}
                        {Number(proc.preco).toFixed(2)}
                      </p>
                      <p>
                        <strong>Duração:</strong> {Number(proc.duracao_min)}{" "}
                        minutos
                      </p>
                      <div className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger me-2"
                          onClick={() => deletar(proc.id)}
                        >
                          <i className="bi bi-trash"></i> Deletar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setEditandoId(proc.id);
                            setNomeEdit(proc.nome);
                            setDescricaoEdit(proc.descricao);
                            setPrecoEdit(String(proc.preco));
                            setDuracaoEdit(String(proc.duracao_min));
                            setImagemEdit(
                              proc.imagem_url ||
                                "https://placehold.co/120x120?text=Foto"
                            );
                          }}
                        >
                          <i className="bi bi-pencil-square"></i> Editar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
