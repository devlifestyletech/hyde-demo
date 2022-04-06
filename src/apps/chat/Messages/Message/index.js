import React from "react";
import { MessagesContainer, MessageBox, MessageText, SentBy } from "./styles";
import { format, utcToZonedTime } from "date-fns-tz";
import { Image, Card } from "antd";

import { encryptStorage } from "../../../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

function Message(props) {
    const thTimeZone = "Asia/Bangkok";
    const {
        message: { sender_id, type, sender_name, text, time },
    } = props;
    console.log("Message", type, sender_id, sender_name, text, time);

    const chatTime = format(utcToZonedTime(new Date(time), thTimeZone), "HH:mm", {
        timeZone: "Asia/Bangkok",
    });
    let sentByCurrentUser = false;

    const adminId = session.user._id;
    // .trim().toLowerCase();
    // console.log(user,'user VS Trim',trimmedName)

    if (sender_id === adminId) {
        sentByCurrentUser = true;
    }
    const background = sentByCurrentUser ? "color" : "dark";
    const textPosition = sentByCurrentUser ? "end" : "start";
    const textColor = sentByCurrentUser ? "dark" : "dark";
    const sentBy = sentByCurrentUser ? "right" : "left";

    function ImageDemo() {
        return (
            <Image
                width={200}
                src={process.env.REACT_APP_API_URL + text}
                preview={{
                    src: process.env.REACT_APP_API_URL + text,
                }}
            />
        );
    }

    return (
        <MessagesContainer textPosition={textPosition}>
            {sentBy === "right" ? (
                <SentBy sentBy={sentBy}>
                    <br />
                    {chatTime}
                </SentBy>
            ) : null}
            {type === "chat" ? (
                <MessageBox background={background}>
                    <MessageText color={textColor}>{text}</MessageText>
                </MessageBox>
            ) : (
                // <div style={{ overflow: "hidden", maxHeight: "10%", maxWidth: "40%" }}>
                //     <Image
                //         alt="example"
                //         // style={{ height: "100%" }}
                //         src={process.env.REACT_APP_API_URL + text}
                //         preview={{
                //             src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                //         }}
                //     />
                // </div>
                <ImageDemo />
            )}
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
