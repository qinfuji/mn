import React from 'react';
import {Router} from 'react-router-dom';
import renderRoutes from './core/renderRoutes';
import routes from './routers';
import Layout from './layouts/Layout';
import history from './core/history';
import dvaContainerProvider from './DvaContainer';
import dvaApp from './initDva';
import './App.css';
const DvaConainer = dvaContainerProvider(dvaApp);

function App() {
  return (
    <DvaConainer>
      <Layout>
        <Router history={history}>{renderRoutes(routes, {})}</Router>
      </Layout>
    </DvaConainer>
  );
}

export default App;
