import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo" aria-hidden>
          A
        </span>
        <div className="header__titles">
          <h1 className="header__name">Arcus</h1>
          <p className="header__tagline">A R C U S</p>
        </div>
      </div>
      <div className="header__status">
        <span className="header__dot" />
        <span>Online</span>
      </div>
    </header>
  );
}
