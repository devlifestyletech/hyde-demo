import React from 'react';
import { Spin } from 'antd';
function Loading() {
	return (
		<div style={{ backgroundColor: 'rgba(32, 38, 58, 1)', width: '100vw', height: '100vh', textAlign: 'center', paddingTop: 300 }}>
			<Spin size='large' />
			<p style={{ color: 'white', fontSize: 30 }}>Please wait...</p>
		</div>
	);
}

export default Loading;
