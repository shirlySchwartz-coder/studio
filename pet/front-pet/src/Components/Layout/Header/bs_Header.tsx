export function Header() {
  return (
    <div>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: '#e3f2fd' }}
        data-bs-theme="light"
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">
            Pet Adoption
          </a>
          <button
            type="button"
            className="navbar-toggler"
            data-bs-toggle="collapse"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/home">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  Login
                </a>
              </li>
            </ul>
            <span className="navbarNav">Menu</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
