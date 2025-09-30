import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { MainRoute } from '../../Route/MainRoute';
import './MainLayout.css';
import { SideMenu } from '../SideMenu/SideMenu';

function MainLayout() {
  return (
    <div className="MainLayout container mx-auto p-4">
      {/*  <header>
        <Header />
      </header> */}
      {/* <aside>
        <SideMenu />
      </aside> */}
      <main>
        {/* Main Router will be rendered here */}
        <MainRoute />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default MainLayout;
