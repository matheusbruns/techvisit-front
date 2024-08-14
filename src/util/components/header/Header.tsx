import { Button, Drawer, Menu, MenuProps, Typography } from "antd";
import { useState } from "react";
import {
  ContainerOutlined,
  DesktopOutlined,
  ImportOutlined,
  MenuOutlined,
  PieChartOutlined,
  MailOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import "./Header.scss";
import Logo from "../../../resources/images/logo.png";
import { useNavigate } from "react-router-dom";


export default function Header() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <DesktopOutlined />, label: 'Dashboard', path: '/dashboard' },
    { icon: <DesktopOutlined />, label: 'Empresa', path: '/empresa' },
    { icon: <DesktopOutlined />, label: 'Usuário', path: '/usuario' },
    { icon: <DesktopOutlined />, label: 'Segurança', path: '/configuracoes/seguranca' },
  ];

  const toggleDrawer = () => {
    setDrawerVisible((prevVisible) => !prevVisible);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerVisible(false);
  };

  return (
    <>
      <div className="header">
        <div className="header-top">
          <div className="header-top-container">
            <MenuOutlined onClick={toggleDrawer} className="menu-icon" />
            <img src={Logo} alt="TECHVISIT" height={50} className="logo" />
          </div>
        </div>
        <Drawer
          className="drawer"
          title={<Typography.Title level={4} style={{ margin: 0, color: '#fff' }}>Menu</Typography.Title>}
          placement="left"
          onClose={toggleDrawer}
          open={drawerVisible}
          width={200}
          bodyStyle={{ padding: 0, backgroundColor: '#FF6A00' }}
          headerStyle={{ backgroundColor: '#FF6A00' }}
        >
          <div className="menu-list">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                type="text"
                className="menu-item"
                onClick={() => handleNavigation(item.path)}
                icon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </Drawer>
      </div>
    </>
  );
}