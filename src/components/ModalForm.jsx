import React from "react";
import { Modal } from "antd";

export default function ModalForm({
  closeIcon,
  maskClosable,
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
      closeIcon={closeIcon}
      maskClosable={maskClosable}
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
