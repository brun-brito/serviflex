import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function EditarPerfilProfissional() {
  const usuarioStr = localStorage.getItem("usuarioObj");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : {};
  const [nome, setNome] = useState(usuario.nome || "");
  const [email, setEmail] = useState(usuario.email || "");
  const [senha, setSenha] = useState("");
  const [imagemURL, setImagemURL] = useState(usuario.imagem_url || usuario.fotoUrl || "");
  const [imagemAtual, setImagemAtual] = useState(usuario.imagem_url || usuario.fotoUrl || "");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [erroImagem, setErroImagem] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setErroImagem("");
    try {
      // Atualiza dados básicos
      const body: any = {
        ...usuario,
        nome,
        email,
      };
      if (senha) body.senha = senha;
      await api.put(`/usuarios/${usuario.id}?tipo=profissionais`, body);

      // Atualiza imagem se mudou
      if (imagemURL && imagemURL !== imagemAtual) {
        await api.put(`/upload/profissional/${usuario.id}`, {
          imagem_url: imagemURL,
        });
        setImagemAtual(imagemURL);
      }

      // Atualiza localStorage
      const novoUsuario = { ...usuario, nome, email, imagem_url: imagemURL, fotoUrl: imagemURL };
      localStorage.setItem("usuarioNome", nome);
      localStorage.setItem("usuarioObj", JSON.stringify(novoUsuario));
      setSucesso("Dados atualizados com sucesso!");
      setSenha("");
    } catch (err: any) {
      if (err?.response?.data?.error?.includes("imagem")) {
        setErroImagem("Erro ao atualizar imagem.");
      } else {
        setErro("Erro ao atualizar dados.");
      }
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 500 }}>
        <div className="mb-3">
            <a href="/agendaProfissional" className="btn btn-link p-0">
            &larr; Voltar para Agenda
            </a>
        </div>
      <h3 className="mb-4 text-center">Editar Perfil</h3>
      <div className="text-center mb-4">
        <img
          src={imagemURL || "https://placehold.co/120x120?text=Foto"}
          alt="Foto do profissional"
          className="rounded-circle shadow"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
      </div>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {erroImagem && <div className="alert alert-danger">{erroImagem}</div>}
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
        <div className="mb-3">
          <label className="form-label">Foto de Perfil (URL)</label>
          <input
            className="form-control"
            type="url"
            value={imagemURL}
            onChange={e => setImagemURL(e.target.value)}
            placeholder="Cole aqui a URL da nova imagem"
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
