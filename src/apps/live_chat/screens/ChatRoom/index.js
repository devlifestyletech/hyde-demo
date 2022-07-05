/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
// import styled from "styled-components";
import { socket } from '../../../../services/web-sockets';
import Heading from '../../../../components/header';
import Header from '../../Header';
import Messages from '../../../../components/Messages';
import List from '../../List';
import {
  ActionIcon,
  ChatBox,
  ChatContainer,
  InputBar,
  SendIcon,
  StyledContainer,
  TextInput,
} from './styles';
import { Spin } from 'antd';

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
  const sender_name = session.user.fullname;
  const headers = { headers: { Authorization: 'Bearer ' + session.jwt } };
  console.log(session.jwt);

  const connectChat = () => {
    if (sender_name && room) {
      let sender_id = session?.user?._id;
      let sender_name = session?.user?.fullname;
      setChatData({
        sender_id: sender_id,
        sender_name: sender_name,
        room: room,
      });

      socket.emit('join', { sender_id, sender_name, room }, (data) => {
        console.log('JoinData', data);
      });
      if (messages.length === 0) {
        // console.log("Do Fetch", messages);
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
              // console.log("data", data.room, data.text, data.time, data.user);
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
    console.log('room', childData.split(',')[1]);
    if (room !== childData.split(',')[1]) {
      setMessages([]);
      setRoom(childData.split(',')[1]);
      setReceiver(childData.split(',')[0]);
    }
  };
  const getAvatar = (avatar) => {
    console.log('avatarDx', avatar);
    setUserAvatar(avatar);
  };

  const handleDisconnect = () => {
    setMessages([]);
    setRoom('');
  };
  useEffect(() => {
    socket.off('message');
  }, [room]);

  useEffect(() => {
    // console.log("Socket-->", room);
    socket.on('message', (newMessage, error) => {
      // console.log("newMessage-->", newMessage.room, room);
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
  const handleInputFocus = () => {
    console.log('FoCUS');
  };

  const handleClick = (e) => {
    if (room !== '') {
      if (message) sendMessage(message);
    } else {
      // console.log('Please select room to connect')
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
        console.log('type', imageFile.type.split('/')[0]);

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

  const Loading = () => {
    return (
      <div
        style={{
          height: '100vh',
          textAlign: 'center',
          paddingTop: 300,
        }}
      >
        <Spin size="large" />
        <p style={{ color: '#20263A', fontSize: 30 }}>Loading...</p>
      </div>
    );
  };

  return (
    <>
      <Heading title="Live Chat" />
      <ChatContainer>
        <StyledContainer>
          <List handleCallback={handleCallback} getAvatar={getAvatar} />
          <ChatBox>
            <Header
              avatar={userAvatar}
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
              <TextInput
                placeholder={room!==''?"Type your message":"Please select room to connect"}
                value={message}
                onChange={handleChange}
                onFocus={handleInputFocus}
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
    </>
  );
}

export default ChatRoom;
