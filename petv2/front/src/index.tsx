import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../src/redux/store';
import { ToastContainer } from 'react-toastify';
import { HomeLayout } from './Layout/HomeLayout';
import './styles/globals.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <HomeLayout />
    </BrowserRouter>
    <ToastContainer />
  </Provider>
);
