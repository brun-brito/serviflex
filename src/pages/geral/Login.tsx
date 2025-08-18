import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-serviflex-2.jpg";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setMensagem("");
        setLoading(true);

        try {
            const response = await api.post("/login", {
                email,
                senha,
            });

            const { usuario, mensagem } = response.data;
            setMensagem(mensagem);
            console.log("Usuário logado:", usuario);
            localStorage.setItem("usuarioId", usuario.id);
            localStorage.setItem("usuarioTipo", usuario.tipo);
            localStorage.setItem("usuarioNome", usuario.nome);

            if (usuario.tipo === "clientes") {
                navigate("/listaEstabelecimentos");
            } else if (usuario.tipo === "profissionais") {
                navigate("/agendaProfissional");
            }
            
        } catch (err: any) {
            if (err.response?.status === 400) {
                setErro(
                    "Dados inválidos. Verifique os campos e tente novamente."
                );
            } else if (err.response?.status === 401) {
                setErro("Email ou senha inválidos.");
            } else if (err.response?.status === 409) {
                setErro("Email já cadastrado.");
            } else if (err.response?.status === 500) {
                setErro(
                    "Erro interno no servidor. Tente novamente mais tarde."
                );
            } else {
                setErro("Erro inesperado ao fazer login.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex vh-100 align-items-center justify-content-center">
            <div className="card p-4 w-100" style={{ maxWidth: "400px" }}>
                <div
                    className="text-center mb-4"
                    style={{
                        background: "#edeae3",
                        borderRadius: "8px",
                        padding: "32px 0 24px 0",
                        marginBottom: "24px",
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo ServiFlex"
                        style={{
                            height: "64px",
                            width: "auto",
                            objectFit: "contain",
                        }}
                    />
                </div>
                <h2 className="text-center mb-4" style={{ fontWeight: 600, fontSize: "2rem" }}>
                    Login
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">E-mail</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Digite seu e-mail"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            placeholder="Digite sua senha"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
                {mensagem && (
                    <div className="alert alert-success mt-3">{mensagem}</div>
                )}
                {erro && <div className="alert alert-danger mt-3">{erro}</div>}
                <div className="text-center mt-3">
                    <span>Não possui cadastro? </span>
                    <a
                        href="/cadastro"
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                    >
                        Cadastre-se aqui
                    </a>
                </div>
            </div>
        </div>
    );
}
