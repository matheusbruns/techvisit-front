import React, { useState } from 'react';
import { Avatar, Box, Button, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Stack } from '@mui/material';
import { MenuOutlined, Person } from '@mui/icons-material';
import Logo from "../../../resources/images/logo.png";
import Sidebar from './sidebar/Sidebar';
import "./Header.scss";
import MenuProfile from './menuProfile/MenuProfile';
import { useAuth } from '../../../contexts/AuthContext';
import { UserRole } from '../../userRole/UserRole';

export default function Header() {
	const [drawerVisible, setDrawerVisible] = useState(false);
	const { user } = useAuth();

	const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
			return;
		}
		setDrawerVisible(open);
	};

	return (
		<>
			<div className="header">
				<div className="header-top">
					<div className="header-top-container">
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							{user?.role !== UserRole.TECHNICIAN && (
								< IconButton onClick={toggleDrawer(true)} className="menu-icon">
									<MenuOutlined sx={{
										fontSize: 38
									}} />
								</IconButton>
							)}
							<img src={Logo} alt="TECHVISIT" height={60} className="logo" />
						</Box>
						<Box>
							<MenuProfile />
						</Box>
					</div>
				</div>
			</div >
			<Sidebar drawerVisible={drawerVisible} toggleDrawer={toggleDrawer} />
		</>
	);
}
