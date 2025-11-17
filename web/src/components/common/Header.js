import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext.js';
import { IoHomeOutline, IoCarOutline, IoPersonOutline, IoListOutline, IoLogOutOutline, IoChevronDown } from 'react-icons/io5';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 0 40px;
  height: 70px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const LogoText = styled.span`
  font-family: ${({ theme }) => theme.fonts.montserrat.bold};
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
`;

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${({ active }) => active ? '#fff' : 'rgba(255, 255, 255, 0.8)'};
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ active }) => active ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  
  svg {
    font-size: 18px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  color: #fff;
  font-size: 14px;
`;

const UserRole = styled.span`
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-transform: capitalize;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.gradients.blue[0]}, ${({ theme }) => theme.gradients.blue[1]});
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.montserrat.bold};
  font-size: 16px;
  font-weight: 700;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  overflow: hidden;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
  
  svg {
    font-size: 18px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  ${({ danger }) => danger && `
    color: #e74c3c;
    
    svg {
      color: #e74c3c;
    }
    
    &:hover {
      background-color: #fee;
    }
  `}
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const navItems = [
    { path: '/dashboard', icon: IoHomeOutline, label: 'Home' },
    { path: '/vehicles', icon: IoCarOutline, label: 'Veículos' },
    ...(user?.tipo === 'PORTEIRO' ? [{ path: '/records', icon: IoListOutline, label: 'Registros' }] : []),
    { path: '/profile', icon: IoPersonOutline, label: 'Perfil' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getUserRoleLabel = (tipo) => {
    const roles = {
      'MORADOR': 'Morador',
      'PORTEIRO': 'Porteiro',
      'ADMIN': 'Administrador'
    };
    return roles[tipo] || 'Usuário';
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <LogoContainer onClick={() => navigate('/dashboard')}>
          <LogoImage src="/assets/logo.png" alt="MONIT Logo" />
          <LogoText>MONIT</LogoText>
        </LogoContainer>
        
        <NavMenu>
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavItem
              key={path}
              active={location.pathname === path}
              onClick={() => navigate(path)}
            >
              <Icon />
              <span>{label}</span>
            </NavItem>
          ))}
        </NavMenu>
      </LeftSection>

      <RightSection ref={dropdownRef}>
        <UserMenu onClick={() => setDropdownOpen(!dropdownOpen)}>
          <UserInfo>
            <UserName>{user?.nome?.split(' ')[0] || 'Usuário'}</UserName>
            <UserRole>{getUserRoleLabel(user?.tipo)}</UserRole>
          </UserInfo>
          <UserAvatar>
            {getInitials(user?.nome)}
          </UserAvatar>
          <IoChevronDown size={20} color="#fff" style={{ opacity: 0.7, transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
        </UserMenu>

        <DropdownMenu isOpen={dropdownOpen}>
          <DropdownItem onClick={() => {
            navigate('/profile');
            setDropdownOpen(false);
          }}>
            <IoPersonOutline />
            <span>Meu Perfil</span>
          </DropdownItem>
          <DropdownItem danger onClick={() => {
            handleLogout();
            setDropdownOpen(false);
          }}>
            <IoLogOutOutline />
            <span>Sair</span>
          </DropdownItem>
        </DropdownMenu>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
