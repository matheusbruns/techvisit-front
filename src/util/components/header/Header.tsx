import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { MenuOutlined } from '@mui/icons-material';
import Logo from "../../../resources/images/logo.png";
import Sidebar from '../sidebar/Sidebar';
import "./Header.scss";

export default function Header() {
	const [drawerVisible, setDrawerVisible] = useState(false);

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
						<IconButton onClick={toggleDrawer(true)} className="menu-icon">
							<MenuOutlined sx={{
								fontSize: 38
							}} />
						</IconButton>
						<img src={Logo} alt="TECHVISIT" height={60} className="logo" />
					</div>
				</div>
			</div>
			<Sidebar drawerVisible={drawerVisible} toggleDrawer={toggleDrawer} />
		</>
	);
}
