import React from 'react';
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  IconButton,
  Stack,
  useTheme,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import SchoolIcon from '@mui/icons-material/School';
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

const socialHover = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const Footer = () => {
  const footerLinks = {
    'Quick Links': ['Home', 'Find Tutors', 'Courses', 'About Us'],
    'For Tutors': ['Become a Tutor', 'How it Works', 'Terms for Tutors'],
    'For Students': ['How to Start', 'Book Sessions', 'Student Resources'],
    'Support': ['Contact Us', 'FAQ', 'Privacy Policy', 'Terms of Service'],
  };

  const socialLinks = [
    { icon: <FacebookIcon />, url: '#' },
    { icon: <TwitterIcon />, url: '#' },
    { icon: <LinkedInIcon />, url: '#' },
    { icon: <InstagramIcon />, url: '#' },
  ];

  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        py: { xs: 8, md: 10 },
        px: 2,
        mt: 'auto',
        background: mode === 'light'
          ? 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
          : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        borderTop: '1px solid',
        borderColor: mode === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(51, 65, 85, 0.8)',
      }}
    >
      {/* Decorative gradient line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: mode === 'light'
            ? 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent)',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-evenly">
          <Grid 
            item 
            xs={12} 
            md={4}
            sx={{
              animation: `${fadeInUp} 0.6s ease-out`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SchoolIcon 
                sx={{ 
                  mr: 1.5,
                  fontSize: '2rem',
                  color: 'primary.main',
                }} 
              />
              <Typography 
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: mode === 'light'
                    ? 'linear-gradient(to right, #3b82f6, #6366f1)'
                    : 'linear-gradient(to right, #60a5fa, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                EduMentor
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              paragraph
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              Empowering students through personalized learning experiences.
              Connect with expert tutors and achieve your academic goals.
            </Typography>
            <Stack 
              direction="row" 
              spacing={2}
              sx={{
                '& .MuiIconButton-root': {
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    animation: `${socialHover} 0.8s ease-in-out`,
                    background: mode === 'light'
                      ? 'linear-gradient(135deg, #dbeafe, #e0e7ff)'
                      : 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(79, 70, 229, 0.2))',
                  },
                },
              }}
            >
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  color="primary"
                  aria-label="social media"
                  sx={{
                    width: 45,
                    height: 45,
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {Object.entries(footerLinks).map(([category, links], index) => (
            <Grid 
              item 
              xs={6} 
              sm={3} 
              md={2} 
              key={category}
              sx={{
                animation: `${fadeInUp} 0.6s ease-out ${index * 0.1}s`,
              }}
            >
              <Typography 
                variant="h6" 
                color="text.primary" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                {category}
              </Typography>
              <Box 
                component="ul" 
                sx={{ 
                  m: 0, 
                  p: 0, 
                  listStyle: 'none',
                  '& li': {
                    mb: 1.5,
                  },
                }}
              >
                {links.map((link) => (
                  <Box component="li" key={link}>
                    <Link
                      href="#"
                      underline="none"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: 'primary.main',
                          transform: 'translateX(5px)',
                        },
                        display: 'inline-block',
                      }}
                    >
                      {link}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            pt: 4,
            borderTop: '1px solid',
            borderColor: mode === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(51, 65, 85, 0.8)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.95rem',
            }}
          >
            © {new Date().getFullYear()} EduMentor. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;