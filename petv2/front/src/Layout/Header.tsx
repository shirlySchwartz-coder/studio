import { Button } from '../Components/Ui/button';
import { Menu } from './Menu';
import './Header.css';
import '../styles/globals.css';

export function Header() {
  return (
    <div className="header-spacer shadow-sm">
      <div className="header-container">
        <div
          className="logo-section "
          onClick={() => (window.location.href = '/home')}
        >
          <span className="logo-image">🐾</span>
          <span className="logo-text">Pet-Net</span>
        </div>
        <Menu />
      </div>
    </div>
  );
}
