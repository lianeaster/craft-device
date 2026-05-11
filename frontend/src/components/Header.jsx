import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <Wrench size={20} />
          </div>
          Craft-Device
        </Link>
        <nav className="nav">
          <Link to="/tenders">Тендери</Link>
          <Link to="/portfolio">Портфоліо</Link>
          <Link to="/constructor">Конструктор</Link>
          {user ? (
            <>
              <Link to="/dashboard">Кабінет</Link>
              <button onClick={logout}>Вийти</button>
            </>
          ) : (
            <>
              <Link to="/login">Увійти</Link>
              <Link to="/register" className="btn-accent">
                Реєстрація
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
