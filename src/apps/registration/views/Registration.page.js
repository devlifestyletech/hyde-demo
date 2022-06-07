import React, { useEffect, useState } from 'react';
import { Button, Input, Spin, Tabs } from 'antd';
import TableRender from '../components/TableRender';
import Header from '../../../components/header';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import './styles/registration.css';
import authService from '../../../services/auth.service';
import CreateModal from '../components/CreateModal';

const { TabPane } = Tabs;

function RegistrationPage() {
  const [residents, setResidents] = useState([]);
  const [addNewModalVisibility, setAddNewModalVisibility] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      authService.getAllResident().then((res) => {
        let data = [];
        res.data.forEach((res, index) => {
          let user = {
            number: index + 1,
            ...res,
          };
          data.push(user);
        });
        setResidents(data);
        setLoading(false);
      });
    })();
  }, [refresh]);
  console.log(residents);

  let owner_users = residents.filter((user) => user.resident_type === 'Owner');
  let inhabitant_users = residents.filter(
    (user) => user.resident_type === 'Inhabitant'
  );
  let tenant_users = residents.filter(
    (user) => user.resident_type === 'Tenant'
  );

  return (
    <>
      <Header title="Registration" />
      <div className="regis-helper">
        <Input
          prefix={<SearchOutlined />}
          size="large"
          shape="round"
          placeholder="Search by name"
        />
        <Button
          shape="round"
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setAddNewModalVisibility(true)}
        >
          Add new
        </Button>
      </div>
      <br />
      {loading ? (
        <div style={{ textAlign: 'center', margin: 80 }}>
          <Spin />
          <p>Please wait...</p>
        </div>
      ) : (
        <div className="regis-table">
          <Tabs>
            <TabPane tab="All" key="1">
              <TableRender
                data={residents}
                key="1"
                onEvent={() => setRefresh(!refresh)}
              />
            </TabPane>
            <TabPane tab="Owner" key="2">
              <TableRender data={owner_users} key="2" />
            </TabPane>
            <TabPane tab="Inhabitant" key="3">
              <TableRender data={inhabitant_users} key="3" />
            </TabPane>
            <TabPane tab="Tenant" key="4">
              <TableRender data={tenant_users} key="4" />
            </TabPane>
          </Tabs>
        </div>
      )}

      <CreateModal
        visible={addNewModalVisibility}
        onCancel={() => {
          setAddNewModalVisibility(false);
          setRefresh(!refresh);
        }}
      />
    </>
  );
}

export default RegistrationPage;
