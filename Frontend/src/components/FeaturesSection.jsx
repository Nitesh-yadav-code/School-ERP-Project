import React from 'react';
import { Box, Container, Grid, Typography, useTheme, Stack, Chip } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { keyframes } from '@mui/system';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const FeatureCard = ({ icon, title, description, index, badge }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        animation: `${fadeInUp} 0.8s ease-out ${index * 0.15}s both`,
      }}
    >
      {/* Main Card */}
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          background: mode === 'light' 
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: mode === 'light' 
            ? 'rgba(226, 232, 240, 0.6)' 
            : 'rgba(71, 85, 105, 0.4)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            borderColor: mode === 'light' 
              ? 'rgba(59, 130, 246, 0.5)' 
              : 'rgba(96, 165, 250, 0.5)',
            boxShadow: mode === 'light'
              ? '0 16px 32px rgba(59, 130, 246, 0.12), 0 0 0 1px rgba(59, 130, 246, 0.1)'
              : '0 16px 32px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.2)',
            '& .icon-wrapper': {
              animation: `${float} 2s ease-in-out infinite`,
              transform: 'scale(1.05)',
            },
            '& .shine-effect': {
              animation: `${shimmer} 2s linear infinite`,
            },
          },
        }}
      >
        {/* Shine Effect */}
        <Box
          className="shine-effect"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: mode === 'light'
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            backgroundSize: '200% 100%',
            pointerEvents: 'none',
          }}
        />

        {/* Badge */}
        {badge && (
          <Chip
            label={badge}
            size="small"
            icon={<AutoAwesomeIcon sx={{ fontSize: '0.75rem' }} />}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: mode === 'light'
                ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                : 'linear-gradient(135deg, #60a5fa, #818cf8)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 22,
              px: 0.5,
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
        )}
        
        {/* Icon */}
        <Box
          className="icon-wrapper"
          sx={{
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2.5,
            background: mode === 'light'
              ? 'linear-gradient(135deg, #dbeafe, #e0e7ff)'
              : 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(79, 70, 229, 0.25))',
            mb: 2.5,
            position: 'relative',
            transition: 'all 0.4s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -2,
              borderRadius: 2.5,
              padding: 2,
              background: mode === 'light'
                ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                : 'linear-gradient(135deg, #60a5fa, #818cf8)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            },
          }}
        >
          {React.cloneElement(icon, { 
            sx: { 
              fontSize: '1.75rem',
              color: 'primary.main',
            } 
          })}
        </Box>

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              fontSize: '1.15rem',
              background: mode === 'light'
                ? 'linear-gradient(135deg, #1e293b, #3b82f6)'
                : 'linear-gradient(135deg, #f8fafc, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: '0.875rem',
              lineHeight: 1.6,
              opacity: 0.85,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const features = [
  {
    icon: <PersonSearchIcon />,
    title: 'Book Top Tutors',
    description: 'Find trusted tutors easily. Browse verified profiles and reviews to match your learning style.',
    badge: 'Popular',
  },
  {
    icon: <EventAvailableIcon />,
    title: 'Flexible Scheduling',
    description: 'Learn anytime, anywhere. Book sessions that fit your schedule with online or in-person options.',
    badge: 'Flexible',
  },
  {
    icon: <PsychologyIcon />,
    title: 'AI Study Assistant',
    description: 'Get instant help with concepts. Our AI assistant helps you understand and solve problems quickly.',
    badge: 'AI Powered',
  },
];

const FeaturesSection = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Box 
      sx={{ 
        py: { xs: 6, md: 10 }, 
        position: 'relative',
        background: mode === 'light'
          ? 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)'
          : 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Decorative Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: mode === 'light'
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '-5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: mode === 'light'
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Stack 
          spacing={2} 
          alignItems="center" 
          sx={{ 
            mb: { xs: 5, md: 7 },
            textAlign: 'center',
          }}
        >
          <Chip
            label="Features"
            size="small"
            sx={{
              background: mode === 'light'
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
              color: 'primary.main',
              fontWeight: 600,
              border: '1px solid',
              borderColor: mode === 'light' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.3)',
              animation: `${fadeInUp} 0.6s ease-out`,
            }}
          />
          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
              background: mode === 'light'
                ? 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              animation: `${fadeInUp} 0.6s ease-out 0.1s both`,
            }}
          >
            Why Choose EduMentor?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: '550px',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              lineHeight: 1.6,
              animation: `${fadeInUp} 0.6s ease-out 0.2s both`,
            }}
          >
            Discover powerful features designed to enhance your learning experience
          </Typography>
        </Stack>
        
        {/* Features Grid */}
        <Grid 
          container 
          spacing={{ xs: 3, md: 3.5 }}
          sx={{
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {features.map((feature, index) => (
            <Grid 
              item 
              key={index} 
              xs={12} 
              sm={6} 
              md={4}
              sx={{
                display: 'flex',
              }}
            >
              <FeatureCard {...feature} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;