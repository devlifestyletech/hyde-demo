import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Message from "./Message";
import styled from "styled-components";
import "./messageStyle.css"

function Messages(props) {
    const { messages, username } = props;
    return (
        <StyledMessages>
            <ScrollToBottom className="message-container">
                {messages.map((message, i) => (
                    <div key={i}>
                        <Message message={message} username={username} />
                    </div>
                ))}
            </ScrollToBottom>
        </StyledMessages>
    );
}
export default Messages;
const StyledMessages = styled.div`
  padding: 5% 0;
  overflow: auto;
  flex: auto;
`;
 