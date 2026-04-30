import React from 'react';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { keyframes } from '@mui/system';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const HeroSection = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Box
      sx={{
        background: theme.palette.background.gradient,
        pt: { xs: 12, md: 16 },
        pb: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          width: '40rem',
          height: '40rem',
          borderRadius: '50%',
          background: mode === 'light'
            ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(99, 102, 241, 0.1))'
            : 'linear-gradient(135deg, rgba(96, 165, 250, 0.05), rgba(99, 102, 241, 0.05))',
          top: '-20%',
          right: '-10%',
          zIndex: 0,
          animation: `${float} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '30rem',
          height: '30rem',
          borderRadius: '50%',
          background: mode === 'light'
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(96, 165, 250, 0.1))'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(96, 165, 250, 0.05))',
          bottom: '-10%',
          left: '-5%',
          zIndex: 0,
          animation: `${float} 8s ease-in-out infinite`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 4,
          }}
        >
          <Box sx={{ animation: `${fadeInUp} 0.8s ease-out` }}>
            <Typography
              component="h1"
              variant="h1"
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                lineHeight: { xs: 1.2, md: 1.1 },
                maxWidth: '900px',
                background: mode === 'light'
                  ? 'linear-gradient(to right, #1e293b 0%, #3b82f6 50%, #6366f1 100%)'
                  : 'linear-gradient(to right, #f8fafc 0%, #60a5fa 50%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
              }}
            >
              Learn Smarter.
              <br />
              Grow Faster.
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                fontWeight: 600,
                color: 'primary.main',
                mb: 4,
                opacity: 0.9,
              }}
            >
              Book Your Perfect Tutor in Minutes.
            </Typography>
          </Box>

          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{
              maxWidth: '600px',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              opacity: 0.9,
              animation: `${fadeInUp} 0.8s ease-out 0.2s both`,
            }}
          >
            Connect with expert tutors, master your subjects, and achieve your
            academic goals with personalized learning.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            sx={{
              mt: 2,
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              animation: `${fadeInUp} 0.8s ease-out 0.4s both`,
              boxShadow: mode === 'light'
                ? '0 8px 16px rgba(59, 130, 246, 0.2)'
                : '0 8px 16px rgba(59, 130, 246, 0.4)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: mode === 'light'
                  ? '0 12px 20px rgba(59, 130, 246, 0.3)'
                  : '0 12px 20px rgba(59, 130, 246, 0.5)',
              },
            }}
          >
            Find Tutors
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;