import { SearchOutlined } from '@ant-design/icons';
import { Button, Divider, Input, message, Modal, Space, Table } from 'antd';
import { format } from 'date-fns';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useSelector } from 'react-redux';
import { db } from '../../../utils/firebaseConfig';
import qrIcon from '../assets/qr.svg';
import delIcon from '../assets/trash-2.svg';
import QrModal from './QrModal';

const ReservationTable = ({ facilityId }) => {
  const { reserves } = useSelector((state) => state.FacilitiesManagementReducer);
  const [handleItem, setHandleItem] = useState();
  const [showQrModalVisible, setShowQrModalVisible] = useState(false);
  
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown            : ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div
            style={{
              padding: 8,
            }}
        >
          <Input
              ref={searchInput}
              placeholder={'Search by name'}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display     : 'block',
              }}
          />
          <Space>
            <Button
                type='primary'
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size='small'
                style={{
                  width: 90,
                }}
            >
              Search
            </Button>
            <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size='small'
                style={{
                  width: 90,
                }}
            >
              Reset
            </Button>
            <Button
                type='link'
                size='small'
                onClick={() => {
                  confirm({
                            closeDropdown: false,
                          });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
            >
              Filter
            </Button>
          </Space>
        </div>
    ),
    filterIcon                : (filtered) => (
        <SearchOutlined
            style={{
              color: filtered ? '#1890ff' : undefined,
            }}
        />
    ),
    onFilter                  : (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render                    : (text) =>
        searchedColumn === dataIndex ? (
            <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding        : 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
        ) : (
            text
        ),
  });
  
  let dataSource = reserves.filter((reserve) => reserve.facilityId === facilityId);
  console.log(dataSource);
  
  function showConfirmDelete(item) {
    Modal.confirm({
                    centered         : true,
                    title            : 'Are you sure you want to delete reservation?',
                    icon             : null,
                    autoFocusButton  : null,
                    okText           : 'Confirm',
                    okType           : 'danger',
                    okButtonProps    : { shape: 'round', type: 'danger', size: 'large' },
                    cancelButtonProps: { shape: 'round', size: 'large' },
                    onOk() {
                      return new Promise(async function(resolve, reject) {
                        await deleteDoc(doc(db, 'reserves', item)).then(() => {
                          resolve('DELETE SUCCESS');
                          message.success('Delete reservation successfully');
                        }).catch((err) => {
                          console.error(err);
                          reject(err);
                        });
                      });
                    },
                    onCancel() {
                      return null;
                    },
                  });
  }
  
  const columns = [
    { title: 'Booked By', dataIndex: 'bookedBy', key: 'id' },
    {
      title    : 'Full Name',
      dataIndex: 'userFullName',
      key      : 'id',
      ...getColumnSearchProps('userFullName'),
    },
    {
      title    : 'Phone Number',
      dataIndex: 'userTel',
      key      : 'id',
    },
    {
      title         : 'Date to reserve',
      dataIndex     : 'bookedDate',
      key           : 'id',
      render        : (item) => (item ? format(item.toDate(), 'dd MMMM yyyy') : null),
      sorter        : (a, b) => a.bookedDate - b.bookedDate,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title    : 'Slot',
      dataIndex: 'slot',
      key      : 'id',
    },
    {
      title    : 'Topic',
      dataIndex: 'topic',
      key      : 'id',
      render   : (item) => (<div>{item.length < 10 ? item : item.slice(0, 10) + '...'}</div>),
    },
    {
      title    : 'Note',
      dataIndex: 'note',
      key      : 'id',
      render   : (item) => (<div>{item.length < 10 ? item : item.slice(0, 10) + '...'}</div>),
      
    },
    {
      title    : 'Action',
      dataIndex: 'id',
      key      : 'id',
      render   : (item, idx) => (
          <div key={idx}>
            <Button type='link'
                    onClick={() => {
                      let dataId = dataSource.find((i) => i.id === item);
                      setHandleItem(dataId);
                      setShowQrModalVisible(prevState => !prevState);
                    }}
                    icon={<img src={qrIcon} alt='qrcode' />}
            />
            <Divider type='vertical' />
            <Button type='link'
                    onClick={() => showConfirmDelete(item)}
                    icon={<img src={delIcon} alt='delete' />}
            />
          </div>
      ),
    },
  ];
  
  return (
      <div>
        <Table dataSource={dataSource}
               columns={columns}
               scroll={{
                 y: 600,
               }} />
        <QrModal
            visible={showQrModalVisible}
            data={handleItem}
            onCancel={() => setShowQrModalVisible(false)}
        />
      </div>
  );
};

export default ReservationTable;
