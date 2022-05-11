import React from "react";
import styled from "styled-components";
import { Avatar, Row } from "antd";
import noImg from "../../assets/images/noImg.jpg";

function Header({ avatar, username, room, status, handleDisconnect }) {
  console.log("avatar status", status);
  return (
    <StyledHeader>
      {room ? (
        <>
          <HeaderContainer>
            {status ? (
              <Row
                style={{
                  width: "0.4vw",
                  height: "60px",
                  marginRight: "0.4vw",
                  backgroundColor: status,
                }}
              />
            ) : null}
            <Avatar
              style={{
                width: "2.4vw",
                height: "2.4vw",
                margin: "10px 10px 10px 0px",
              }}
              src={avatar!=="" ? process.env.REACT_APP_API_URL + avatar : noImg}
            />
            <div>
              {username} (
              {room.includes(":") ? room.split(":")[1] : room.split("!")[1]})
            </div>
          </HeaderContainer>
        </>
      ) : (
        <HeaderContainer>
          <div
            style={{
              marginLeft: "0.4vw",
            }}
          >
            No room selected
          </div>
        </HeaderContainer>
      )}
    </StyledHeader>
  );
}

export default Header;

const StyledHeader = styled.div`
  background-color: white;
  display: flex;
  // align-items: center;
  // justify-content: space-between;
  border-radius: 0px 20px 0 0;
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #757591;
`;
const HeaderContainer = styled.div`
  // background-color: red;
  flex: 1;
  display: flex;
  align-items: center;
  color: black;
  font-weight: bold;
  font-size: 1.2rem;
`;
