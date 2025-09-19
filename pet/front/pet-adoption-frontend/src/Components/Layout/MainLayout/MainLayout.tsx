import { Header }  from '../Header/Header';
import { Menu } from '../Menu/Menu';
import { Footer } from '../Footer/Footer';
import { MainRoute } from '../../Route/MainRoute';
import './MainLayout.css';
import { Login } from '../../Pages/Login';

function MainLayout() {
  return (
      <div className='MainLayout'>
          <header>
              <Header/>
          </header>
          <aside>
              <Menu/>
          </aside>
          <main>
              {/* Main Router will be rendered here */}
              <h1>Main</h1>
              <Login/>
              <MainRoute/>
          </main>
          <footer>
              <Footer/>
          </footer>
    </div>
  );
}

export default MainLayout;