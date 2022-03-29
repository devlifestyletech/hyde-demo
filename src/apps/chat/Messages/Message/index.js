import React from "react";
import {
    MessagesContainer,
    MessageBox,
    MessageText,
    SentBy,
    Typing,
} from "./styles";
import { format, utcToZonedTime } from "date-fns-tz";


function Message(props) {
    const thTimeZone = "Asia/Bangkok";
    const {
        username,
        message: { user, text, time },
    } = props;
    console.log("Message", user, text);
   
    const chatTime = format(utcToZonedTime(new Date(time), thTimeZone), "HH:mm", {
        timeZone: "Asia/Bangkok",
    });
    let sentByCurrentUser = false;

    const trimmedName = username.trim().toLowerCase();

    if (user === trimmedName) {
        sentByCurrentUser = true;
    }
    const background = sentByCurrentUser ? "blue" : "dark";
    const textPosition = sentByCurrentUser ? "end" : "start";
    const textColor = sentByCurrentUser ? "white" : "dark";
    const sentBy = sentByCurrentUser ? "right" : "left";

    return (
        <MessagesContainer textPosition={textPosition}>
            {sentBy === "right" ? (
                <SentBy sentBy={sentBy}>
                    {user}
                    <br />
                    {chatTime}
                </SentBy>
            ) : null}
            <MessageBox background={background}>
                <MessageText color={textColor}>{text}</MessageText>
            </MessageBox>
            {sentBy === "left" ? (
                <SentBy sentBy={sentBy}>
                    {user}
                    <br />
                    {chatTime}
                </SentBy>
            ) : null}
        </MessagesContainer>
    );
}

export default Message;
