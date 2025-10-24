import { useEffect } from 'react';
import MainRoute from '../Route/MainRoute';
import { Footer } from './Footer';
import { Header } from './Header';
import './MainLayout.css';

function MainLayout() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('animals');
      sessionStorage.clear();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  return (
    <div className="MainLayout container mx-auto p-4">
      <header className="MainLayout-header">
        <Header />
      </header>
      <main className="MainLayout-main">
        <MainRoute />
      </main>
      <footer className="MainLayout-footer">
        <Footer />
      </footer>
    </div>
  );
}
export default MainLayout;
