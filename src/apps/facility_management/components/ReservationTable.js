import React, { useState } from 'react';
import { Table, Button, Divider, Modal, message } from 'antd';
import { format } from 'date-fns';
import qrIcon from '../assets/qr.svg';
import editIcon from '../assets/edit.svg';
import delIcon from '../assets/trash-2.svg';
import EditReservation from './EditReservation';
import QrModal from './QrModal';
import { db } from '../../../utils/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

export default function ReservationTable({ data, loading, facility }) {
  const [editReservationModalVisibility, setEditReservationModalVisibility] =
    useState(false);
  const [handleItem, setHandleItem] = useState();
  const [showQrModalVisible, setShowQrModalVisible] = useState(false);

  function showConfirmDelete(item) {
    Modal.confirm({
      centered: true,
      title: 'Are you sure you want to delete reservation?',
      icon: null,
      autoFocusButton: null,
      okText: 'Confirm',
      okType: 'danger',
      okButtonProps: { shape: 'round', type: 'danger', size: 'large' },
      cancelButtonProps: { shape: 'round', size: 'large' },
      onOk() {
        return new Promise(async function (resolve, reject) {
          await deleteDoc(doc(db, 'reservations', item))
            .then(() => {
              resolve();
              message.success('Delete reservation successfully');
            })
            .catch((err) => {
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
    {
      title: 'Booked',
      dataIndex: 'booked',
      key: 'idx',
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'idx',
    },
    {
      title: 'Name-Surname',
      dataIndex: 'name',
      key: 'idx',
    },
    {
      title: 'Room Number',
      dataIndex: 'room_number',
      key: 'idx',
    },
    {
      title: 'No. of People',
      dataIndex: 'user_amount',
      key: 'idx',
    },
    {
      title: 'Booking Date',
      dataIndex: 'startDateTime',
      key: 'idx',
      render: (item, idx) => (
        <div key={idx}>{format(item.toDate(), 'yyyy-MM-dd')}</div>
      ),
    },
    {
      title: 'Booking Date',
      dataIndex: 'startDateTime',
      key: 'idx',
      render: (item, idx) => (
        <div key={idx}>{format(item.toDate(), 'HH:mm')}</div>
      ),
    },
    {
      title: 'Booking Date',
      dataIndex: 'endDateTime',
      key: 'idx',
      render: (item, idx) => (
        <div key={idx}>{format(item.toDate(), 'HH:mm')}</div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'idx',
      render: (item, idx) => (
        <div key={idx}>
          <Button
            type="link"
            onClick={() => {
              let dataId = data.find((i) => i.id === item);
              setHandleItem(dataId);
              setShowQrModalVisible(true);
            }}
            icon={<img src={qrIcon} alt="qrcode" />}
          />
          <Divider type="vertical" />
          <Button
            type="link"
            onClick={() => {
              let dataId = data.find((i) => i.id === item);
              setHandleItem(dataId);
              setEditReservationModalVisibility(true);
            }}
            icon={<img src={editIcon} alt="edit" />}
          />
          <Divider type="vertical" />
          <Button
            type="link"
            onClick={() => {
              showConfirmDelete(item);
            }}
            icon={<img src={delIcon} alt="delete" />}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table loading={loading} dataSource={data} columns={columns} />
      <EditReservation
        visible={editReservationModalVisibility}
        facility={facility}
        data={handleItem}
        onCancel={() => setEditReservationModalVisibility(false)}
      />
      <QrModal
        visible={showQrModalVisible}
        data={handleItem}
        onCancel={() => setShowQrModalVisible(false)}
      />
    </div>
  );
}
