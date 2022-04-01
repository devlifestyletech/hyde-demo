import React from "react";
import styled from "styled-components";

function Header({ room, handleDisconnect }) {

  return (
    <StyledHeader>
      {room ? (
        <>
          <OnlineStatusContainer>
            <OnlineIcon>
              <i className="fa fa-circle" aria-hidden="true"></i>
            </OnlineIcon>
            <div>Room name : {room}</div>
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
  background: #d8aa81;
  border-radius: 0px 20px 0 0;
  height: 60px;
  width: 100%;
`;
const OnlineStatusContainer = styled.div`
  flex: 0.5;
  display: flex;
  align-items: center;
  margin-left: 5%;
  color: black;
  font-weight:bold;
  font-size:1.2rem;
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
