import React from "react";
import styled from "styled-components";
import { Avatar } from "antd";
import noImg from "../../assets/images/noImg.jpg";

function Header({ avatar, username, room, handleDisconnect }) {
  console.log("avatar", avatar);
  return (
    <StyledHeader>
      {room ? (
        <>
          <OnlineStatusContainer>
            <Avatar
              size={40}
              style={{ margin: "10px 10px 10px 0px" }}
              src={avatar ? process.env.REACT_APP_API_URL + avatar.url : noImg}
            />
            <div>
              {username} (
              {room.includes(":") ? room.split(":")[1] : room.split("!")[1]})
            </div>
          </OnlineStatusContainer>
          <CloseIconContainer>
            <CloseIcon onClick={handleDisconnect}>
              <i className="fa fa-times-circle" aria-hidden="true"></i>
            </CloseIcon>
          </CloseIconContainer>
        </>
      ) : (
        <OnlineStatusContainer>
          <div>No room selected</div>
        </OnlineStatusContainer>
      )}
    </StyledHeader>
  );
}

export default Header;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  // background: #d8aa81;
  background: white;
  border-radius: 0px 20px 0 0;
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #757591;
`;
const OnlineStatusContainer = styled.div`
  flex: 0.5;
  display: flex;
  align-items: center;
  margin-left: 5%;
  color: black;
  font-weight: bold;
  font-size: 1.2rem;
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
  color: #757591;
`;
