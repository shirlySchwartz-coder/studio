import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../Redux/actions/authActions';
import { AppDispatch, RootState } from '../Redux/store';
import { useState } from 'react';
import { Button } from '../Components/Ui/button';

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, fullName, roleId } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());

    navigate('/home');
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
    { path: '/about', label: 'אודות', roles: [1, 2, 3, 4] },
    { path: '/searchAnimals', label: 'חיפוש ', roles: [1, 2, 3, 4] },
    { path: '/dash', label: 'דשבורד ', roles: [1, 2, 3] },
  ];

  const filteredItems = menuItems.filter(
    (item) => !roleId || item.roles.includes(roleId)
  );

  return (
    <nav className="menu">
      {/* Desktop Menu */}
      {isLoggedIn ? (
        <div className="menu-desktop">
          {filteredItems.map((item) => (
            <a
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                goTo(item.path);
              }}
              //className={isActive(item.path) ? 'active' : ''}
              className="menu-item"
              key={item.label}
            >
              {item.label}
            </a>
          ))}
          <div className="user-section">
            <span className="user-name">{fullName || 'משתמש'}</span>
            <Button onClick={handleLogout} className="btn-ghost">
              התנתק
            </Button>
          </div>
        </div>
      ) : (
        <div className="menu-desktop">
          <Button
            onClick={(e) => {
              e.preventDefault();
              goTo('/login');
            }}
            className={isActive('/login') ? 'active' : ''}
          >
            התחברות
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              goTo('/register');
            }}
            className={isActive('/register') ? 'active' : ''}
          >
            הרשמה
          </Button>
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
              {filteredItems.map((item) => (
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
              ))}

              <button onClick={handleLogout} className="btn-logout-mobile">
                התנתק
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  goTo('/login');
                }}
              >
                התחברות
              </a>

              <a
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  goTo('/register');
                }}
              >
                הרשמה
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
