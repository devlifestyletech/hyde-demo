import React from 'react';
import { Button, Modal, Row, Space } from 'antd';

export default function ConfirmModal({
  values,
  onCancel,
  onConfirm,
  title,
  content,
  visible = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  return (
    <Modal
      centered
      title={title}
      visible={visible}
      className="confirmModal"
      closable={false}
      footer={null}
      width={400}
    >
      <p style={{ textAlign: 'center' }}>{content}</p>
      <Row justify="center">
        <Space size={20}>
          <Button
            type="default"
            shape="round"
            size="large"
            onClick={() => {
              onCancel();
            }}
          >
            {cancelText}
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={() => {
              onConfirm(values.qrGate, values.qrSmart);
            }}
          >
            {confirmText}
          </Button>
        </Space>
      </Row>
    </Modal>
  );
}
