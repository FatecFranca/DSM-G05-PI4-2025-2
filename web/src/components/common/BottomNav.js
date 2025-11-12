import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IoHomeOutline, IoCarOutline, IoPersonOutline } from 'react-icons/io5';

const BottomNavContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.navigation};
  height: 60px;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
`;

const IconWrapper = styled.div`
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${({ active }) => active && `
    background-color: rgba(255, 255, 255, 0.2);
  `}
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const icons = [
    { name: 'home', icon: IoHomeOutline, page: '/dashboard' },
    { name: 'car', icon: IoCarOutline, page: '/vehicles' },
    { name: 'person', icon: IoPersonOutline, page: '/profile' },
  ];

  return (
    <BottomNavContainer>
      {icons.map(({ name, icon: Icon, page }) => (
        <IconWrapper
          key={name}
          active={location.pathname === page}
          onClick={() => navigate(page)}
        >
          <Icon 
            size={26} 
            color={location.pathname === page ? '#fff' : '#aaa'} 
          />
        </IconWrapper>
      ))}
    </BottomNavContainer>
  );
};

export default BottomNav;