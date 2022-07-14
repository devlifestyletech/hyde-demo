import React, { useState, useEffect } from 'react';
import Header from '../../../components/header';
import { getAllJuristic } from '../services/admin.services';
import UserTable from '../components/UserTable';
import { Tabs, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '../styles/main.css';
import ModalCreateJuristic from '../components/ModalCreateJuristic';

const { TabPane } = Tabs;

function AdminManagementPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [modalCreateJuristicVisible, setModalCreateJuristicVisible] =
    useState(false);

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

  let project_admin = users.filter(
    (user) => user?.role?.type === 'admin_project'
  );
  let juristics = users.filter((user) => user?.role?.type === 'juristic');

  const handleSearch = (value) => {};

  return (
    <>
      <Header title="Admin Management" />
      <div className="search-container">
        <Input.Search
          placeholder="Search by name..."
          enterButton
          style={{ width: 400 }}
          size="large"
          shape="round"
          allowClear
          onSearch={handleSearch}
        />
        <Button
          type={'primary'}
          className={'create-juristic'}
          icon={<PlusOutlined />}
          shape={'round'}
          size={'large'}
          onClick={() =>
            setModalCreateJuristicVisible(!modalCreateJuristicVisible)
          }
        >
          Create New Juristic
        </Button>
      </div>
      <div className="container">
        <Tabs defaultActiveKey="1">
          <TabPane key="all" tab="All">
            <UserTable key="all_user_table" data={users} loading={loading} />
          </TabPane>
          <TabPane key="admin_projects" tab="Project Admin">
            <UserTable
              key="admin_user_table"
              data={project_admin}
              loading={loading}
            />
          </TabPane>
          <TabPane key="juristic" tab="Juristic">
            <UserTable
              key="juristic_user_table"
              data={juristics}
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </div>
      <ModalCreateJuristic
        visible={modalCreateJuristicVisible}
        cancelHandler={() =>
          setModalCreateJuristicVisible(!modalCreateJuristicVisible)
        }
      />
    </>
  );
}

export default AdminManagementPage;
