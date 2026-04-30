import React, { useContext, useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Slide,
  Fade,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { keyframes } from '@mui/system';
import AuthModal from './AuthModal';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Navbar = ({ mode, onToggleTheme }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { isLoggedIn, setIsLoggedIn, logout } = useContext(UserContext)

const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout =()=>{
    setIsLoggedIn(false)
   localStorage.clear()
   logout()
   navigate('/')
  

  }
  // const menuItems = ['Home', 'Tutors', 'Courses', 'About', 'Contact'];
    const menuItems = ['Home'];

  return (
    <>
      <Slide appear={false} direction="down" in={true}>
        <AppBar position="fixed" elevation={0}>
          <Toolbar sx={{ py: 1 }}>
            <Fade in={true} style={{ transitionDelay: '100ms' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', animation: `${fadeIn} 0.6s ease-out` }}>
                <SchoolIcon 
                sx={{ 
                  display: { xs: 'none', md: 'flex' }, 
                  mr: 1.5,
                  fontSize: '2rem',
                  color: 'primary.main' 
                }} 
              />
              <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{
                  flexGrow: { xs: 1, md: 0 },
                  mr: 3,
                  display: 'flex',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 800,
                  background: mode === 'light'
                    ? 'linear-gradient(to right, #3b82f6, #6366f1)'
                    : 'linear-gradient(to right, #60a5fa, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.025em',
                }}
              >
                {/* EduMentor */}
                Test
              </Typography>
            </Box>
          </Fade>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                onClick={onToggleTheme}
                sx={{ mr: 0.5 }}
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    borderRadius: 2,
                    mt: 1.5,
                    backgroundColor: mode === 'light' ? 'background.paper' : 'background.paper',
                    backdropFilter: 'blur(8px)',
                  },
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem 
                    key={item} 
                    onClick={handleMenuClose}
                    sx={{
                      minWidth: 150,
                      '&:hover': {
                        backgroundColor: mode === 'light' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.15)',
                      }
                    }}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Fade in={true} style={{ transitionDelay: '200ms' }}>
              <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                gap: 0.5,
                animation: `${fadeIn} 0.6s ease-out`,
              }}>
                {menuItems.map((item) => (
                  <Button
                    key={item}
                    color="inherit"
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: mode === 'light' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.15)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Fade>
          )}

          <Fade in={true} style={{ transitionDelay: '300ms' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {!isMobile && (
                <IconButton
                  color="inherit"
                  onClick={onToggleTheme}
                  sx={{
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'rotate(180deg)',
                    },
                  }}
                >
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              )}

                 <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  px: 2.5,
                  py: 0.75,
                  borderRadius: 2,
                  background: mode === 'light'
                    ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                    : 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  color: 'white',
                  fontWeight: 600,
                  boxShadow: mode === 'light'
                    ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                    : '0 4px 12px rgba(37, 99, 235, 0.4)',
                  animation: `${fadeIn} 0.6s ease-out`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: mode === 'light'
                      ? 'linear-gradient(135deg, #2563eb, #4f46e5)'
                      : 'linear-gradient(135deg, #1d4ed8, #4338ca)',
                    transform: 'translateY(-2px)',
                    boxShadow: mode === 'light'
                      ? '0 6px 16px rgba(59, 130, 246, 0.4)'
                      : '0 6px 16px rgba(37, 99, 235, 0.5)',
                  },
                }}
              >
                LogOut 
              </Button>
              
            </Box>
          </Fade>
        </Toolbar>
        </AppBar>
      </Slide>
      
    </>
  );
};

export default Navbar;