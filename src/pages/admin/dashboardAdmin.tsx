import { useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  return (
    <div className="container my-4">
      <h2 className="mb-4">Painel Administrativo</h2>
      
      <div className="row">
        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">
                <i className="bi bi-building me-2"></i>
                Estabelecimentos
              </h5>
              <p className="card-text">
                Gerencie todos os estabelecimentos cadastrados no sistema.
                Criar, editar, visualizar e organizar estabelecimentos.
              </p>
              <div className="mt-auto">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => navigate("/admin/estabelecimentos")}
                >
                  Gerenciar Estabelecimentos
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">
                <i className="bi bi-people me-2"></i>
                Usuários
              </h5>
              <p className="card-text">
                Gerencie clientes e profissionais cadastrados no sistema.
              </p>
              <div className="mt-auto">
                <button
                  className="btn btn-secondary w-100"
                  disabled
                >
                  Em breve
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">
                <i className="bi bi-calendar-check me-2"></i>
                Agendamentos
              </h5>
              <p className="card-text">
                Visualize e gerencie todos os agendamentos do sistema.
              </p>
              <div className="mt-auto">
                <button
                  className="btn btn-secondary w-100"
                  disabled
                >
                  Em breve
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">
                <i className="bi bi-gear me-2"></i>
                Procedimentos
              </h5>
              <p className="card-text">
                Gerencie os procedimentos disponíveis no sistema.
              </p>
              <div className="mt-auto">
                <button
                  className="btn btn-secondary w-100"
                  disabled
                >
                  Em breve
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">
                <i className="bi bi-bar-chart me-2"></i>
                Relatórios
              </h5>
              <p className="card-text">
                Visualize relatórios e estatísticas do sistema.
              </p>
              <div className="mt-auto">
                <button
                  className="btn btn-secondary w-100"
                  disabled
                >
                  Em breve
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">
                <i className="bi bi-shield-check me-2"></i>
                Configurações
              </h5>
              <p className="card-text">
                Configurações gerais do sistema e permissões.
              </p>
              <div className="mt-auto">
                <button
                  className="btn btn-secondary w-100"
                  disabled
                >
                  Em breve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
