import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { getAllJuristic } from '../services/adminServices';
import UserTable from '../components/UserTable';
import { Tabs, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '../styles/main.css';
import ModalCreateJuristic from '../components/ModalCreateJuristic';

const { TabPane } = Tabs;

function AdminManagementPage() {
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(null);
  const [projectAdmin, setProjectAdmin] = useState(null);
  const [juristics, setJuristics] = useState(null);
  const [modalCreateJuristicVisible, setModalCreateJuristicVisible] =
    useState(false);

  useEffect(() => {
    if (refresh) {
      (async () => {
        try {
          const { data } = await getAllJuristic();
          if (data) {
            let projectAdminResult = data.filter(
              (item) => item?.role?.type === 'admin_project'
            );
            let juristicsResult = data.filter(
              (item) => item?.role?.type === 'juristic'
            );
            setLoading(false);
            setUsers(data);
            setSearch(data);
            setProjectAdmin(projectAdminResult);
            setJuristics(juristicsResult);
          }
        } catch (error) {
          console.error(error);
        }
      })();
      setRefresh(false);
    }
  }, [refresh]);

  const handleSearch = async (value) => {
    let result = users.filter((item) =>
      item.fullname.toLowerCase().includes(value.toLowerCase())
    );
    let projectAdminResult = result.filter(
      (item) => item?.role?.type === 'admin_project'
    );
    let juristicsResult = result.filter(
      (item) => item?.role?.type === 'juristic'
    );
    setSearch(result);
    setProjectAdmin(projectAdminResult);
    setJuristics(juristicsResult);
  };

  const refreshHandle = () => {
    setRefresh(true);
  };

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
        <Tabs defaultActiveKey="all">
          <TabPane key="all" tab="All">
            <UserTable
              tableKey="all_user_table"
              data={search}
              loading={loading}
              onRefresh={refreshHandle}
            />
          </TabPane>
          <TabPane key="admin_projects" tab="Project Admin">
            <UserTable
              tableKey="admin_user_table"
              data={projectAdmin}
              loading={loading}
              onRefresh={refreshHandle}
            />
          </TabPane>
          <TabPane key="juristic" tab="Juristic">
            <UserTable
              tableKey="juristic_user_table"
              data={juristics}
              loading={loading}
              onRefresh={refreshHandle}
            />
          </TabPane>
        </Tabs>
      </div>
      <ModalCreateJuristic
        visible={modalCreateJuristicVisible}
        cancelHandler={() =>
          setModalCreateJuristicVisible(!modalCreateJuristicVisible)
        }
        onRefresh={refreshHandle}
      />
    </>
  );
}

export default AdminManagementPage;
