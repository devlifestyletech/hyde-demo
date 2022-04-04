import React from "react";
import { MessagesContainer, MessageBox, MessageText, SentBy } from "./styles";
import { format, utcToZonedTime } from "date-fns-tz";

import { encryptStorage } from "../../../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

function Message(props) {
    const thTimeZone = "Asia/Bangkok";
    const {
        message: { sender_id, sender_name, text, time },
    } = props;
    // console.log("Message", sender_id, sender_name, text, time);

    const chatTime = format(utcToZonedTime(new Date(time), thTimeZone), "HH:mm", {
        timeZone: "Asia/Bangkok",
    });
    let sentByCurrentUser = false;

    const trimmedId = session.user._id;
    // .trim().toLowerCase();
    // console.log(user,'user VS Trim',trimmedName)

    if (sender_id === trimmedId) {
        sentByCurrentUser = true;
    }
    const background = sentByCurrentUser ? "color" : "dark";
    const textPosition = sentByCurrentUser ? "end" : "start";
    const textColor = sentByCurrentUser ? "dark" : "dark";
    const sentBy = sentByCurrentUser ? "right" : "left";

    return (
        <MessagesContainer textPosition={textPosition}>
            {sentBy === "right" ? (
                <SentBy sentBy={sentBy}>
                    <br />
                    {chatTime}
                </SentBy>
            ) : null}
            <MessageBox background={background}>
                <MessageText color={textColor}>{text}</MessageText>
            </MessageBox>
            {sentBy === "left" ? (
                <SentBy sentBy={sentBy}>
                    {sender_name}
                    <br />
                    {chatTime}
                </SentBy>
            ) : null}
        </MessagesContainer>
    );
}

export default Message;
