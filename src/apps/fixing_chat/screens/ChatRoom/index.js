/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
// import styled from "styled-components";
import { socket } from '../../../../services/web-sockets';
import Heading from '../../../../components/header';
import Header from '../../Header';
import Messages from '../../Messages';
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
const session = encryptStorage.getItem('user_session');

function ChatRoom(props) {
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
      setChatData({
        sender_id: sender_id,
        sender_name: sender_name,
        room: room,
      });

      socket.emit('join', { sender_id, sender_name, room }, (data) => {
        console.log('JoinData', data);
      });
      if (messages.length === 0) {
        setLoading(true);
        fetchData();
      }
    }
  };

  const fetchData = async () => {
    try {
      if (room) {
        await axios
          .get(
            process.env.REACT_APP_API_URL + '/chats?_where[room]=' + room,
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
                },
              ]);
            });
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
  }, [room]);

  const handleCallback = (childData) => {
    console.log('ReportId', childData.split(',')[1].split('!')[0]);
    if (room !== childData.split(',')[1]) {
      setMessages([]);
      setRoom(childData.split(',')[1]);
      setReceiver(childData.split(',')[0]);
      setFixingReportId(childData.split(',')[1].split('!')[0]);
    }
  };

  const getAvatar = (avatar) => {
    console.log('room', avatar);
    setUserAvatar(avatar);
  };
  const getStatus = (status) => {
    console.log('status', status);
    setFixingStatus(status);
  };

  const handleDisconnect = () => {
    setMessages([]);
    setRoom('');
  };

  useEffect(() => {
    socket.off('message');
  }, [room]);

  useEffect(() => {
    socket.on('message', (newMessage, error) => {
      if (newMessage.room === room) {
        setMessages((msgs) => [...msgs, newMessage]);
      }
    });
  }, [socket, room]);

  const handleChange = (e) => {
    socket.emit('typing', {
      room: room,
      sender_name: sender_name,
    });
    setMessage(e.target.value);
  };

  const handleClick = (e) => {
    if (room !== '') {
      if (message) sendMessage(message);
    } else {
      alert('Please select room to connect');
    }
  };

  const deleteHandle = () => {
    // setPickedImage(null);
    setImageFile(null);
  };

  const selectHandle = (e) => {
    setImageFile(e.target.files[0]);
  };

  useEffect(() => {
    if (imageFile) uploadImg();
  }, [imageFile]);

  const uploadImg = async () => {
    setOnSend(true);
    console.log('imageFile', imageFile);
    let dataImage = new FormData();
    dataImage.append('files', imageFile);
    await axios
      .post(process.env.REACT_APP_API_URL + '/upload/', dataImage, headers)
      .then((res) => {
        console.log('res Upload', res.data[0].url);
        let imageUrl = res.data[0].url;
        console.log('type',imageFile.type.split('/')[0])

        imageFile.type.split('/')[0]==='image'?
        socket.emit(
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
        ):socket.emit(
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
        )
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
    console.log(types[parseInt(key)]);
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
              handleCallback={handleCallback}
              getAvatar={getAvatar}
              getStatus={getStatus}
              searchTag={searchTag}
            />
            <ChatBox>
              <Header
                avatar={userAvatar}
                status={fixingStatus}
                username={receiver}
                room={room}
                handleDisconnect={handleDisconnect}
              />
              {loading ? (
                <Loading />
              ) : (
                <Messages room={room} messages={messages} />
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
