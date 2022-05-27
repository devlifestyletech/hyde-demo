import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';
import styled from 'styled-components';
import './messageStyle.css';

import { socket } from '../../../services/web-sockets';

function Messages(props) {
	const { messages, room } = props;
	const [onTyping, setOnTyping] = useState('');

	// useEffect(() => {
	socket.on('typing', (data) => {
		// console.log("typing", data, room);
		if (data.room === room) {
			setOnTyping(data.sender_name + ' is typing...');
			setTimeout(() => {
				setOnTyping('');
			}, 5000);
		}
	});
	// }, [messages]);

	return (
		<StyledMessages>
			<ScrollToBottom className='message-container'>
				{messages.map((message, i) => (
					<div key={i}>
						<Message message={message} />
					</div>
				))}
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
