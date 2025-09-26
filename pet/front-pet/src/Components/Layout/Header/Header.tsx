import { Menu } from '../Menu/Menu';

export function Header() {
  return (
    <div className="Header">
      <header className="p-3">
        {' '}
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a
              href="/"
              className="d-flex align-items-center mb-2 mb-lg-0 text-black text-decoration-none"
            >
              <svg
                className="bi me-2"
                width="40"
                height="32"
                role="img"
                aria-label="Bootstrap"
              >
                <use xlinkHref="#bootstrap"></use>
              </svg>
            </a>
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <a href="/home" className="nav-link px-2 text-secondary">
                  Home
                </a>
              </li>
              <li>
                <a href="/login" className="nav-link px-2 ">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="nav-link px-2 ">
                  Register
                </a>
              </li>
              <li>
                <a href="/addAnimal" className="nav-link px-2 ">
                  Add Animal
                </a>
              </li>
              <li>
                <a href="/about" className="nav-link px-2 ">
                  About
                </a>
              </li>
            </ul>

            <div className="text-end">
              <button type="button" className="btn  me-2">
                Login
              </button>
              <button type="button" className="btn btn-warning">
                Sign-up
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
