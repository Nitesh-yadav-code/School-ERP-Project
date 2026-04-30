import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { FiX } from 'react-icons/fi';

// Helper function to get nested object values
const getNestedValue = (obj, accessor) => {
  if (!obj || typeof accessor !== "string") return obj?.[accessor];
  return accessor.split(".").reduce((current, prop) => {
    return current?.[prop];
  }, obj);
};

// Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxWidth: '800px',
    width: '100%',
    margin: '16px',
    overflow: 'hidden',
  },
}));

const ModalHeader = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '24px 28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const HeaderLeft = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});

const HeaderAvatar = styled(Avatar)({
  width: 52,
  height: 52,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  fontSize: '1.4rem',
  fontWeight: 700,
  border: '3px solid rgba(255, 255, 255, 0.3)',
  color: '#ffffff',
});

const HeaderTitle = styled(Typography)({
  fontSize: '1.35rem',
  fontWeight: 700,
  color: '#ffffff',
});

const HeaderSubtitle = styled(Typography)({
  fontSize: '0.875rem',
  color: 'rgba(255, 255, 255, 0.8)',
  marginTop: '2px',
});

const CloseIconButton = styled(IconButton)({
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

const ContentWrapper = styled(DialogContent)({
  padding: '24px 28px',
  backgroundColor: '#f8fafc',
});

const Section = styled(Box)({
  marginBottom: '20px',
  '&:last-child': {
    marginBottom: 0,
  },
});

const SectionHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '14px',
  paddingBottom: '10px',
  borderBottom: '2px solid #e5e7eb',
});

const SectionTitle = styled(Typography)({
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#667eea',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
});

const FieldsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '12px',
});

const FieldCard = styled(Box)({
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  padding: '14px 16px',
  border: '1px solid #e5e7eb',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#d1d5db',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
});

const FieldLabel = styled(Typography)({
  fontSize: '0.7rem',
  fontWeight: 600,
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '6px',
});

const FieldValue = styled(Typography)({
  fontSize: '0.95rem',
  fontWeight: 600,
  color: '#1f2937',
  wordBreak: 'break-word',
});

const StatusChip = styled(Chip)(({ statuscolor }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  height: '26px',
  backgroundColor: alpha(statuscolor || '#6b7280', 0.12),
  color: statuscolor || '#6b7280',
  border: `1px solid ${alpha(statuscolor || '#6b7280', 0.25)}`,
}));

const BooleanChip = styled(Chip)(({ isactive }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  height: '24px',
  backgroundColor: isactive === 'true' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
  color: isactive === 'true' ? '#16a34a' : '#dc2626',
}));

const FooterBox = styled(Box)({
  padding: '16px 28px 24px',
  display: 'flex',
  justifyContent: 'flex-end',
  backgroundColor: '#f8fafc',
});

const CloseButton = styled(Button)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
  textTransform: 'none',
  padding: '10px 32px',
  borderRadius: '10px',
  fontWeight: 600,
  fontSize: '0.9rem',
  boxShadow: '0 4px 14px rgba(102, 126, 234, 0.35)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.45)',
  },
});

/**
 * ViewModal - A reusable modal for displaying details
 * 
 * @param {boolean} open - Controls modal visibility
 * @param {function} onClose - Close handler
 * @param {object} data - The data object to display
 * @param {string} title - Modal title (shown in header)
 * @param {string|function} subtitle - Subtitle text or function(data) => string
 * @param {string} avatarField - Field key to use for avatar initial (default: 'name')
 * @param {array} sections - Array of sections with fields
 * 
 * Example sections format:
 * [
 *   {
 *     title: 'Basic Info',
 *     fields: [
 *       { key: 'name', label: 'Name' },
 *       { key: 'status', label: 'Status', type: 'status' },
 *       { key: 'subscription.plan', label: 'Plan' },
 *     ]
 *   }
 * ]
 */
const ViewModal = ({ 
  open, 
  onClose, 
  data, 
  title = 'Details',
  subtitle,
  avatarField = 'name',
  sections = [],
}) => {
  
  // Get avatar initial
  const getAvatarInitial = () => {
    if (!data) return '?';
    const value = getNestedValue(data, avatarField) || data.name || data.title || '';
    return typeof value === 'string' && value.length > 0 ? value.charAt(0).toUpperCase() : '?';
  };

  // Get subtitle text
  const getSubtitle = () => {
    if (!data) return null;
    if (typeof subtitle === 'function') return subtitle(data);
    if (subtitle) return subtitle;
    if (data.code) return `Code: ${data.code}`;
    if (data.email) return data.email;
    return null;
  };

  // Get display title
  const getDisplayTitle = () => {
    if (!data) return title;
    return data.name || data.title || title;
  };

  // Render field value
  const renderValue = (field, value) => {
    // Custom render
    if (field.render) return field.render(value, data);

    // Empty value
    if (value === null || value === undefined || value === '') {
      return <span style={{ color: '#9ca3af', fontStyle: 'italic', fontWeight: 400 }}>—</span>;
    }

    // Status type
    if (field.type === 'status' || field.key === 'status') {
      const colors = {
        active: '#22c55e',
        inactive: '#ef4444',
        pending: '#f59e0b',
        suspended: '#ef4444',
      };
      const color = colors[String(value).toLowerCase()] || '#6b7280';
      return (
        <StatusChip 
          statuscolor={color}
          label={String(value).charAt(0).toUpperCase() + String(value).slice(1)} 
          size="small"
        />
      );
    }

    // Boolean type
    if (typeof value === 'boolean' || field.type === 'boolean') {
      return (
        <BooleanChip 
          isactive={String(value === true)}
          label={value ? 'Yes' : 'No'} 
          size="small"
        />
      );
    }

    // Date type
    if (field.type === 'date' || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
      try {
        return new Date(value).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      } catch {
        return String(value);
      }
    }

    // Array type - display as chips
    if (Array.isArray(value) || field.type === 'array') {
      const arr = Array.isArray(value) ? value : [];
      if (arr.length === 0) {
        return <span style={{ color: '#9ca3af', fontStyle: 'italic', fontWeight: 400 }}>None assigned</span>;
      }
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.5 }}>
          {arr.map((item, index) => (
            <Chip
              key={index}
              label={String(item).replace(/_/g, ' ')}
              size="small"
              sx={{
                height: '26px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(102, 126, 234, 0.12)',
                color: '#667eea',
                border: '1px solid rgba(102, 126, 234, 0.25)',
                '& .MuiChip-label': {
                  px: 1.5,
                },
              }}
            />
          ))}
        </Box>
      );
    }

    // Object type - should not happen if fields are configured correctly
    if (typeof value === 'object') {
      const entries = Object.entries(value).filter(([k, v]) => v != null && v !== '');
      if (entries.length === 0) return '—';
      return entries.map(([k, v]) => `${k}: ${v}`).join(', ');
    }

    return String(value);
  };

  // Default sections if none provided
  const displaySections = sections.length > 0 ? sections : [{
    title: 'Information',
    fields: data ? Object.keys(data)
      .filter(key => !['_id', '__v', 'createdAt', 'updatedAt', 'password'].includes(key))
      .map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
      })) : []
  }];

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Header */}
      <ModalHeader>
        <HeaderLeft>
          <HeaderAvatar>{getAvatarInitial()}</HeaderAvatar>
          <Box>
            <HeaderTitle>{getDisplayTitle()}</HeaderTitle>
            {getSubtitle() && <HeaderSubtitle>{getSubtitle()}</HeaderSubtitle>}
          </Box>
        </HeaderLeft>
        <CloseIconButton onClick={onClose} size="small">
          <FiX size={20} />
        </CloseIconButton>
      </ModalHeader>

      {/* Content */}
      <ContentWrapper>
        {data && displaySections.map((section, idx) => (
          <Section key={section.title || idx}>
            {section.title && (
              <SectionHeader>
                {section.icon && <span style={{ color: '#667eea', display: 'flex' }}>{section.icon}</span>}
                <SectionTitle>{section.title}</SectionTitle>
              </SectionHeader>
            )}
            <FieldsGrid>
              {section.fields.map((field) => (
                <FieldCard key={field.key} sx={field.fullWidth ? { gridColumn: '1 / -1' } : {}}>
                  <FieldLabel>{field.label}</FieldLabel>
                  <FieldValue>
                    {renderValue(field, getNestedValue(data, field.key))}
                  </FieldValue>
                </FieldCard>
              ))}
            </FieldsGrid>
          </Section>
        ))}
      </ContentWrapper>

      {/* Footer */}
      <FooterBox>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </FooterBox>
    </StyledDialog>
  );
};

export default ViewModal;