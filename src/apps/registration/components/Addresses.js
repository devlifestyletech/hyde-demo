import React, { useEffect, useState } from 'react';

//import services file
import ProjectService from '../services/projectServices';

//import project components
import { RoomInfoModal } from './RoomInfoModal';

//antd components
import { Button, Row } from 'antd';
import { FormOutlined, PhoneOutlined } from '@ant-design/icons';
import './styles/addresses.css';

export default function Addresses({ data, update }) {
  const [residentList, setResidentList] = useState([]);
  const [owner, setOwner] = useState([]);
  const [roomInfoModalVisibility, setRoomInfoModalVisibility] = useState(false);
  const [inhabitant, setInhabitant] = useState([]);
  const [tenant, setTenant] = useState([]);
  const [addressId, setAddressId] = useState(null);
  const [qrOpenGate, setqrOpenGate] = useState('');
  const [qeCodeSmartLocker, setQeCodeSmartLocker] = useState('');
  const [refresh, setRefresh] = useState(true);

  //actions
  useEffect(() => {
    ProjectService.getResidentListByResidenceId(data.id).then((res) => {
      update(data.id, res.data);
      // console.log(res.data);
      setResidentList(res.data);
      setOwner(res.data.filter((user) => user.resident_role === 'Owner'));
      setInhabitant(
        res.data.filter((user) => user.resident_role === 'Inhabitant')
      );
      setTenant(res.data.filter((user) => user.resident_role === 'Tenant'));
      setAddressId(res.data[0]?.address.id ?? null);
      setqrOpenGate(res.data[0]?.address.qr_code_open_gate ?? null);
      setQeCodeSmartLocker(res.data[0]?.address.qr_code_smart_locker ?? null);
    });
    setRefresh(false);
  }, [data.id, refresh]);

  return (
    <>
      {data.resident_lists.length ? (
        <div className="address">
          <div className="more">
            <FormOutlined
              onClick={() => {
                setRoomInfoModalVisibility(true);
              }}
              style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}
            />
          </div>
          <p className="addressTxt">Address: {data.address_number}</p>
          <div>
            {owner.length
              ? owner.map((owner, index) => (
                  <div key={index} style={{ fontSize: 16 }}>
                    {owner?.users_permissions_user?.fullname}
                    <br />
                    <PhoneOutlined /> {owner?.users_permissions_user?.tel}
                  </div>
                ))
              : null}
          </div>
          <Row style={{ float: 'right', marginTop: 8 }}>
            {residentList.length
              ? residentList.map((resident, index) => (
                  <div key={index} style={{ marginLeft: -20 }}>
                    {resident?.users_permissions_user?.image ? (
                      <div>
                        <img
                          src={
                            process.env.REACT_APP_API_URL +
                              resident?.users_permissions_user?.image?.url ??
                            null
                          }
                          alt="img"
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            zIndex: 0 - index,
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          height: 50,
                          width: 50,
                          backgroundColor: '#DADADA',
                          borderRadius: 25,
                          border: '0.5px solid',
                        }}
                      />
                    )}
                  </div>
                ))
              : null}
          </Row>
        </div>
      ) : (
        <div className="address-empty">
          <div className="more">
            <FormOutlined
              onClick={() => {
                setRoomInfoModalVisibility(true);
              }}
              style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}
            />
          </div>
          Address: {data.address_number}
          <div className="room-empty">
            Available Room
            <Button
              type="link"
              style={{ fontSize: 14 }}
              onClick={() => {
                setRoomInfoModalVisibility(true);
              }}
            >
              + Add new owner
            </Button>
          </div>
        </div>
      )}
      <div>
        <RoomInfoModal
          id={data.id}
          owner={owner}
          inhabitant={inhabitant}
          tenant={tenant}
          addressId={addressId}
          visible={roomInfoModalVisibility}
          qrOpenGate={qrOpenGate}
          qrCodeSmartLocker={qeCodeSmartLocker}
          refresh={() => {
            setRefresh(!refresh);
          }}
          onCancel={() => {
            setRoomInfoModalVisibility(false);
            setRefresh(!refresh);
          }}
        />
      </div>
    </>
  );
}
