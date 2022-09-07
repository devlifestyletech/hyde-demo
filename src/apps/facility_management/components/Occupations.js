import React, { useState, useEffect } from 'react';
import { Card, Space, Row, Col, Button } from 'antd';
import noImg from '../assets/img/no_img.png';
import axios from 'axios';
import { encryptStorage } from '../../../utils/encryptStorage';

//components
import editIcon from '../assets/edit.svg';
import lowIcon from '../assets/low.svg';
import mediumIcon from '../assets/medium.svg';
import highIcon from '../assets/high.svg';
import EditOccupation from './EditOccupation';

const session = encryptStorage.getItem('user_session');

export default function Occupations() {
  const headers = {
    headers: {
      Authorization: 'Bearer ' + session.jwt,
    },
  };
  const [id, setId] = useState(null);
  const [occupations, setOccupations] = useState([]);
  const [editOccupationModalVisibility, setEditOccupationModalVisibility] =
    useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDetail, setRoomDetail] = useState('');
  const [mediumAt, setMediumAt] = useState(null);
  const [highAt, setHighAt] = useState(null);
  const [image, setImage] = useState('');
  const [opened, setOpened] = useState(null);
  const [closed, setClosed] = useState(null);

  // functions
  const fetchData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/occupations`)
      .then((res) => {
        setOccupations(res.data);
      })
      .catch((err) => {
        console.debug(err);
      });
  };

  const editOccupation = async (value, files, id) => {
    let dataImage = new FormData();
    let imageId = [];
    if (files) {
      dataImage.append('files', files[0]);
      await axios
        .post(process.env.REACT_APP_API_URL + '/upload/', dataImage, headers)
        .then((res) => {
          imageId = res.data[0];
          axios
            .put(
              `${process.env.REACT_APP_API_URL}/occupations/${id}`,
              {
                room_name: value.roomName,
                room_detail: value.roomDetail,
                low_status_people: value.mediumAt,
                medium_status_people: value.highAt,
                opened: value.opened,
                closed: value.closed,
                image: imageId,
              },
              headers
            )
            .then((res) => {
              fetchData();
              alert('Edit occupation room success');
            })
            .catch((err) => {
              console.error("Can't edit data: ", err);
            });
        })
        .catch((err) => {
          console.debug('Err', err);
        });
    } else {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/occupations/${id}`,
          {
            room_name: value.roomName,
            room_detail: value.roomDetail,
            low_status_people: value.mediumAt,
            medium_status_people: value.highAt,
            opened: value.opened,
            closed: value.closed,
          },
          headers
        )
        .then((res) => {
          fetchData();
          alert('Edit occupation room success');
        })
        .catch((err) => {
          console.error("Can't edit data: ", err);
        });
    }
  };

  // actions
  useEffect(() => {
    (async () => {
      fetchData();
    })();
  }, []);

  return (
    <>
      <Space style={{ justifyContent: 'center' }} wrap>
        {occupations ? (
          occupations.map((occupation, index) => (
            <div key={index} className="facilities-card">
              <Card
                cover={
                  <img
                    src={
                      occupation.image
                        ? `${process.env.REACT_APP_API_URL}${occupation.image.url}`
                        : noImg
                    }
                    alt="place"
                    style={{
                      width: '100%',
                      height: 285,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                  />
                }
                style={{ width: 435 }}
              >
                <Row>
                  <Col span={22}>
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                      {occupation.room_name}
                    </div>
                  </Col>
                  <Col span={2}>
                    <Button
                      type="link"
                      onClick={() => {
                        setId(occupation.id ?? '');
                        setRoomName(occupation.room_name ?? '');
                        setRoomDetail(occupation.room_detail ?? '');
                        setMediumAt(occupation.low_status_people ?? 0);
                        setHighAt(occupation.medium_status_people ?? 0);
                        setOpened(occupation.opened ?? null);
                        setClosed(occupation.closed ?? null);
                        setImage(occupation?.image?.url ?? null);
                        setEditOccupationModalVisibility(true);
                      }}
                    >
                      <img src={editIcon} alt="edit" />
                    </Button>
                  </Col>
                </Row>
                <div>
                  {occupation.current_people < occupation.low_status_people ? (
                    <Row>
                      <div>
                        <img
                          src={lowIcon}
                          alt="low"
                          style={{ marginRight: 10 }}
                        />
                        Low
                      </div>
                    </Row>
                  ) : occupation.current_people <
                    occupation.medium_status_people ? (
                    <Row>
                      <div>
                        <img
                          src={mediumIcon}
                          alt="low"
                          style={{ marginRight: 10 }}
                        />
                        Medium
                      </div>
                    </Row>
                  ) : (
                    <Row>
                      <div>
                        <img
                          src={highIcon}
                          alt="low"
                          style={{ marginRight: 10 }}
                        />
                        High
                      </div>
                    </Row>
                  )}
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div></div>
        )}
      </Space>
      <EditOccupation
        visible={editOccupationModalVisibility}
        onCancel={() => {
          setEditOccupationModalVisibility(false);
        }}
        id={id}
        roomName={roomName}
        roomDetail={roomDetail}
        mediumAt={mediumAt}
        highAt={highAt}
        image={image}
        onEdit={editOccupation}
        opened={opened}
        closed={closed}
      />
    </>
  );
}
