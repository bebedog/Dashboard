import React, {createContext, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './Components/Home';
import { Layout, Menu, } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { Routes, Route, NavLink } from 'react-router-dom';
import Accounts from './Components/Accounts';
import {AppProvider} from './Context/AppProvider';


function App() {
  const [isLocal] = useState(false)
  console.log("tawa", false)
  return (
    
    <AppProvider isLocal={isLocal}>
    {
      <Layout style={{backgroundColor: "#F5F5F5", minHeight: "100vh"}}>
        <Header style={{width: "100%", backgroundColor: "#FFFFFF"}}>
          <Menu
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                items={[
                  {
                  key: "1",
                  label: (<NavLink to={"/"}>Promo Codes</NavLink>)
                  },
                  {
                  key: "2",
                  label: (<NavLink to={"/accounts"}>Accounts</NavLink>)
                  },
                ]}
                
                style={{
                  flex: 1,
                  minWidth: "100%",
                }}
              />
        </Header>
        <Content style={{paddingTop:"10px", backgroundColor: "#F5F5F5"}}>
        
          <Routes>
            <Route path='/' element={<Home />}>

            </Route>
            
            <Route path='/accounts' element={<Accounts />}>

            </Route>

          </Routes>
        </Content>
      </Layout>
    }
    </AppProvider>
  );
}

export default App;
