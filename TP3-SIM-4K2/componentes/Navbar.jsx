import React from 'react';

const NavbarGolf = ({ backgroundImage }) => {
  const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '15vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage: `url(${backgroundImage})`,
    color: 'white',
    fontSize: '2rem',
    fontWeight: 'bold',
    fontFamily: 'Roboto, sans-serif',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  };

  return (
    <div style={navbarStyle}>
      Golf Recreativo
    </div>
  );
};

export default NavbarGolf;
