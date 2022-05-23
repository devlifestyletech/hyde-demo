import styled from "styled-components";

export const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex:0.4;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  height: 70vh;
  border-radius: 20px;
`;

export const StyledContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 60%;
`;

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 20px 20px 0 0;
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #757591;
`;
export const ReportImg = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 90%;
  max-height: 40%;
`

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
export const ProblemContainer = styled.div`
margin-left: 0.4vw;
  flex: 1;
  display: flex;
  // align-items: center;
  // justify-content: center;
  color: black;
  font-weight: bold;
  font-size: 1.2rem;
`;
export const DetailContainer = styled.div`
margin-left: 0.4vw;
  display: flex;
  // align-items: center;
  // justify-content: center;
  color: rgba(0, 0, 0, 1);
  font-family: SukhumvitSet-Thin;
  font-size: 1rem;
  // background-color: #d8aa81;
`;

export const ReportCenter = styled.div`
display: flex;
justify-content: center;
align-items: center;
margin-top:2vh;
`;