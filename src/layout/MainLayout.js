import React from 'react';
import { Layout } from 'antd';
import { Navigate, useLocation, useOutlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NewSideMenu from '../components/new_side_menu';

const { Sider, Content } = Layout;

function MainLayout() {
  const location = useLocation(); // <-- get current location being accessed
  const { isSignIn } = useAuth();
  const outlet = useOutlet();
  if (!isSignIn)
    return <Navigate to="/signin" replace state={{ from: location }} />;

  return (
    <Layout>
      <Sider
        width={300}
        style={{
          backgroundColor: 'white',
          height: '100vh',
          position: 'fixed',
          left: 0,
          overflow: 'auto',
          paddingBottom: 55,
        }}
      >
        <NewSideMenu />
      </Sider>
      <Content
        style={{ backgroundColor: 'white', padding: 35, marginLeft: 300 }}
      >
        {outlet}
      </Content>
    </Layout>
  );
}

export default MainLayout;
