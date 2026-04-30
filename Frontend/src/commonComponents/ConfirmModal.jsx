import React from 'react';
import CommonModal from './CommonModal';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { FiAlertTriangle } from 'react-icons/fi';

const ActionButton = styled(Button)(({ variant }) => ({
  backgroundColor: variant === 'danger' ? '#ef4444' : '#d1d5db',
  color: variant === 'danger' ? '#ffffff' : '#374151',
  textTransform: 'none',
  padding: '0.5rem 1.5rem',
  borderRadius: '8px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: variant === 'danger' ? '#dc2626' : '#9ca3af',
  },
}));

const MessageContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  fontSize: '1rem',
  color: '#374151',
});

const ConfirmModal = ({ open, onClose, onConfirm, title, message, confirmText = 'Delete' }) => {
  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={title || 'Confirm'}
      variant="danger"
      actions={
        <>
          <ActionButton onClick={onClose}>Cancel</ActionButton>
          <ActionButton variant="danger" onClick={onConfirm}>{confirmText}</ActionButton>
        </>
      }
    >
      <MessageContainer style={{marginTop:"10px"}}>
        <FiAlertTriangle size={24} color="#ef4444" />
        <span>{message}</span>
      </MessageContainer>
    </CommonModal>
  );
};

export default ConfirmModal;