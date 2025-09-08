import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function EditarPerfilCliente() {
  const usuarioStr = localStorage.getItem("usuarioObj");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : {};
  const [nome, setNome] = useState(usuario.nome || "");
  const [email, setEmail] = useState(usuario.email || "");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    try {
      const body: any = {
        ...usuario,
        nome,
        email,
      };
      if (senha) body.senha = senha;
      await api.put(`/usuarios/${usuario.id}?tipo=clientes`, body);
      // Atualiza localStorage
      const novoUsuario = { ...usuario, nome, email };
      localStorage.setItem("usuarioNome", nome);
      localStorage.setItem("usuarioObj", JSON.stringify(novoUsuario));
      setSucesso("Dados atualizados com sucesso!");
      setSenha("");
    } catch {
      setErro("Erro ao atualizar dados.");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 500 }}>
      <div className="mb-3">
        <a href="/listaEstabelecimentos" className="btn btn-link p-0">
          &larr; Voltar para Estabelecimentos
        </a>
      </div>
      <h3 className="mb-4 text-center">Editar Perfil</h3>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            className="form-control"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nova senha</label>
          <input
            className="form-control"
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="Deixe em branco para não alterar"
          />
        </div>
        <button className="btn btn-primary me-2" type="submit">
          Salvar
        </button>
        <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
