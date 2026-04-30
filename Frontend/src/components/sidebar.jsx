"use client"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Divider from "@mui/material/Divider"
import Fade from "@mui/material/Fade"
import Slide from "@mui/material/Slide"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PeopleIcon from "@mui/icons-material/People"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import PaymentsIcon from "@mui/icons-material/Payments"
import SchoolIcon from "@mui/icons-material/School"
import ClassIcon from "@mui/icons-material/Class"
import AssessmentIcon from "@mui/icons-material/Assessment"
import SettingsIcon from "@mui/icons-material/Settings"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, redirect: "/dashboard" },
  { text: "Users", icon: <PeopleIcon />, redirect: "/users" },
  { text: "Students", icon: <PeopleIcon />, redirect: "/students" },
  { text: "Attendance", icon: <EventAvailableIcon />, redirect: "/attendance" },
  { text: "Fees", icon: <PaymentsIcon />, redirect: "/fees" },
  { text: "Teachers", icon: <SchoolIcon />, redirect: "/teachers" },
  { text: "Classes", icon: <ClassIcon />, redirect: "/classes" },
  { text: "Class & Subject", icon: <ClassIcon />, redirect: "/class-subject" },
  { text: "Reports", icon: <AssessmentIcon />, redirect: "/reports" },
  { text: "Settings", icon: <SettingsIcon />, redirect: "/settings" },
];


export default function Sidebar({ open, setOpen, activeTab, setActiveTab, isMobile, mobileOpen, setMobileOpen }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Sync activeTab with current URL path on mount and route changes
    useEffect(() => {
      const currentPath = location.pathname;
      const matchedItem = menuItems.find(item => {
        if (item.redirect === "/") {
          return currentPath === "/";
        }
        return currentPath.startsWith(item.redirect);
      });
      if (matchedItem && matchedItem.text !== activeTab) {
        setActiveTab(matchedItem.text);
      }
    }, [location.pathname, setActiveTab]);

const handleRedirection = (redirect) => {
    // if (redirect === "expireToken") {
    //   sessionStorage.removeItem("token");
    //   navigate("/");
    // } else {
      navigate(redirect);
    // }
  };
  const drawerWidth = 260

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 80,
          boxSizing: "border-box",
          bgcolor: "#083989ff", // use var-bg here
          borderRight: "none",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          p: 2,
          minHeight: 64,
        }}
      >
        <Fade in={open} timeout={300}>
          <Box sx={{ display: open ? "flex" : "none", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
              }}
            >
              <SchoolIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              EduFlow
            </Typography>
          </Box>
        </Fade>
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
            },
          }}
        >
          <ChevronLeftIcon sx={{ transform: open ? "none" : "rotate(180deg)", transition: "transform 0.3s" }} />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

      <List sx={{ px: 1.5, pt: 2 }}>
        {menuItems.map((item, index) => (
          <Slide key={item.text} direction="right" in={true} timeout={300 + index * 50}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  setActiveTab(item.text)
                  if (item.redirect) handleRedirection(item.redirect);
                }}
                sx={{
                  minHeight: 48,
                  borderRadius: 2,
                  px: 2,
                  justifyContent: open ? "initial" : "center",
                  bgcolor: activeTab === item.text ? "rgba(99, 102, 241, 0.2)" : "transparent",
                  border: activeTab === item.text ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: activeTab === item.text ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.05)",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                    // color: activeTab === item.text ? "#ebedf6ff" : "rgba(239, 231, 231, 0.6)",
                     color: "white",
                    transition: "color 0.2s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    "& .MuiTypography-root": {
                      fontWeight: activeTab === item.text ? 600 : 400,
                      color: "white",
                      fontSize: "0.9rem",
                    },
                  }}
                />
                {activeTab === item.text && open && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#818cf8",
                      boxShadow: "0 0 10px rgba(129, 140, 248, 0.6)",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </Slide>
        ))}
      </List>
    </Drawer>
  )
}
