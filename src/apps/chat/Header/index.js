import React from "react";
import { socket } from "../../../services/web-sockets";
import styled from "styled-components";

function Header({ username, room }) {
  // console.log("userID", username);
  // const userId =joinData.userData.id;
  // const room =joinData.userData.room;

  // const onClick = () => {
  //     socket.emit("disconnect", { username, room }, (error) => { });
  // };

  const handleClick = () => {
    console.log("The link was clicked.", username, room);
    if (username && room) {
      socket.emit("disconnected", { username, room }, (error) => {
        console.log("error", error);
      });
    }
  };

  return (
    <StyledHeader>
      <OnlineStatusContainer>
        <OnlineIcon>
          <i className="fa fa-circle" aria-hidden="true"></i>
        </OnlineIcon>
        <div>Room name : {room}</div>
      </OnlineStatusContainer>
      <CloseIconContainer>
        {/* <a href="/"> */}
        <CloseIcon onClick={handleClick}>
          <i className="fa fa-times-circle" aria-hidden="true"></i>
        </CloseIcon>
        {/* </a> */}
      </CloseIconContainer>
    </StyledHeader>
  );
}

export default Header;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #D8AA81;
  border-radius: 4px 4px 0 0;
  height: 60px;
  width: 100%;
`;
const OnlineStatusContainer = styled.div`
  flex: 0.5;
  display: flex;
  align-items: center;
  margin-left: 5%;
  color: white;
`;
const CloseIconContainer = styled.div`
  margin-right: 5%;
`;

const OnlineIcon = styled.div`
  color: #11ec11;
  margin-right: 10px;
`;

const CloseIcon = styled.div`
  font-size: 20px;
  color: #fff;
`;
