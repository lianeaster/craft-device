import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Craft-Device</h3>
          <p>
            Платформа для замовлення крафтового обладнання. З'єднуємо тих, хто
            потребує унікальне обладнання, з тими, хто його створює.
          </p>
        </div>
        <div className="footer-col">
          <h4>Платформа</h4>
          <Link to="/tenders">Тендери</Link>
          <Link to="/portfolio">Портфоліо</Link>
          <Link to="/constructor">Конструктор</Link>
        </div>
        <div className="footer-col">
          <h4>Категорії</h4>
          <Link to="/tenders?category_id=1">Металообробка</Link>
          <Link to="/tenders?category_id=2">Деревообробка</Link>
          <Link to="/tenders?category_id=3">Харчове</Link>
          <Link to="/tenders?category_id=6">Фільтрація</Link>
        </div>
        <div className="footer-col">
          <h4>Підтримка</h4>
          <Link to="/how-it-works">Як це працює</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contacts">Контакти</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Craft-Device. Всі права захищені.
      </div>
    </footer>
  );
}
