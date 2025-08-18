import { ReactNode } from "react";
import logo from "../assets/logo-serviflex-2.jpg";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-bottom">
      <div
        className="container d-flex align-items-center justify-content-between py-3"
        style={{ backgroundColor: "#edeae3" }}
      >          
      <div className="d-flex align-items-center gap-3">
            <img
              src={logo}
              alt="Logo ServiFlex"
              style={{
                height: "48px",
                width: "auto",
                objectFit: "contain",
                background: "transparent",
              }}
            />
            {/* <h3 className="mb-0 text-primary fw-bold" style={{ letterSpacing: "1px" }}>
              ServiFlex
            </h3> */}
          </div>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-fill container py-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-top shadow-sm mt-auto py-3">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <small className="text-muted">
            &copy; {new Date().getFullYear()} Serviflex. Todos os direitos reservados.
          </small>
        </div>
      </footer>
    </div>
  );
}