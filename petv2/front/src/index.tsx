import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './Redux/store';
import { ToastContainer } from 'react-toastify';
import { HomeLayout } from './Layout/HomeLayout';
import './styles/globals.css';
import ErrorBoundary from './Components/ErrorBoundary';
import { loadUserFromCookie } from './middleware/loadUserFromCookie';

const AppInitializer = ()=>{
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(loadUserFromCookie() as any)
  },[dispatch]);
  return null;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <AppInitializer/>
        <HomeLayout />
      </ErrorBoundary>
    </BrowserRouter>
    <ToastContainer />
  </Provider>
);
