import { useEffect } from 'react';
import '../styles/globals.css';
import MainRoute from '../Route/MainRoute';
import { Footer } from './Footer';
import { Header } from './Header';
//import './MainLayout.css';
import '../styles/layout.css';
import { SideBar } from './SideBar';

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
    <div className="MainLayout containerClass container mx-auto p-4">
      <header>
        <Header />
      </header>
      <aside>
        <SideBar />
      </aside>
      <main>
        <MainRoute />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
export default MainLayout;
