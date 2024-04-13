import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalProps } from '@nextui-org/react';

import './drawerStyle.css';

type SubComponents = {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

type Props = Omit<
  ModalProps,
  'className' | 'fullScreen' | 'closeButton' | 'animated' | 'blur'
>;

export const Drawer: React.FC<Props&{open:boolean}> & SubComponents = ({ children, ...props }) => {
  const { open } = props;

  return (
    <Modal
      className={`drawer drawer-animated ${
        open ? 'drawer-animated-slide-in' : ''
      }`}
      closeButton
      animated={false}
      {...props}
    >
      {children}
    </Modal>
  );
};

Drawer.Header = ModalHeader;
Drawer.Body = ModalBody;
Drawer.Footer = ModalFooter;