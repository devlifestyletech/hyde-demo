import styled from "styled-components";
import { Button } from "antd";

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #f2f2f2;
  // padding: 10px 0px 0px 10px;
  margin: 1vh auto;
  max-width: 80vw;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  height: 80vh;
  border-radius: 20px;
`;

export const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  border-radius: 8px;
  height: 60%;
  justify-content: space-between;
`;

export const ChatBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
`;

export const InputBar = styled.div`
  height: 45px;
  display: flex;
  align-items: center;
  border-radius: 0px 0px 20px 0px;
  width: 100%;
  background: #d3d3d3;
  justify-content: center;
`;
export const StyledButton = styled(Button)`
  height: 40px;
  background: #d8aa81;
  transition: 0.5s;
  margin: 4px;
`;
export const SendIcon = styled.div`
  color: #fff;
  :hover {
    color: #d8aa81;
  }
  font-size: 28px;
  :focus {
    outline: none;
  }
`;
export const ActionIcon = styled.div`
  color: #fff;
  :hover {
    color: #d8aa81;
  }
  font-size: 24px;
  margin-right: 10px;
  :focus {
    outline: none;
  }
`;
