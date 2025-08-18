import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import logo from "../../assets/logo-serviflex-2.jpg";

export default function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipo, setTipo] = useState("clientes");
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setMensagem("");
        setLoading(true);

        try {
            const response = await api.post("/cadastro", {
                nome,
                email,
                senha,
                tipo,
            });

            setMensagem(response.data.mensagem);
            console.log("Usuário cadastrado:", response.data.usuario);
            setTimeout(() => navigate("/"), 2000);
        } catch (err: any) {
            if (err.response?.status === 400) {
                setErro(
                    "Dados inválidos. Verifique os campos e tente novamente."
                );
            } else if (err.response?.status === 409) {
                setErro("Email já cadastrado.");
            } else if (err.response?.status === 500) {
                setErro(
                    "Erro interno no servidor. Tente novamente mais tarde."
                );
            } else {
                setErro("Erro inesperado ao realizar cadastro.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex vh-100 align-items-center justify-content-center">
            <div className="card p-4 w-100" style={{ maxWidth: "400px", minWidth: "350px" }}>
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
                <h2 className="text-center mb-4">Cadastro</h2>
                <form onSubmit={handleCadastro}>
                    <div className="mb-3">
                        <label className="form-label">Tipo de usuário</label>
                        <select
                            className="form-select"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            required
                        >
                            <option value="clientes">Cliente</option>
                            <option value="profissionais">Profissional</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            placeholder="Digite seu nome"
                        />
                    </div>
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
                        className="btn btn-success w-100"
                        disabled={loading}
                    >
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>
                {mensagem && (
                    <div className="alert alert-success mt-3">{mensagem}</div>
                )}
                {erro && <div className="alert alert-danger mt-3">{erro}</div>}
                <div className="text-center mt-3">
                    <span>Já possui cadastro? </span>
                    <a
                        href="/"
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                    >
                        Entre aqui
                    </a>
                </div>
            </div>
        </div>
    );
}
