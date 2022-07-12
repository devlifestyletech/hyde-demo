import React, { useState } from 'react';
import './styles/header.css';
import { Button } from 'antd';

import notiIcon from './assets/bell.svg';
import notiEmpty from './assets/bell2.svg';

function Header({ title }) {
  const [noti, setNoti] = useState(false);

  return (
    <div className="heading">
      <div className="title">
        {title}
        {noti ? (
          <Button
            className="bell"
            onClick={() => setNoti(!noti)}
            type="link"
            icon={<img src={notiIcon} alt="notification" />}
          />
        ) : (
          <Button
            className="bell"
            onClick={() => setNoti(!noti)}
            type="link"
            icon={<img src={notiEmpty} alt="notification" />}
          />
        )}
      </div>
    </div>
  );
}

export default Header;
