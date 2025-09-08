import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function HorariosProfissional() {
  const profissionalId = localStorage.getItem('usuarioId');
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const carregarHorarios = async () => {
    try {
      const response = await api.get(`/horarios/${profissionalId}`);

      if (!response.data) {
        return;
      }
      
      const ordemSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
      const ordenados = response.data.sort((a: any, b: any) => {
        return ordemSemana.indexOf(a.dia_semana) - ordemSemana.indexOf(b.dia_semana);
      });
      setHorarios(ordenados);
    } catch (err) {
      console.error('Erro ao carregar horários', err);
      setErro('Não foi possível carregar seus horários.');
    }
  };

  useEffect(() => {
    if (profissionalId) carregarHorarios();
  }, [profissionalId]);

  const toggleDia = (dia: string) => {
    setDiasSelecionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const iniciarEdicao = (h: any) => {
    setEditandoId(h.id);
    setDiasSelecionados([h.dia_semana]);
    setHoraInicio(h.hora_inicio);
    setHoraFim(h.hora_fim);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setDiasSelecionados([]);
    setHoraInicio('');
    setHoraFim('');
  };

  const enviarHorario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    try {
      if (editandoId) {
        // Editar horário existente
        const payload = {
          id: editandoId,
          profissional_id: profissionalId,
          dia_semana: diasSelecionados[0],
          hora_inicio: horaInicio,
          hora_fim: horaFim,
          disponivel: true,
        };
        await api.put(`/horarios/${editandoId}`, payload);
        setMensagem('Horário atualizado com sucesso!');
        cancelarEdicao();
      } else {
        // Criar novos horários
        const payload = {
          profissional_id: profissionalId,
          dias_semana: diasSelecionados,
          hora_inicio: horaInicio,
          hora_fim: horaFim,
        };
        const response = await api.post('/horarios', payload);
        const criados = response.data.criados || [];
        setMensagem(`Horários criados: ${criados.length}`);
      }
      setDiasSelecionados([]);
      setHoraInicio('');
      setHoraFim('');
      await carregarHorarios();
    } catch (err) {
      console.error(err);
      setErro('Erro ao salvar horário');
    }
  };

  const excluirHorario = async (id: string) => {
    setErro('');
    setMensagem('');
    try {
      await api.delete(`/horarios/${id}`);
      setMensagem('Horário excluído com sucesso!');
      setHorarios(horarios.filter((h: any) => h.id !== id));
      await carregarHorarios();
    } catch (err) {
      setErro('Erro ao excluir horário');
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div style={{ minWidth: "350px", maxWidth: "400px", width: "100%" }}>
        <div className="container py-4">
          <div className="mb-3">
            <a href="/agendaProfissional" className="btn btn-link p-0">
              &larr; Voltar para Agenda
            </a>
          </div>
          <h2 className="mb-4">Horários de Atendimento - {localStorage.getItem('usuarioNome')}</h2>

          {Array.isArray(horarios) && horarios.length > 0 ? (
            <ul className="list-group">
              {horarios.map((h: any) => (
                <li key={h.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    {h.dia_semana} — {h.hora_inicio} às {h.hora_fim}
                  </span>
                  <span>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => iniciarEdicao(h)}>
                      <i className='bi bi-pencil-fill'></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => excluirHorario(h.id)}>
                      <i className='bi bi-trash-fill'></i>
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-info">Nenhum horário cadastrado ainda.</div>
          )}

          <form onSubmit={enviarHorario} className="mb-4">
            <div className="mb-3">
              <label className="form-label">Dias da Semana</label>
              <div className="d-flex flex-wrap gap-2">
                {diasSemana.map((dia) => (
                  <button
                    key={dia}
                    type="button"
                    className={`btn btn-outline-primary ${diasSelecionados.includes(dia) ? 'active' : ''}`}
                    onClick={() => toggleDia(dia)}
                    disabled={!!editandoId && !diasSelecionados.includes(dia)}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Hora Início</label>
                <input
                  type="time"
                  className="form-control"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label className="form-label">Hora Fim</label>
                <input
                  type="time"
                  className="form-control"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  required
                />
              </div>
            </div>
            <button className="btn btn-success w-100" type="submit">
              {editandoId ? "Salvar Alterações" : "Cadastrar Horários"}
            </button>
            {editandoId && (
              <button className="btn btn-secondary w-100 mt-2" type="button" onClick={cancelarEdicao}>
                Cancelar Edição
              </button>
            )}
            {mensagem && <div className="alert alert-success mt-3">{mensagem}</div>}
            {erro && <div className="alert alert-danger mt-3">{erro}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}