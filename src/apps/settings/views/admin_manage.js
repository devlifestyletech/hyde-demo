import React, { useState, useEffect } from 'react';
import Header from '../../../components/header';
import { getAllJuristic } from '../services/admin.services';
import UserTable from '../components/UserTable';
import { Tabs } from 'antd';

const TabPane = Tabs;

function AdminManagementPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllJuristic();
        if (data) {
          setLoading(false);
          setUsers(data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <React.Fragment>
      <Header title="Admin Management" />
      <div className="container"></div>
    </React.Fragment>
  );
}

export default AdminManagementPage;
