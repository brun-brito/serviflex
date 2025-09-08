import type { JSX } from "react";
import Layout from "./components/Layout";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/geral/Login";
import Cadastro from "./pages/geral/Cadastro";
import ListaEstabelecimentos from "./pages/cliente/ListaEstabelecimentos";
import AgendaProfissional from "./pages/profissional/AgendaProfissional";
import HorariosProfissional from "./pages/profissional/HorariosProfissional";
import ListarProcedimentos from "./pages/cliente/ListarProcedimentos";
import VerAgenda from "./pages/cliente/VerAgenda";
import ConfirmarAgendamento from "./pages/cliente/ConfirmarAgendamento";
import ProcedimentosProfissional from "./pages/profissional/ProcedimentosProfissional";
import MeusAgendamentos from "./pages/cliente/MeusAgendamentos";
import GerenciarEstabelecimentos from "./pages/admin/GerenciarEstabelecimentos";
import CriarEstabelecimento from "./pages/admin/CriarEstabelecimento";
import EditarEstabelecimento from "./pages/admin/EditarEstabelecimento";
import ProfissionaisEstabelecimento from "./pages/admin/ProfissionaisEstabelecimento";
import AdicionarProfissional from "./pages/admin/AdicionarProfissional";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ConvitesProfissional from "./pages/profissional/ConvitesProfissional";
import EditarPerfilProfissional from "./pages/profissional/EditarPerfilProfissional";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem("usuarioId") !== null;
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route
          path="/convites-profissional"
          element={
            <PrivateRoute>
              <Layout>
                <ConvitesProfissional />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/listaEstabelecimentos"
          element={
            <PrivateRoute>
              <Layout>
                <ListaEstabelecimentos />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/procedimentos/:id"
          element={
            <PrivateRoute>
              <Layout>
                <ListarProcedimentos />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/agendaProfissional"
          element={
            <PrivateRoute>
              <Layout>
                <AgendaProfissional />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/horarios-profissional"
          element={
            <PrivateRoute>
              <Layout>
                <HorariosProfissional />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/verAgenda/:idProfissional"
          element={
            <PrivateRoute>
              <Layout>
                <VerAgenda />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ConfirmarAgendamento"
          element={
            <PrivateRoute>
              <Layout>
                <ConfirmarAgendamento />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/meus-procedimentos/:id"
          element={
            <PrivateRoute>
              <Layout>
                <ProcedimentosProfissional />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/MeusAgendamentos"
          element={
            <PrivateRoute>
              <Layout>
                <MeusAgendamentos />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profissional/editar-perfil"
          element={
            <PrivateRoute>
              <Layout>
                <EditarPerfilProfissional />
              </Layout>
            </PrivateRoute>
          }
        />
        {/* Rotas de Admin - Estabelecimentos */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/estabelecimentos"
          element={
            <PrivateRoute>
              <Layout>
                <GerenciarEstabelecimentos />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/estabelecimentos/criar"
          element={
            <PrivateRoute>
              <Layout>
                <CriarEstabelecimento />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/estabelecimentos/editar/:id"
          element={
            <PrivateRoute>
              <Layout>
                <EditarEstabelecimento />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/estabelecimentos/:id/profissionais"
          element={
            <PrivateRoute>
              <Layout>
                <ProfissionaisEstabelecimento />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/estabelecimentos/:id/profissionais/adicionar"
          element={
            <PrivateRoute>
              <Layout>
                <AdicionarProfissional />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
