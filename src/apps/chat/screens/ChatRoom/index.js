/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
// import styled from "styled-components";
import { socket } from "../../../../services/web-sockets";
import Heading from "../../../../components/Header";
import Header from "../../Header";
import Messages from "../../Messages";
import List from "../../List";
import { useNavigate } from "react-router-dom";
import {
  ChatContainer,
  StyledContainer,
  ChatBox,
  ActionIcon,
  SendIcon,
  InputBar,
} from "./styles";
import { Input } from "antd";

import axios from "axios";
import { encryptStorage } from "../../../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

function ChatRoom(props) {
  // let navigate = useNavigate();
  // const { username, userId, room, joinData } = props;
  // const chatData = { id: userId, username: username, room: room };
  console.log("session", session);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const [chatData, setChatData] = useState();
  const [contactList, setContactList] = useState([]);
  const [room, setRoom] = useState("1199/3");

  const username = session.user.fullname;
  const connectChat = () => {
    if (username && room) {
      let userId = session.user._id;
      let username = session.user.fullname;
      setChatData({ id: userId, username: username, room: room });

      socket.emit("join", { userId, username, room }, (data) => {
        console.log("JoinData", data);
      });
      if (messages.length === 0) {
        console.log("Do Fetch", messages);
        fetchData();
      }
    }
  };

  const fetchData = async () => {
    try {
      const headers = { headers: { Authorization: "Bearer " + session.jwt } };
      if (room) {
        await axios
          .get(
            process.env.REACT_APP_API_URL + "/chats?_where[room]=" + room,
            headers
          )
          .then((res) => {
            // console.log(res.data);
            // console.log(fetchData);
            res.data.map((data) => {
              // console.log("data", data.room, data.text, data.time, data.user);
              setMessages((msgs) => [
                ...msgs,
                {
                  room: data.room,
                  text: data.text,
                  time: data.time,
                  type: data.type,
                  user: data.user,
                },
              ]);
            });
            // setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoom = async () => {
    try {
      const headers = { headers: { Authorization: "Bearer " + session.jwt } };
      await axios
        .get(process.env.REACT_APP_API_URL + `/addresses`, headers)
        .then((res) => {
          // console.log(res.data);
          res.data.map((data) => {
            // console.log(data);
            let roomNumber = data.address_number;
            if (data.users.length > 0) {
              data.users.map((user) => {
                console.log(
                  user._id,
                  user.fullname,
                  roomNumber,
                  user.resident_type
                );
                setContactList((list) => [
                  ...list,
                  {
                    id: user._id,
                    room: roomNumber,
                    user:user.fullname,
                    type: user.resident_type,
                  },
                ]);
              });
            }
          });

          // setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchRoom();
    connectChat();
  }, []);

  useEffect(() => {
    socket.on("message", (newMessage, error) => {
      // console.log("newMessage-->", newMessage);
      setMessages((msgs) => [...msgs, newMessage]);
    });
  }, [socket]);

  const handleChange = (e) => {
    socket.emit("typing", {
      room: room,
      username: username,
    });
    setMessage(e.target.value);
  };

  const handleClick = (e) => {
    if (message) sendMessage(message);
  };

  const sendMessage = (message) => {
    if (message) {
      socket.emit(
        "sendMessage",
        {
          userData: chatData,
          type: "chat",
          message,
          time: new Date().toISOString(),
        },
        (error) => {
          if (error) {
            alert(error);
            // navigate("/join-room");
          }
        }
      );
      setMessage("");
    } else {
      alert("Message can't be empty");
    }
  };

  return (
    <>
      <Heading title="Chat" />
      <ChatContainer>
        <StyledContainer>
          <List />
          <ChatBox>
            <Header username={username} room={room} />
            <Messages messages={messages} username={username} />
            <InputBar>
              <ActionIcon
                onClick={() => {
                  console.log("ContactList",contactList);
                }}
              >
                <i class="fa fa-paperclip" />
              </ActionIcon>
              <ActionIcon
                onClick={() => {
                  console.log("image");
                }}
              >
                <i class="fa fa-image" />
              </ActionIcon>
              <Input
                style={{
                  borderRadius: 20,
                  width: "70%",
                  marginLeft: 10,
                  marginRight: 20,
                }}
                size="large"
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={handleChange}
                onKeyPress={(event) => {
                  event.key === "Enter" && handleClick();
                }}
              />
              {/* <StyledButton onClick={handleClick}> */}
              <SendIcon onClick={handleClick}>
                <i class="fa fa-paper-plane" />
              </SendIcon>
              {/* </StyledButton> */}
            </InputBar>
          </ChatBox>
        </StyledContainer>
      </ChatContainer>
    </>
  );
}
export default ChatRoom;
