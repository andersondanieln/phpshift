import React from 'react';
import IconButton from './IconButton';

const Footer = ({ appVersion }) => {
  const onLinkClick = (e) => {
    e.preventDefault();
    const link = e.target.closest('a');
    if (link) window.api.openExternalLink(link.href);
  };

  return (
    <footer>
      <div className="footer-content">
        <p>PHPShift v{appVersion} | Created by <a href="https://andercoder.com" onClick={onLinkClick}>andercoder.com</a></p>
        <a href="https://www.linkedin.com/in/andersondn/" onClick={onLinkClick} title="LinkedIn Profile">
          <IconButton icon="linkedin" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;