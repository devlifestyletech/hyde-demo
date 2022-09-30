import React from 'react';
import { Modal } from 'antd';
import RoleAccessTable from './RoleAccessTable';
import './style/main.css';

const ModalAccessInfo = ({ visible, cancelHandler, role }) => {
  return (
    <div className={'access-modal-info'}>
      <Modal
        title={'Access Information'}
        visible={visible}
        onCancel={cancelHandler}
        footer={null}
        destroyOnClose={true}
        width={1000}
      >
        <RoleAccessTable role={role} />
      </Modal>
    </div>
  );
};

export default ModalAccessInfo;
