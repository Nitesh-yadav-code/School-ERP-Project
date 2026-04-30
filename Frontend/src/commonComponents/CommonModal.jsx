import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { FiX } from 'react-icons/fi';

const StyledDialog = styled(Dialog)(({ variant }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ variant }) => ({
  background: variant === 'danger' 
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    : variant === 'success'
    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
  padding: '1rem 1.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1.25rem',
  fontWeight: 600,
}));

const StyledDialogContent = styled(DialogContent)({
  padding: '1.5rem',
  backgroundColor: '#ffffff',
  color: '#374151',
});

const StyledDialogActions = styled(DialogActions)({
  padding: '1rem 1.5rem',
  backgroundColor: '#f9fafb',
  gap: '0.75rem',
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
});

const CloseButton = styled(IconButton)({
  color: '#ffffff',
  padding: '0.25rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

const CommonModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  variant = 'default', // 'default' | 'danger' | 'success'
  hideCloseButton = false,
}) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      variant={variant}
    >
      <StyledDialogTitle variant={variant}>
        <span>{title}</span>
        {!hideCloseButton && (
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        )}
      </StyledDialogTitle>
      
      <StyledDialogContent >
        {children}
      </StyledDialogContent>
      
      {actions && (
        <StyledDialogActions>
          {actions}
        </StyledDialogActions>
      )}
    </StyledDialog>
  );
};

export default CommonModal;