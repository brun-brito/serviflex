import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container my-4">
      <h2 className="mb-4">Painel Administrativo</h2>
      
      <div className="d-flex flex-column align-items-center gap-3">
        <div className="card" style={{ width: "100%", maxWidth: "500px" }}>
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

        <div className="card" style={{ width: "100%", maxWidth: "500px" }}>
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

        <div className="card" style={{ width: "100%", maxWidth: "500px" }}>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">
              <i className="bi bi-people me-2"></i>
              Meu Perfil
            </h5>
            <p className="card-text">
              Gerenciar os dados da conta.
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
  );
}
