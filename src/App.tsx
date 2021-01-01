import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { LaptopOutlined, FileAddOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import './App.css';

import { Home } from './Home';
import { AddRecipeConnector } from './AddRecipeConnector';
import { ShoppingList } from './ShoppingList';
import { RecipesContextProvider } from './Context';

const { Header } = Layout;

function App() {
  return (
    <RecipesContextProvider>
      <Router>
        <Layout>
          <Header style={{display: 'flex'}}>
            <div className='logo' style={{ marginRight: '20px' }}>
              <img alt='logo' src={'http://bluewolf.pl/wp-content/themes/bluewolf/fonts/logo.svg'} width='50px' height='50px' />
            </div>
            <Menu theme={'dark'} mode={'horizontal'}>
              <Menu.Item key={1}><Link to={'/'}><LaptopOutlined />Calendar</Link></Menu.Item>
              <Menu.Item key={2}><Link to={'/add-recipe'}><FileAddOutlined />Add recipe</Link></Menu.Item>
              <Menu.Item key={3}><Link to={'/shopping-list'}><ShoppingCartOutlined />Daily shopping list</Link></Menu.Item>
            </Menu>
          </Header>
        </Layout>
        <Switch>
          <Route path={'/add-recipe'}>
            <AddRecipeConnector />
          </Route>
          <Route path={'/shopping-list'}>
            <ShoppingList />
          </Route>
          <Route path={'/'}>
            <Home />
          </Route>
        </Switch>
      </Router>
    </RecipesContextProvider>
  )
}

export default App;
