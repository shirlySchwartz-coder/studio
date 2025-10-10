import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../redux/actions/authActions';
import { AppDispatch, RootState } from '../../redux/store';
import { useState } from 'react';

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, fullName, roleId } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('animals');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('roleId');
    dispatch(logout());
    navigate('/login');
    setIsOpen(false);
  };

  const goTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/home', label: 'דף הבית', roles: [1, 2, 3] },
    { path: '/addAnimal', label: 'הוספת חיה', roles: [2, 3] },
    { path: '/about', label: 'אודות', roles: [1, 2, 3] },
  ];

  const filteredItems = menuItems.filter(
    (item) => !roleId || item.roles.includes(roleId)
  );

  return (
    <nav className="menu">
      {/* Desktop Menu */}
      {isLoggedIn ? (
        <div className="menu-desktop">
          <ul>
            {filteredItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(item.path);
                  }}
                  className={isActive(item.path) ? 'active' : ''}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="user-section">
            <span className="user-name">{fullName || 'משתמש'}</span>
            <button onClick={handleLogout} className="btn-logout">
              התנתק
            </button>
          </div>
        </div>
      ) : (
        <div className="menu-desktop">
          <ul>
            <li>
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  goTo('/login');
                }}
                className={isActive('/login') ? 'active' : ''}
              >
                התחברות
              </a>
            </li>
            <li>
              <a
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  goTo('/register');
                }}
                className={isActive('/register') ? 'active' : ''}
              >
                הרשמה
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Mobile Toggle */}
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="menu-mobile">
          {isLoggedIn ? (
            <>
              <div className="mobile-user">
                <span>{fullName || 'משתמש'}</span>
              </div>
              <ul>
                {filteredItems.map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(item.path);
                      }}
                      className={isActive(item.path) ? 'active' : ''}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <button onClick={handleLogout} className="btn-logout-mobile">
                התנתק
              </button>
            </>
          ) : (
            <ul>
              <li>
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    goTo('/login');
                  }}
                >
                  התחברות
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    goTo('/register');
                  }}
                >
                  הרשמה
                </a>
              </li>
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}
