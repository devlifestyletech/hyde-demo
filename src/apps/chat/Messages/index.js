import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Message from "./Message";
import styled from "styled-components";
import "./messageStyle.css";

import { socket } from "../../../services/web-sockets";

function Messages(props) {
    const { messages, username } = props;
    const [onTyping, setOnTyping] = useState("");
    useEffect(() => {
        socket.on("typing", (data) => {
            console.log("typing", data);
            // if (textMessage === "") setOnTyping("");
            // else
            setOnTyping(data.username + " is typing...");
            setTimeout(() => {
                setOnTyping("");
            }, 5000);
        });
    });
    return (
        <StyledMessages>
            <ScrollToBottom className="message-container">
                {messages.map((message, i) => (
                    <div key={i}>
                        <Message message={message} username={username} />
                    </div>
                ))}
                {onTyping !== "" ? <Typing>{onTyping}</Typing> : null}
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

export const Typing = styled.h6`
  text-align: start;
  margin-top: 3px;
`;
