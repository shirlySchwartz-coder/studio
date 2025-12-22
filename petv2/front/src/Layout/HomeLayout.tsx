import { useEffect } from 'react';
import MainRoute from '../Route/MainRoute';
import { Footer } from './Footer';
import { Header } from './Header';
import { Cookie } from 'lucide-react';
//import '../styles/globals.css';

export function HomeLayout() {
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
    <div className="MainLayout container">
      <header>
        <Header />
      </header>
      <main>
        <MainRoute />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
