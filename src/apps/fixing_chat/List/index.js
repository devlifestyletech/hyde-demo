/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, utcToZonedTime } from 'date-fns-tz';
import {
  List as AntdList,
  Avatar,
  Select,
  Skeleton,
  Divider,
  Row,
  Col,
} from 'antd';
import noImg from '../../assets/images/noImg.jpg';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { encryptStorage } from '../../../utils/encryptStorage';
import Service from '../../../services/authServices';
import { socket } from '../../../services/webSocketService';

const { Option } = Select;

function List(props) {
  const session = encryptStorage.getItem('user_session');
  const [contactList, setContactList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [curRoom, setCurRoom] = useState([]);
  const headers = { headers: { Authorization: 'Bearer ' + session.jwt } };
  const thTimeZone = 'Asia/Bangkok';
  const toDay = format(utcToZonedTime(new Date(), thTimeZone), 'dd-MM-yyyy', {
    timeZone: 'Asia/Bangkok',
  });
  const status = {
    Pending: '#E86A6B',
    Repairing: '#EEC84D',
    Success: '#79CA6C',
  };

  function handleChange(value) {
    let element = [];
    props.searchTag === 'All'
      ? (element = contactList[value])
      : (element = contactList.filter((item) =>
          item.status.toLowerCase().includes(props.searchTag.toLowerCase())
        )[value]);
    props.handleCallback(element.name + ',' + element.id + '!' + element.room);
    props.getAvatar(element.avatar);
    props.getStatus(status[element.status]);
    setRead(
      element.id + '!' + element.room,
      session.user._id,
      session.user.role.type
    );
    // setCurRoom()
  }

  const setRead = (room, adminId, userRole) => {
    console.log('setRead', room, adminId, userRole);
    if (adminId)
      socket.emit('setRead', {
        room: room,
        userId: adminId,
        userRole: userRole,
      });
  };

  const fetchData = async (dataRoom) => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      await axios
        .get(
          process.env.REACT_APP_API_URL +
            '/chats?room_contains=!&_sort=time:desc',
          headers
        )
        .then((res) => {
          var flags = [],
            output = [],
            l = res.data.length,
            i;
          for (i = 0; i < l; i++) {
            if (flags[res.data[i].room]) continue;
            flags[res.data[i].room] = true;
            output.push(res.data[i]);
          }
          if (dataRoom) {
            const filtered = res.data.reduce(
              (a, o) => (o.room === dataRoom && a.push(o), a),
              []
            );
            const reversed = [...filtered].reverse();
            props.handleSetMessage({
              mess: reversed,
              room: dataRoom,
            });
          }
          setData(output);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    socket.on('fetchHistory', (dataRoom) => {
      console.log('fetchHistory', dataRoom);
      fetchData(dataRoom);
    });
  }, [socket]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    Service.getAllFixing().then((report) => {
      report.data.map((data) => {
        if (data.address) {
          setContactList((lists) => [
            ...lists,
            {
              id: data._id,
              name: data.problem,
              room: data.address.address_number,
              status: data.status,
              avatar: data.image_pending[0] ? data.image_pending[0]?.url : '',
            },
          ]);
        }
      });
    });
  }, []);

  const ChatComponent = ({ item }) => {
    if (item.sender_id === session.user._id) {
      if (item.type === 'chat') {
        return item.text.length > 30
          ? 'You: ' + item.text.substring(0, 30) + '...'
          : 'You: ' + item.text;
      } else if (item.type === 'file') {
        return 'You: send a file';
      } else {
        return 'You: send a photo';
      }
    } else {
      if (item.type === 'chat') {
        return item.text.length > 30
          ? item.sender_name.split(' ')[0] +
              ': ' +
              item.text.substring(0, 30) +
              '...'
          : item.sender_name.split(' ')[0] + ': ' + item.text;
      } else if (item.type === 'file') {
        return item.sender_name.split(' ')[0] + ': send a file';
      } else {
        return item.sender_name.split(' ')[0] + ': send a photo';
      }
    }
  };

  const History = ({ item }) => {
    const read =
      item.users_read === 'unread' && item.sender_id !== session.user._id;
    return (
      <AntdList.Item
        key={item.id}
        onClick={() => {
          setRead(item.room, session.user._id, session.user.role.type);
          props.handleCallback(item.fixing_info.problem + ',' + item.room);
          props.getAvatar(
            item.fixing_info.image_pending
              ? item.fixing_info.image_pending[0]?.url
              : ''
          );
          props.getStatus(status[item.fixing_info.status]);
        }}
      >
        <ListComp
          style={{
            width: '100%',
            height: '10vh',
          }}
        >
          <Row>
            <Row
              style={{
                width: '0.4vw',
                height: '10vh',
                backgroundColor: status[item.fixing_info.status],
              }}
            />
            <Avatar
              style={{
                width: '3.2vw',
                height: '3.2vw',
                alignSelf: 'center',
                marginLeft: '0.4vw',
              }}
              src={
                item.fixing_info.image_pending[0]
                  ? process.env.REACT_APP_API_URL +
                    item.fixing_info.image_pending[0]?.url
                  : noImg
              }
            />
            <div
              style={{
                flex: 1,
              }}
            >
              <TimeText>
                {toDay ===
                format(
                  utcToZonedTime(new Date(item.time), thTimeZone),
                  'dd-MM-yyyy',
                  {
                    timeZone: 'Asia/Bangkok',
                  }
                )
                  ? format(
                      utcToZonedTime(new Date(item.time), thTimeZone),
                      'HH:mm',
                      {
                        timeZone: 'Asia/Bangkok',
                      }
                    )
                  : format(
                      utcToZonedTime(new Date(item.time), thTimeZone),
                      'dd/MM/yyyy HH:mm',
                      {
                        timeZone: 'Asia/Bangkok',
                      }
                    )}
              </TimeText>
              <Col
                style={{
                  alignSelf: 'center',
                }}
              >
                <TitleText boolRead={read}>
                  {`${
                    item.fixing_info.problem.length > 20
                      ? item.fixing_info.problem.substring(0, 20) + '...'
                      : item.fixing_info.problem
                  } (${item.room.split('!')[1]})`}
                </TitleText>
                <ChatText boolRead={read}>
                  <ChatComponent item={item} />
                </ChatText>
                {/* <ChatText>{item.users_read}</ChatText> */}
              </Col>
            </div>
          </Row>
        </ListComp>
      </AntdList.Item>
    );
  };

  return (
    <>
      <StyledList>
        <ListHeading>
          <Select
            showSearch
            style={{ width: '100%', marginBottom: 10 }}
            placeholder="Search by name or room number"
            optionFilterProp="children"
            onChange={handleChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            {props.searchTag === 'All'
              ? contactList.map((data, index) => {
                  return (
                    <Option value={index} key={index}>
                      {`${data.name} (${data.room})`}
                    </Option>
                  );
                })
              : contactList
                  .filter((item) =>
                    item.status
                      .toLowerCase()
                      .includes(props.searchTag.toLowerCase())
                  )
                  .map((data, index) => (
                    <Option value={index} key={index}>
                      {`${data.name} (${data.room})`}
                    </Option>
                  ))}
          </Select>
        </ListHeading>
        <div
          id="scrollableDiv"
          style={{
            height: '62.4vh',
            overflow: 'auto',
          }}
        >
          <InfiniteScroll
            dataLength={data.length}
            next={fetchData}
            hasMore={data.length < 0}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain>It is all, nothing more</Divider>}
            scrollableTarget="scrollableDiv"
          >
            <AntdList
              dataSource={
                props.searchTag === 'All'
                  ? data
                  : data.filter((item) =>
                      item.fixing_info.status
                        .toLowerCase()
                        .includes(props.searchTag.toLowerCase())
                    )
              }
              renderItem={(item) => <History item={item} />}
            />
          </InfiniteScroll>
        </div>
      </StyledList>
    </>
  );
}

export default List;

const StyledList = styled(AntdList)`
  flex: 0 0 35%;
  padding: 20px;

  .ant-list-item {
    padding: 0 !important;
  }

  .ant-list-split .ant-list-item {
    border-bottom: 0px;
  }

  .ant-list-item-meta-content {
    flex-grow: 0;
  }

  h4 {
    font-size: 25px;
  }

  a {
    color: #097ef0;
  }
`;
const ListComp = styled.div`
  background-color: white;

  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
const ListHeading = styled.div`
  font-size: 20px;
  font-style: SukhumvitSet;
  border-bottom: 1px solid #757591;
`;
const TitleText = styled.div`
  background-color: ${(props) => (props.boolRead ? null : null)};
  margin-left: 1vh;
  font-size: font-size: ${(props) => (props.boolRead ? '0.88vw' : '0.72vw')};
  font-style: SukhumvitSet;
  font-weight: ${(props) => (props.boolRead ? 'Bold' : null)};
  -webkit-text-stroke:${(props) => (props.boolRead ? '0.5px black' : null)};
`;
const ChatText = styled.div`
  // background-color: coral;
  margin-left: 1vh;
  font-size: ${(props) => (props.boolRead ? '0.76vw' : '0.64vw')};
  font-style: SukhumvitSet;
  font-weight: ${(props) => (props.weight ? 'Bold' : null)};
  font-weight: ${(props) => (props.boolRead ? 'Bold' : null)};
  -webkit-text-stroke: ${(props) => (props.boolRead ? '0.5px black' : null)};
  color: rgba(0, 0, 0, 0.45);
`;
const TimeText = styled.div`
  // background-color: green;
  margin: 1vh 1vh 0 1vh;
  text-align: right;
  font-size: 0.64vw;
  font-style: SukhumvitSet;
  color: rgba(0, 0, 0, 1);
`;
