import React from "react";
import {
    MessagesContainer,
    MessageBox,
    MessageText,
    SentBy,
} from "./styles";
import { format, utcToZonedTime } from "date-fns-tz";

import { encryptStorage } from "../../../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");


function Message(props) {
    const thTimeZone = "Asia/Bangkok";
    const {
        username,
        message: { user, text, time },
    } = props;
    // console.log("Message", user, text);
   
    const chatTime = format(utcToZonedTime(new Date(time), thTimeZone), "HH:mm", {
        timeZone: "Asia/Bangkok",
    });
    let sentByCurrentUser = false;

    const trimmedName = session.user.fullname
    // .trim().toLowerCase();
    // console.log(user,'user VS Trim',trimmedName)

    if (user === trimmedName) {
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
                    {/* {user} */}
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
