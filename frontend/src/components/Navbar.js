import React from 'react';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';

const Navbar = () => (
  <AppBar
    position="fixed"
    sx={{
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(122, 86, 214, 0.2)',
      boxShadow: '0 8px 32px rgba(122, 86, 214, 0.15)',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '98%', // Increased from 95% to 98%
      maxWidth: '1920px',
      borderRadius: '16px',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: '16px',
        border: '1px solid rgba(122, 86, 214, 0.1)',
        background: 'linear-gradient(180deg, rgba(122, 86, 214, 0.1), transparent)',
      }
    }}
  >
    <Container 
      maxWidth={false} // Changed from 'lg' to false
      sx={{ 
        width: '100%',
        px: { xs: 2, md: 3 } // Added consistent padding
      }}
    >
      <Toolbar sx={{ 
        height: '70px', 
        position: 'relative',
        width: '100%',
        px: { xs: 1, md: 2 } // Reduced padding
      }}>
        <img 
          src="/logo.png"
          alt="Roxiler Logo"
          style={{
            width: '140px',
            height: '120px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 8px rgba(122, 86, 214, 0.5))',
            position: 'absolute',
            left: { xs: '10px', md: '20px' }
          }}
        />
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          justifyContent: { xs: 'flex-end', md: 'center' },
          position: 'relative',
          pl: { xs: '150px', md: '160px' }, // Added left padding to avoid logo overlap
          pr: { xs: 2, md: 0 },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: -20,
            right: -20,
            height: '2px',
            bottom: -10,
            background: 'linear-gradient(90deg, transparent, #7a56d6, transparent)',
          }
        }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontSize: { xs: '1.4rem', md: '2.5rem' }, // Slightly reduced mobile font size
              textAlign: { xs: 'right', md: 'center' }, // Added text alignment
              fontWeight: 'bold',
              fontFamily: 'Montserrat, sans-serif',
              background: 'linear-gradient(to right, #7a56d6, rgba(255, 255, 255, 0.8), #7a56d6)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(122, 86, 214, 0.3)',
              letterSpacing: '0.5px',
              animation: 'gradient 5s ease infinite',
              '@keyframes gradient': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' }
              }
            }}
          >
            Roxiler Product Management
          </Typography>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);

export default Navbar;