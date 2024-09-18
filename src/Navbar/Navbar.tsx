import React from 'react';
import { Button } from 'react-bootstrap';
import { MdMenu, MdClose, MdHome, MdInfo } from 'react-icons/md';
import './Navbar.css';

interface NavbarProps {
  onAddLinkabaseClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddLinkabaseClick }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className={`header ${isSidebarOpen ? 'shifted' : ''}`}>
        <Button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? <MdClose /> : <MdMenu />}
        </Button>
        <div className="header-content">
          <h1>My App</h1>
          <Button
            className="add-linkabase-button"
            onClick={onAddLinkabaseClick}
          >
            Add Linkabase
          </Button>
        </div>
      </header>
      <nav className={`side-navbar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <div className="icon-item">
            <MdHome className="icon" />
            {isSidebarOpen && <span className="icon-name">Home</span>}
          </div>
          <div className="icon-item">
            <MdInfo className="icon" />
            {isSidebarOpen && <span className="icon-name">About</span>}
          </div>
    
        </div>
      </nav>
    </>
  );
};

export default Navbar;
