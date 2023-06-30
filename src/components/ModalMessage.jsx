import { Modal } from "antd";
import React from "react";

export default function ModalMessage({
  title,
  openModal,
  onSubmitOk,
  footer,
  onClose,
  children,
}) {
  if (!openModal) {
    return null;
  }
  const hideModal = () => {
    onClose(false);
  };
  return (
    <Modal
      title={title}
      open={openModal}
      onOk={onSubmitOk}
      onCancel={hideModal}
      footer={footer}
      width={700}
    >
      {children}
    </Modal>
  );
}
