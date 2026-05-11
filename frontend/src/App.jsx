import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tenders from "./pages/Tenders";
import TenderDetail from "./pages/TenderDetail";
import CreateTender from "./pages/CreateTender";
import Portfolio from "./pages/Portfolio";
import CreatePortfolio from "./pages/CreatePortfolio";
import Constructor from "./pages/Constructor";
import Dashboard from "./pages/Dashboard";
import HowItWorks from "./pages/HowItWorks";
import FAQ from "./pages/FAQ";
import Contacts from "./pages/Contacts";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tenders" element={<Tenders />} />
              <Route path="/tenders/create" element={<CreateTender />} />
              <Route path="/tenders/:id" element={<TenderDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/create" element={<CreatePortfolio />} />
              <Route path="/constructor" element={<Constructor />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contacts" element={<Contacts />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
