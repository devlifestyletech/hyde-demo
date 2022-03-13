/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styled from "styled-components";
import { Input, Card, Button } from "antd";
import { socket } from "../../../services/web-sockets";
import ChatRoom from "./ChatRoom/index";
// react router
import { useNavigate } from "react-router-dom";
function JoinRoom(props) {
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [error, setError] = useState("");

    const [userId, setUserId] = useState("");
    const [joinData, setJoinData] = useState({});
    const [chatState, setChatState] = useState(false);
    const onUsernameChange = (e) => {
        const inputValue = e.target.value;
        setUsername(inputValue);
    };

    function onJoinSuccess(data) {
        setJoinData(data);
        setUsername(data.userData.username);
        setUserId(data.userData.id);
        setRoom(data.userData.room);
        setChatState(true);
        // navigate(`/chat-room/${data.userData.room}`, {
        //     username: username,
        //     userId: userId,
        //     room: room,
        //     joinData: joinData,
        // });
    }
    const onRoomChange = (e) => {
        const roomNo = e.target.value;
        setRoom(roomNo);
    };
    const onClick = () => {
        if (username && room) {
            socket.emit("join", { username, room }, (error) => {
                if (error) {
                    setError(error);
                    alert(error);
                } else {
                    socket.on("welcome", (data) => {
                        onJoinSuccess(data);
                    });
                }
            });
        }
    };

    socket.on("welcome", (data) => {
        console.log("Welcome event inside JoinRoom", data);
        onJoinSuccess(data);
    });

    return (
        <>
            {chatState ? (
                <ChatRoom
                    username={username}
                    userId={userId}
                    room={room}
                    joinData={joinData}
                />
            ) : (
                <StyledCard>
                    <label htmlFor="username">
                        Enter your name
                        <Input
                            name="username"
                            placeholder="Enter your username"
                            maxLength={25}
                            value={username}
                            onChange={onUsernameChange}
                        />
                    </label>
                    <label htmlFor="room">
                        Enter room number of your choice
                        <Input
                            name="room"
                            placeholder="Enter your room number"
                            maxLength={25}
                            value={room}
                            onChange={onRoomChange}
                        />
                    </label>
                    <StyledButton type="primary" size={"large"} onClick={onClick}>
                        Join the Chat Room
                    </StyledButton>
                </StyledCard>
            )}
        </>
    );
}

export default JoinRoom;

const StyledCard = styled(Card)`
  width: 581px;
  height: 210px;
  margin: 30vh auto;
  box-shadow: 2px 3px 3px 2.8px #d7d7e4;
  text-align: center;
`;
const StyledButton = styled(Button)`
  margin-top: 10px;
`;
