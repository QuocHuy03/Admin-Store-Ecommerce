import React from "react";
import { Modal } from "antd";

export default function ModalForm({
  title,
  isOpenModal,
  children,
  footer,
  onClose,
}) {
  if (!isOpenModal) {
    return null;
  }
  const hideModal = () => {
    onClose(false);
  };

  return (
    <Modal
      title={title}
      open={isOpenModal}
      onOk={hideModal}
      onCancel={hideModal}
      footer={footer}
      width={700}
    >
      {children}
    </Modal>
  );
}
