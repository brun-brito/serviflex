import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ConvitesProfissional() {
  const [convites, setConvites] = useState<any[]>([]);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuarioObj");
    if (!usuarioStr) {
      navigate("/");
      return;
    }
    const usuario = JSON.parse(usuarioStr);
    if (usuario.estabelecimentoId) {
      navigate("/agendaProfissional");
      return;
    }
    // Buscar convites pendentes
    api.get(`/profissionais/${usuario.id}/convites-pendentes`)
      .then(resp => {
        setConvites(resp.data || []);
        setLoading(false);
      })
      .catch(() => {
        setErro("Erro ao buscar convites.");
        setLoading(false);
      });
  }, [navigate]);

  const responderConvite = async (conviteId: string, resposta: string) => {
    setErro("");
    setMensagem("");
    try {
      await api.post(`/estabelecimentos/profissionais/notificacao/${conviteId}`, {
        convite_id: conviteId,
        resposta,
      });
      setMensagem((resposta == "aceito") ? "Convite aceito com sucesso!" : "Convite recusado.");
      setConvites(convites.filter(c => c.id !== conviteId));
      if (resposta == "aceito") {
        // Atualiza usuarioObj no localStorage com estabelecimentoId igual ao conviteId
        const usuarioStr = localStorage.getItem("usuarioObj");
        if (usuarioStr) {
          const usuario = JSON.parse(usuarioStr);
// Buscar novamente o usuário atualizado (simples: setar o estabelecimentoId do convite)
          // Se o backend retornar o estabelecimentoId no convite, use ele. Caso contrário, recarregue a página.
          usuario.estabelecimentoId = convites.find(c => c.id === conviteId)?.EstabelecimentoID || true;
          localStorage.setItem("usuarioObj", JSON.stringify(usuario));
        }
        setTimeout(() => navigate("/agendaProfissional"), 1000);
      }
    } catch {
      setErro("Erro ao responder convite.");
    }
  };

  if (loading) {
    return <div className="container my-5 text-center">Carregando...</div>;
  }

  return (
    <div className="container my-5" style={{ maxWidth: 500 }}>
      <h3 className="mb-4 text-center">Convites Pendentes</h3>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {mensagem && <div className="alert alert-success">{mensagem}</div>}
      <div className="alert alert-warning">
        Você não está vinculado a nenhum estabelecimento.<br />
        Aceite um convite para acessar a agenda.
      </div>
      {convites.length === 0 ? (
        <div className="text-muted text-center">Nenhum convite pendente.</div>
      ) : (
        convites.map((convite) => (
          <div key={convite.id} className="border rounded p-2 mb-2">
            <div><b>De:</b> {convite.deNome || convite.deEmail || "Estabelecimento"}</div>
            <div><b>Mensagem:</b> {convite.mensagem || "Convite para vincular-se a um estabelecimento."}</div>
            <div className="mt-2">
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => responderConvite(convite.id, "aceito")}
              >
                Aceitar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => responderConvite(convite.id, "recusado")}
              >
                Recusar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
