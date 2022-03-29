import styled from 'styled-components';
import { Button } from 'antd';

export const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content:center;
    background: #f2f2f2;
    padding: 10px;
    margin: 100px auto;
    max-width: 80vw;
    box-shadow: 5px 10px 18px #888888;
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
    background: #FFFFFF;
`;

export const InputBar = styled.div`
    display: flex;
    align-items: center;
    border-radius: 4px 4px 0 0;
    width: 100%;
`;
export const StyledButton = styled(Button)`
height: 40px;
    background: #D8AA81;
    transition: 0.5s;
`
export const SendIcon = styled.div`
    color: #fff;
    :hover {
        color:#D8AA81;
    }
    font-size: 20px;
    :focus {
        outline: none;
    }
`;
