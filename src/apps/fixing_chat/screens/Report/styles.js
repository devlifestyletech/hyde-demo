import styled from "styled-components";
import { Button } from "antd";

export const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  // background: #f2f2f2;
  // padding: 10px 0px 0px 10px;
  // margin: 1vh auto;
  // width: 24%;
  flex:0.4;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  height: 70vh;
  border-radius: 20px;
`;

export const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  height: 60%;
  // background-color: #d8aa81;
`;

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  // background: #d8aa81;
  background: white;
  border-radius: 20px 20px 0 0;
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #757591;
`;

export const HeaderContainer = styled.div`
  margin-left: 0.4vw;
  flex: 1;
  display: flex;
  align-items: center;
  color: black;
  font-weight: bold;
  font-size: 1.2rem;
`;
export const NoContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-weight: bold;
  font-size: 1.2rem;
`;
