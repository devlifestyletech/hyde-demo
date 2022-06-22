import React, { useEffect, useState } from 'react';
import { Button, Input, Spin, Tabs } from 'antd';
import TableRender from '../components/TableRender';
import Header from '../../../components/header';
import { PlusOutlined } from '@ant-design/icons';
import './styles/registration.css';
import authService from '../../../services/auth.service';
import CreateModal from '../components/CreateModal';

const { TabPane } = Tabs;

function RegistrationPage() {
  const [residents, setResidents] = useState([]);
  const [addNewModalVisibility, setAddNewModalVisibility] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResident, setSearchResident] = useState([]);

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
  console.log(searchResident);

  const handleSearch = (value) => {
    setSearch(value);
    let data = [];
    residents.forEach((res) => {
      if (res.fullname.includes(value)) {
        data.push(res);
      }
    });
    setSearchResident(data);
  };

  let owner_users = residents.filter((user) => user.resident_type === 'Owner');
  let inhabitant_users = residents.filter(
    (user) => user.resident_type === 'Inhabitant'
  );
  let tenant_users = residents.filter(
    (user) => user.resident_type === 'Tenant'
  );

  if (search !== '') {
    owner_users = searchResident.filter(
      (user) => user.resident_type === 'Owner'
    );
    inhabitant_users = searchResident.filter(
      (user) => user.resident_type === 'Inhabitant'
    );
    tenant_users = searchResident.filter(
      (user) => user.resident_type === 'Tenant'
    );
  }

  return (
    <>
      <Header title="Registration" />
      <div className="regis-helper">
        <Input.Search
          style={{ width: 400 }}
          size="large"
          shape="round"
          placeholder="Search by address"
          allowClear
          enterButton
          onSearch={handleSearch}
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
                data={search !== '' ? searchResident : residents}
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
