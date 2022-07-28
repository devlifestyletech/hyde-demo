import React, { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';
import styled from 'styled-components';
import './messageStyle.css';
import { format, utcToZonedTime } from 'date-fns-tz';
import moment from 'moment';

import { socket } from '../../services/webSocketService';

function Messages(props) {
  const thTimeZone = 'Asia/Bangkok';
  const { messages, room } = props;
  const [onTyping, setOnTyping] = useState('');
  const [reduceMess, setReduceMess] = useState();

  socket.on('typing', (data) => {
    if (data.room === room) {
      setOnTyping(data.sender_name + ' is typing...');
      setTimeout(() => {
        setOnTyping('');
      }, 5000);
    }
  });

  function timeFormat(date) {
    let today = moment().isSame(date, 'days');
    // console.log('today',today);
    return !today
      ? format(utcToZonedTime(new Date(date), thTimeZone), 'dd/MMM/yyyy', {
          timeZone: 'Asia/Bangkok',
        })
      : 'Today';
  }

  useEffect(() => {
    console.log('messages', messages);

    let mess = messages.reduce(
      (prev, cur) => ({
        ...prev,
        [timeFormat(cur.time)]: (prev[timeFormat(cur.time)] || []).concat(cur),
      }),
      {}
    );
    setReduceMess(mess);
  }, [messages]);

  useEffect(() => {
    // console.log('Mess: ', reduceMess);
    if (reduceMess) {
      Object.keys(reduceMess).map((item, index) =>
        console.log('reduceMess: ', item, [reduceMess[item]])
      );
    }
  }, [reduceMess]);

  return (
    <StyledMessages>
      <ScrollToBottom className="message-container">
        {reduceMess
          ? Object.keys(reduceMess).map((item, index) => (
              <>
                <div className="date-container" key={index}>
                  {item}
                </div>
                {reduceMess[item].map((message, i) => (
                  <div key={i}>
                    <Message message={message} />
                  </div>
                ))}
              </>
            ))
          : null}

        {onTyping !== '' ? (
          <MessagesContainer>
            <Typing>{onTyping}</Typing>
          </MessagesContainer>
        ) : null}
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

export const MessagesContainer = styled.div`
  display: flex;
  padding: 0 5%;
  margin-top: 12px;
  justify-content: flex-start;
`;

export const Typing = styled.p`
  text-align: start;
  font-size: 1.1em;
  word-wrap: break-word;
  color: #353535;
  margin: 0;
`;
