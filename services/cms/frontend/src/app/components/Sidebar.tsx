// components/Sidebar.tsx
"use client";

import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Box,
  Divider,
} from "@mui/material";
import { Dashboard, WorkOutline, Settings } from "@mui/icons-material";
import Image from "next/image";
import CandidatesPage from "./candidate";

const SidebarContainer = styled("div")({
  width: "260px",
  backgroundColor: "#CFD8DC", // Grey color for a modern look
  color: "#364957", // Light gray text for contrast
  height: "100vh",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  overflowY: "auto",
});

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "20px",
});

const MenuItem = styled(ListItem)({
  borderRadius: "8px",
  marginBottom: "8px",
  transition: "background 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

const MenuItemIcon = styled(ListItemIcon)({
  color: "#FF8A00", // Accent color for icons
  minWidth: "40px",
});

const Sidebar = () => {
  return (
    <SidebarContainer>
      {/* Logo Section */}
      <LogoContainer>
        <Image
          src="/Logo@2x.svg" // Add your logo in public folder and replace this path
          alt="Company Logo"
          width={120}
          height={60}
        />
      </LogoContainer>
      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
      <List>
        <MenuItem button component="a" href="/">
          <MenuItemIcon>
            <Dashboard />
          </MenuItemIcon>
          <ListItemText primary="Open Job Posts" />
        </MenuItem>
        <MenuItem button component="a" href="/candidates">
          <MenuItemIcon>
            <WorkOutline />
          </MenuItemIcon>
          <ListItemText primary="Application Status" />
        </MenuItem>
        {/* <MenuItem button component="a" href="/">
          <MenuItemIcon>
            <Settings />
          </MenuItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem> */}
      </List>
    </SidebarContainer>
  );
};

export default Sidebar;
