import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import './Footer.css';

// Import the logos
import GithubLogo from '../../assets/github-logo.svg';
import CHNULogo from '../../assets/chnu-logo.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box className="footer">
      <div className="footer-container">
        <div className="footer-logo-left">
          <Link href="https://www.chnu.edu.ua/" target="_blank" rel="noopener noreferrer">
            <img src={CHNULogo} alt="CHNU website" className="footer-logo" />
          </Link>
        </div>
        
        <div className="footer-content">
          <Typography variant="body2" align="center">
            © {currentYear} All Rights Reserved | Chernivtsi National University
          </Typography>
          <Typography variant="caption" align="center" className="footer-subtitle">
            Developed as part of diploma project
          </Typography>
        </div>
        
        <div className="footer-logo-right">
          <Link href="https://github.com/orgs/agalias-diploma/repositories" target="_blank" rel="noopener noreferrer">
            <img src={GithubLogo} alt="GitHub agalias repositories" className="footer-logo" />
          </Link>
        </div>
      </div>
    </Box>
  );
};

export default Footer;
