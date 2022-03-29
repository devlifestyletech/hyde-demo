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
    StyledButton,
    SendIcon, 
    InputBar
} from "./styles";
import { Input } from "antd";

function ChatRoom(props) {
    let navigate = useNavigate();
    const { username, userId, room, joinData } = props;
    const chatData = { id: userId, username: username, room: room };
    console.log("joinData", joinData);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState([]);

    useEffect(() => {
        if (Object.keys(joinData).length > 0) {
            setMessages([joinData]);
            socket.on("message", (message, error) => {
                setMessages((msgs) => [...msgs, message]);
            });
        } else {
            navigate("/join-room");
        }
    }, [joinData]);

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
                        navigate("/join-room");
                    }
                }
            );
            setMessage("");
        } else {
            alert("Message can't be empty");
        }
    };

    return (<>
    <Heading title="Nearby Service" />
        <ChatContainer>
            <Header username={username} room={room} />
            <StyledContainer>
                <List />
                <ChatBox>
                    <Messages messages={messages} username={username} />
                    <InputBar>
                        <Input
                            size="large"
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
                        <StyledButton onClick={()=>{}}>
                            <SendIcon>
                            <i class="fa fa-image"/>
                            </SendIcon>
                        </StyledButton>
                    </InputBar>
                </ChatBox>
            </StyledContainer>
        </ChatContainer></>
    );
}
export default ChatRoom;