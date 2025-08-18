import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Agendamento } from "../../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function VisualizarAgendamentos() {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(true);
    const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(new Date());
    const profissionalId = localStorage.getItem("usuarioId");
    const navigate = useNavigate();

    const [mostrarFormularioImagem, setMostrarFormularioImagem] = useState(false);
    const [imagemURL, setImagemURL] = useState("");
    const [mensagemImagem, setMensagemImagem] = useState("");
    const [erroImagem, setErroImagem] = useState("");
    const [imagemAtual, setImagemAtual] = useState<string | null>(null);

    useEffect(() => {
        const carregarImagemDoEstabelecimento = async () => {
            try {
                const usuarioId = localStorage.getItem("usuarioId");
                const response = await api.get("/estabelecimentos");
                if (response.status === 200 && Array.isArray(response.data)) {
                    const profissional = response.data.find((item: any) => item.id === usuarioId);
                    if (profissional && profissional.imagem_url) {
                        setImagemAtual(profissional.imagem_url);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar imagem do profissional:", error);
            }
        };

        carregarImagemDoEstabelecimento();
    }, []);

    useEffect(() => {
        if (!dataSelecionada || !profissionalId) return;

        const fetchAgendamentos = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/agendamentos/profissional/${profissionalId}`);
                if (response.status === 200 && Array.isArray(response.data)) {
                    const agendamentosFiltrados = response.data.filter((agendamento: Agendamento) => {
                        const dataAgendamento = new Date(agendamento.data_hora);
                        return (
                            dataAgendamento.getFullYear() === dataSelecionada.getFullYear() &&
                            dataAgendamento.getMonth() === dataSelecionada.getMonth() &&
                            dataAgendamento.getDate() === dataSelecionada.getDate()
                        );
                    });

                    setAgendamentos(agendamentosFiltrados);
                }
            } catch (err) {
                console.log("Erro ao carregar os agendamentos:", err);
                setErro("Erro ao carregar os agendamentos.");
            } finally {
                setLoading(false);
            }
        };

        fetchAgendamentos();
    }, [dataSelecionada, profissionalId]);

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div style={{ minWidth: "350px", maxWidth: "400px", width: "100%" }}>
                <div className="position-relative mb-4 d-flex justify-content-end">
                    <div style={{ position: "relative", width: "120px", height: "120px" }}>
                        <img
                            src={imagemAtual || "https://placehold.co/120x120?text=Foto"}
                            alt="Foto do profissional"
                            className="rounded-circle shadow"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <button
                            className="btn btn-light border rounded-circle shadow position-absolute d-flex align-items-center justify-content-center"
                            style={{ bottom: 0, right: 0, width: '36px', height: '36px', backgroundColor: '#fff' }}
                            title="Alterar foto de perfil"
                            onClick={() => setMostrarFormularioImagem(!mostrarFormularioImagem)}
                        >
                            <i className="bi bi-pencil-fill text-primary fs-5"></i>
                        </button>
                    </div>
                </div>

                {mostrarFormularioImagem && (
                    <form
                        className="mb-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setErroImagem("");
                            setMensagemImagem("");
                            try {
                                await api.put(`/upload/profissional/${profissionalId}`, {
                                    imagem_url: imagemURL,
                                });
                                localStorage.setItem("imagem_url", imagemURL);
                                setImagemAtual(imagemURL);
                                setMensagemImagem("Imagem atualizada com sucesso!");
                                setImagemURL("");
                            } catch (error) {
                                setErroImagem("Erro ao atualizar imagem.");
                            }
                        }}
                    >
                        <div className="input-group mb-2">
                            <input
                                type="url"
                                className="form-control"
                                placeholder="Cole aqui a URL da nova imagem"
                                value={imagemURL}
                                onChange={(e) => setImagemURL(e.target.value)}
                                required
                            />
                            <button className="btn btn-primary" type="submit">Salvar</button>
                        </div>
                        {mensagemImagem && <div className="alert alert-success">{mensagemImagem}</div>}
                        {erroImagem && <div className="alert alert-danger">{erroImagem}</div>}
                    </form>
                )}

                <h2 className="mb-4 text-center text-secondary">Agenda de {localStorage.getItem("usuarioNome")}</h2>

                {/* Calendário no topo */}
                <div className="d-flex justify-content-center mb-4">
                    <DayPicker
                        mode="single"
                        selected={dataSelecionada}
                        onSelect={setDataSelecionada}
                        locale={ptBR}
                        weekStartsOn={0}
                        modifiersClassNames={{
                            selected: "bg-primary text-white rounded",
                        }}
                        className="border rounded p-3"
                    />
                </div>

                {/* Título com a data selecionada */}
                <h5 className="text-center mb-4">
                    Agendamentos em:{" "}
                    {dataSelecionada
                        ? format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                        : "Selecione uma data"}
                </h5>

                {erro && <div className="alert alert-danger">{erro}</div>}

                {loading ? (
                    <div className="text-center">Carregando agendamentos...</div>
                ) : agendamentos.length === 0 ? (
                    <div className="alert alert-info text-center">Nenhum agendamento encontrado neste dia.</div>
                ) : (
                    agendamentos.map((agendamento) => (
                        <div
                            key={agendamento.id}
                            className="p-3 mb-3 border rounded shadow-sm"
                            style={{ backgroundColor: "#f9f9f9" }}
                        >
                            <p><strong>Cliente:</strong> {agendamento.cliente_nome || "Nome não disponível"}</p>
                            <p><strong>Procedimento:</strong> {agendamento.procedimento}</p>
                            <p><strong>Data e Hora:</strong> {new Date(agendamento.data_hora).toLocaleString()}</p>
                        </div>
                    ))
                )}

                {/* Botões de navegação */}
                <div className="text-center mt-5">
                    <button
                        className="btn btn-outline-primary me-3 d-inline-flex align-items-center"
                        onClick={() => navigate("/horarios-profissional")}
                    >
                        <i className="bi bi-pencil me-2"></i>
                        Editar Horários
                    </button>

                    <button
                        className="btn btn-outline-secondary d-inline-flex align-items-center mt-3"
                        onClick={() => navigate(`/meus-procedimentos/${profissionalId}`)}
                    >
                        <i className="bi bi-list-ul me-2"></i>
                        Gerenciar Procedimentos
                    </button>
                </div>
            </div>
        </div>
    );
}
