import React, { useEffect, useState } from 'react';
import { Button, Input, Tabs } from 'antd';
import TableRender from '../components/TableRender';
import Header from '../../../components/Header';
import { PlusOutlined } from '@ant-design/icons';
import './styles/registration.css';
import authService from '../../../services/authServices';
import CreateModal from '../components/CreateModal';

const { TabPane } = Tabs;

function Registration() {
  const [residents, setResidents] = useState([]);
  const [addNewModalVisibility, setAddNewModalVisibility] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResident, setSearchResident] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await authService.getAllResident();
      if (data) {
        let d = [];
        data.forEach((res, index) => {
          let user = {
            number: index + 1,
            ...res,
          };
          d.push(user);
        });
        setResidents(d);
        setLoading(false);
      }
      try {
      } catch (e) {
        console.log(e);
      }
    })();
  }, [refresh]);

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

  return (
    <>
      <Header title="Registration" />
      <div className="regis-helper">
        <Input.Search
          style={{ width: 400 }}
          size="large"
          shape="round"
          placeholder="Search by name"
          allowClear
          enterButton
          onSearch={handleSearch}
        />
        <Button
          shape="round"
          type="primary"
          icon={<PlusOutlined />}
          className="btn-create"
          size="large"
          onClick={() => setAddNewModalVisibility(true)}
        >
          Add new
        </Button>
      </div>
      <div className="regis-table">
        <TableRender
          loading={loading}
          data={search !== '' ? searchResident : residents}
          key="1"
          onEvent={() => setRefresh(!refresh)}
        />
      </div>
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

export default Registration;
