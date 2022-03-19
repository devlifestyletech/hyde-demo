/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
// import styled from "styled-components";
import { socket } from "../../../../services/web-sockets";
import Header from "../../Header";
import Messages from "../../Messages";
import List from "../../List";
import { useNavigate } from "react-router-dom";
import {
    ChatContainer,
    StyledContainer,
    ChatBox,
    StyledButton,
    SendIcon,
} from "./styles";
import { Input } from "antd";

function ChatRoom(props) {
    let navigate = useNavigate();
    const { username, userId, room, joinData } = props;
    console.log("joinData", userId);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (Object.keys(joinData).length > 0) {
            setMessages([joinData]);
            socket.on("message", (message, error) => {
                setMessages((msgs) => [...msgs, message]);
            });
        } else {
            navigate("/join-room");
        }
        socket.on("roomInfo", (users) => {
            console.log("users", users);
            setUsers(users);
        });
    }, [joinData]);

    const handleChange = (e) => {
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
                    userData:joinData.userData,
                    message,
                    time:
                        new Date(Date.now()).getHours() +
                        ":" +
                        new Date(Date.now()).getMinutes(),
                },
                (error) => {
                    if (error) {
                        alert(error);
                        navigate("/join-room");
                    }
                }
            );
            setMessage("");
        } else {
            alert("Message can't be empty");
        }
    };

    return (
        <ChatContainer>
            <Header username={username} room={room} />
            <StyledContainer>
                <List users={users.users} />
                <ChatBox>
                    <Messages messages={messages} username={username} />
                    <Input
                        type="text"
                        placeholder="Type your message"
                        value={message}
                        onChange={handleChange}
                        onKeyPress={(event) => {
                            event.key === "Enter" && handleClick();
                        }}
                    />
                    <StyledButton onClick={handleClick}>
                        <SendIcon>
                            <i className="fa fa-paper-plane" />
                        </SendIcon>
                    </StyledButton>
                </ChatBox>
            </StyledContainer>
        </ChatContainer>
    );
}
export default ChatRoom;
