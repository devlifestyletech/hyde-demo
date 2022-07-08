import React from 'react';
import './styles/header.css';
import { Button } from 'antd';

import notiIcon from './assets/bell.svg';
import notiEmpty from './assets/bell2.svg';

function Header({ title }) {
  let arr = ['1'];
  return (
    <div className="heading">
      <div className="title">
        {title}
        {arr.length !== 0 ? (
          <Button
            className="bell"
            type="link"
            icon={<img src={notiIcon} alt="notification" />}
          />
        ) : (
          <Button
            className="bell"
            type="link"
            icon={<img src={notiEmpty} alt="notification" />}
          />
        )}
      </div>
    </div>
  );
}

export default Header;
