import React from 'react';
import Header from '../../../components/header';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import '../styles/main.css';

function JuristicManage() {
  return (
    <React.Fragment>
      <Header title="Juristic Management" />
      <div class="container">
        <Button
          icon={<PlusOutlined />}
          type="primary"
          size="large"
          shape="round"
          className="create_btn"
        >
          Create New
        </Button>
      </div>
    </React.Fragment>
  );
}

export default JuristicManage;
