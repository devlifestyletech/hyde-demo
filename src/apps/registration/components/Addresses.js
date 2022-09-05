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
  const [roomInfoModalVisibility, setRoomInfoModalVisibility] = useState(false);
  const [refresh, setRefresh] = useState(true);

  //actions
  useEffect(() => {
    if (refresh) {
      let list = [data.owner, ...data.inhabitants, ...data.tenants];
      setResidentList(list);
      setRefresh(false);
    }
  }, [refresh, data]);

  return (
    <>
      {data.owner ? (
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
          <p className="addressTxt roomTxt">{`Room No: ${data.room_number}(${data.room_type})`}</p>
          <div>
            {data.owner ? (
              <div style={{ fontSize: 16 }}>
                {data?.owner?.fullname}
                <br />
                <PhoneOutlined /> {data?.owner?.tel}
              </div>
            ) : null}
          </div>
          <Row style={{ float: 'right', marginTop: 8 }}>
            {residentList.length
              ? residentList.map((resident, index) => (
                  <div key={index} style={{ marginLeft: -20 }}>
                    {resident?.image ? (
                      <div>
                        <img
                          src={
                            process.env.REACT_APP_API_URL +
                              resident?.image?.url ?? null
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
          <p className="addressTxt">Address: {data.address_number}</p>
          <p className="addressTxt roomTxt">{`Room No: ${data.room_number}(${data.room_type})`}</p>
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
          owner={data?.owner}
          inhabitant={data?.inhabitants}
          tenant={data?.tenants}
          addressId={data?.id}
          visible={roomInfoModalVisibility}
          qrOpenGate={data.qr_code_open_gate}
          qrCodeSmartLocker={data.qr_code_smart_locker}
          refresh={(val) => {
            update(data.id, val);
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
