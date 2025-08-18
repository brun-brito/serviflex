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
      </Routes>
    </Router>
  );
}

export default App;
