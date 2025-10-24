import { Menu } from './Menu';
import './Header.css';

export function Header() {
  return (
    <div className="header-container">
      <div className="logo" onClick={() => (window.location.href = '/home')}>
        <span>🐾</span>
        <h1>Pet-Net</h1>
      </div>
      <Menu />
    </div>
  );
}
