/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
// import styled from "styled-components";
import { socket } from '../../../../services/webSocketService';
import Heading from '../../../../components/Header';
import Header from '../../Header';
import Messages from '../../../../components/Messages';
import List from '../../List';
import ReportDetail from '../Report';
import {
  ChatContainer,
  StyledContainer,
  ChatBox,
  ActionIcon,
  SendIcon,
  InputBar,
} from './styles';
import { Input, Spin, Tabs, Row } from 'antd';

import axios from 'axios';
import { encryptStorage } from '../../../../utils/encryptStorage';

function ChatRoom(props) {
  const session = encryptStorage.getItem('user_session');
  const allInput = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const [chatData, setChatData] = useState();
  const [room, setRoom] = useState('');
  const [receiver, setReceiver] = useState();
  const [loading, setLoading] = useState(false);
  const [onSend, setOnSend] = useState(false);
  const [imageFile, setImageFile] = useState();
  const [userAvatar, setUserAvatar] = useState('');
  const [fixingStatus, setFixingStatus] = useState('');
  const [fixingReportId, setFixingReportId] = useState('');
  const [searchTag, setSearchTag] = useState('All');
  const sender_name = session.user.fullname;
  const headers = { headers: { Authorization: 'Bearer ' + session.jwt } };

  const types = ['All', 'Pending', 'Repairing', 'Success'];
  const { TabPane } = Tabs;

  const connectChat = () => {
    if (sender_name && room) {
      let sender_id = session.user._id;
      let sender_name = session.user.fullname;
      let sender_role = session.user.role.type;
      console.log('Role', session.user.role.type);
      setChatData({
        sender_id: sender_id,
        sender_name: sender_name,
        sender_role: sender_role,
        room: room,
      });

      socket.emit('join', { sender_id, sender_name, room }, (data) => {
        console.log('JoinData', data);
      });
      if (messages.length === 0) {
        // setLoading(true);
        // fetchData();
      }
    }
  };

  const fetchData = async () => {
    try {
      if (room) {
        await axios
          .get(
            process.env.REACT_APP_API_URL +
              `/chats?_where[room]=${room}&_sort=time`,
            headers
          )
          .then((res) => {
            res.data.map((data) => {
              setMessages((msgs) => [
                ...msgs,
                {
                  room: data.room,
                  text: data.text,
                  time: data.time,
                  type: data.type,
                  sender_id: data.sender_id,
                  sender_name: data.sender_name,
                  users_read: data.users_read,
                },
              ]);
            });
            // setMessages(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    connectChat();
    socket.off('message');
  }, [room]);

  useEffect(() => {
    socket.on('message', (newMessage) => {
      if (newMessage.room === room) {
        console.log('newMessage', newMessage);
        setMessages((msgs) => [...msgs, newMessage]);
      }
    });
  }, [socket, room]);

  const handleCallback = (childData) => {
    if (room !== childData.split(',')[1]) {
      setMessages([]);
      setRoom(childData.split(',')[1]);
      setReceiver(childData.split(',')[0]);
      setFixingReportId(childData.split(',')[1].split('!')[0]);
    }
  };
  const handleSetMessage = (data) => {
    console.log('room', room);
    console.log('data', data);
    setMessages(data.mess);
  };

  const getAvatar = (avatar) => {
    setUserAvatar(avatar);
  };
  const getStatus = (status) => {
    setFixingStatus(status);
  };

  const handleChange = (e) => {
    socket.emit('typing', {
      room: room,
      sender_name: sender_name,
    });
    setMessage(e.target.value);
  };

  const handleClick = (e) => {
    console.log('RoomSend', room);
    if (room !== '') {
      if (message) sendMessage(message);
    } else {
      alert('Please select room to connect');
    }
  };

  const deleteHandle = () => {
    setImageFile(null);
  };

  const selectHandle = (e) => {
    setImageFile(e.target.files[0]);
  };

  useEffect(() => {
    if (imageFile) uploadImg();
  }, [imageFile]);

  const handleClickOutside = (e) => {
    if (!allInput.current.contains(e.target)) {
      console.log('Click outside.', room);
    } else {
      console.log('RoomInside', room);
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside, true);
    return () => {
      document.body.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const uploadImg = async () => {
    setOnSend(true);
    let dataImage = new FormData();
    dataImage.append('files', imageFile);
    await axios
      .post(process.env.REACT_APP_API_URL + '/upload/', dataImage, headers)
      .then((res) => {
        let imageUrl = res.data[0].url;
        imageFile.type.split('/')[0] === 'image'
          ? socket.emit(
              'sendMessage',
              {
                userData: chatData,
                type: 'image',
                message: imageUrl,
                time: new Date().toISOString(),
              },
              (error) => {
                if (error) {
                  alert(error);
                }
              }
            )
          : socket.emit(
              'sendMessage',
              {
                userData: chatData,
                type: 'file',
                message: imageUrl,
                time: new Date().toISOString(),
              },
              (error) => {
                if (error) {
                  alert(error);
                }
              }
            );
        deleteHandle();
        setOnSend(false);
      })
      .catch((err) => {
        setOnSend(false);
        deleteHandle();
        console.error("Can't add data: ", err);
      });
  };

  const sendMessage = (message) => {
    if (message) {
      socket.emit(
        'sendMessage',
        {
          userData: chatData,
          type: 'chat',
          message,
          time: new Date().toISOString(),
        },
        (error) => {
          if (error) {
            alert(error);
          }
        }
      );
      setMessage('');
    } else {
      alert("Message can't be empty");
    }
  };

  const callback = (key) => {
    // console.log(types[parseInt(key)]);
    setSearchTag(types[parseInt(key)]);
  };

  const Loading = () => {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          textAlign: 'center',
          paddingTop: '24vh',
        }}
      >
        <Spin size="large" />
        <p style={{ color: '#20263A', fontSize: 30 }}>Loading...</p>
      </div>
    );
  };

  return (
    <>
      <Heading title="Messages" />
      <div className="regis-table">
        <Tabs defaultActiveKey="All Service" onChange={callback}>
          {types.map((type, index) => (
            <TabPane tab={type} key={index} />
          ))}
        </Tabs>
      </div>
      <Row>
        <ChatContainer>
          <StyledContainer>
            <List
              handleSetMessage={handleSetMessage}
              handleCallback={handleCallback}
              getAvatar={getAvatar}
              getStatus={getStatus}
              searchTag={searchTag}
            />
            <ChatBox ref={allInput}>
              <Header
                avatar={userAvatar}
                status={fixingStatus}
                username={receiver}
                room={room}
              />
              {loading ? (
                <Loading />
              ) : (
                <Messages
                  room={room}
                  messages={messages}
                  userId={session.user._id}
                  userRole={session.user.role.type}
                />
              )}
              <InputBar>
                {room !== '' && !onSend ? (
                  <>
                    <label htmlFor="inputFile">
                      <ActionIcon>
                        <i className="fa fa-paperclip" />
                      </ActionIcon>
                    </label>
                    <label htmlFor="inputImg">
                      <ActionIcon>
                        <i className="fa fa-image" />
                      </ActionIcon>
                    </label>
                  </>
                ) : (
                  <>
                    <ActionIcon
                      onClick={() => {
                        alert('Please select room to connect');
                      }}
                    >
                      <i className="fa fa-paperclip" />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => {
                        alert('Please select room to connect');
                      }}
                    >
                      <i className="fa fa-image" />
                    </ActionIcon>
                  </>
                )}
                <input
                  type="file"
                  id="inputImg"
                  accept="image/*"
                  onChange={(event) => {
                    if (room !== '' && !onSend) {
                      selectHandle(event);
                    }
                  }}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{ display: 'none' }}
                />
                <input
                  type="file"
                  id="inputFile"
                  accept="*"
                  onChange={(event) => {
                    if (room !== '' && !onSend) {
                      selectHandle(event);
                    }
                  }}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{ display: 'none' }}
                />
                <Input
                  style={{
                    borderRadius: 20,
                    width: '80%',
                    marginLeft: 10,
                    marginRight: 20,
                  }}
                  size="large"
                  type="text"
                  placeholder="Type your message"
                  value={message}
                  onChange={handleChange}
                  onKeyPress={(event) => {
                    event.key === 'Enter' && handleClick();
                  }}
                />
                {!onSend ? (
                  <SendIcon onClick={handleClick}>
                    <i className="fa fa-paper-plane" />
                  </SendIcon>
                ) : (
                  <Spin size="small" />
                )}
              </InputBar>
            </ChatBox>
          </StyledContainer>
        </ChatContainer>
        <ReportDetail reportId={fixingReportId} status={fixingStatus} />
      </Row>
    </>
  );
}

export default ChatRoom;
