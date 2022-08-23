import React from 'react';
import {
  MessagesContainer,
  MessageBox,
  MessageText,
  LinkText,
  SentBy,
} from './styles';
import { format, utcToZonedTime } from 'date-fns-tz';
import { Image } from 'antd';

import { encryptStorage } from '../../../utils/encryptStorage';
const session = encryptStorage.getItem('user_session');

function Message(props) {
  const thTimeZone = 'Asia/Bangkok';
  const {
    message: { sender_id, type, sender_name, text, time, users_read },
  } = props;

  const chatTime = format(utcToZonedTime(new Date(time), thTimeZone), 'HH:mm', {
    timeZone: 'Asia/Bangkok',
  });
  let sentByCurrentUser = false;

  const adminId = session.user._id;

  if (sender_id === adminId) {
    sentByCurrentUser = true;
  }
  const background = sentByCurrentUser ? 'color' : 'dark';
  const textPosition = sentByCurrentUser ? 'end' : 'start';
  const textColor = sentByCurrentUser ? 'dark' : 'dark';
  const sentBy = sentByCurrentUser ? 'right' : 'left';

  function ImageDemo() {
    return (
      <Image
        style={{ borderRadius: 10 }}
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
      {sentBy === 'right' ? (
        <SentBy sentBy={sentBy}>
          <br />
          {chatTime}
        </SentBy>
      ) : null}
      {type === 'image' ? (
        <ImageDemo />
      ) : type === 'chat' ? (
        <MessageBox background={background}>
          <MessageText color={textColor}>{text}</MessageText>
        </MessageBox>
      ) : (
        <MessageBox background={background}>
          <a
            href={process.env.REACT_APP_API_URL + text}
            color={textColor}
            target="_blank"
            download
            rel="noreferrer"
          >
            <LinkText color={textColor}>{text.split('/')[2]}</LinkText>
          </a>
        </MessageBox>
      )}

      {sentBy === 'left' ? (
        <SentBy sentBy={sentBy}>
          {users_read === 'unread' ? sender_name : sender_name + ' ✔'}
          <br />
          {chatTime}
        </SentBy>
      ) : null}
    </MessagesContainer>
  );
}

export default Message;
