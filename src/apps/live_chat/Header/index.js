import React from "react";
import styled from "styled-components";
import { Avatar } from "antd";
import noImg from "../../assets/images/noImg.jpg";

function Header({ avatar, username, room }) {
  console.log('avatar',avatar)
  return (
    <StyledHeader>
      {room ? (
        <>
          <HeaderContainer>
            <Avatar
              style={{
                width: "2.4vw",
                height: "2.4vw",
                margin: "0 0.4vw 0 0.4vw",
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
