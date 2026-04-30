"use client"

import { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import InputBase from "@mui/material/InputBase"
import IconButton from "@mui/material/IconButton"
import Badge from "@mui/material/Badge"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import ListItemIcon from "@mui/material/ListItemIcon"
import Fade from "@mui/material/Fade"
import SearchIcon from "@mui/icons-material/Search"
import NotificationsIcon from "@mui/icons-material/Notifications"
import PersonIcon from "@mui/icons-material/Person"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"
import MenuIcon from "@mui/icons-material/Menu"
import { useNavigate } from "react-router-dom"
import { UserContext } from "./UserContext"
import { useContext } from "react"

export default function TopNav({ sidebarOpen, setSidebarOpen, isMobile }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationAnchor, setNotificationAnchor] = useState(null)

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget)
  }

  const navigate=  useNavigate();
  const {setIsLoggedIn} =  useContext( UserContext)
   const handleLogout = () => {
    setAnchorEl(null)
    setNotificationAnchor(null)
     localStorage.removeItem('authToken')
     setIsLoggedIn(false)
     navigate('/')
  }
  const handleClose = () => {
    setAnchorEl(null)
    setNotificationAnchor(null)
  }

  const notifications = [
    { id: 1, text: "New student registration pending", time: "5 min ago" },
    { id: 2, text: "Fee payment received from John Doe", time: "1 hour ago" },
    { id: 3, text: "Attendance report generated", time: "2 hours ago" },
  ]

  return (
    <AppBar
      position="fixed"
      sx={{
        ml: isMobile ? 0 : sidebarOpen ? "260px" : "80px",
        width: isMobile ? "100%" : `calc(100% - ${sidebarOpen ? 260 : 80}px)`,
        bgcolor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isMobile && (
            <IconButton
              onClick={setSidebarOpen}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  bgcolor: "rgba(99, 102, 241, 0.1)",
                  color: "primary.main",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              display: { xs: "none", sm: "block" },
            }}
          >
            Dashboard
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              bgcolor: "#f3f4f6",
              borderRadius: 2,
              px: 2,
              py: 0.5,
              border: "1px solid rgba(0, 0, 0, 0.08)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#e5e7eb",
                borderColor: "rgba(99, 102, 241, 0.3)",
              },
              "&:focus-within": {
                borderColor: "primary.main",
                boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.2)",
              },
            }}
          >
            <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
            <InputBase
              placeholder="Search..."
              sx={{
                color: "text.primary",
                width: { sm: 120, md: 200 },
                "& ::placeholder": {
                  color: "text.secondary",
                  opacity: 1,
                },
              }}
            />
          </Box>

          <IconButton
            sx={{
              display: { xs: "flex", sm: "none" },
              color: "text.secondary",
              bgcolor: "#f3f4f6",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              "&:hover": {
                bgcolor: "rgba(99, 102, 241, 0.1)",
                color: "primary.main",
              },
            }}
          >
            <SearchIcon />
          </IconButton>

          <IconButton
            onClick={handleNotificationClick}
            sx={{
              color: "text.secondary",
              bgcolor: "#f3f4f6",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              "&:hover": {
                bgcolor: "rgba(99, 102, 241, 0.1)",
                color: "primary.main",
                borderColor: "rgba(99, 102, 241, 0.3)",
              },
            }}
          >
            <Badge
              badgeContent={3}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor: "#ef4444",
                  boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
                },
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Box
            onClick={handleProfileClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              p: 1,
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
              }}
            >
              A
            </Avatar>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                {localStorage.getItem('userName')}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Super Admin
              </Typography>
            </Box>
          </Box>
        </Box>

        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              bgcolor: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
              borderRadius: 2,
              minWidth: { xs: 280, sm: 320 },
              mt: 1,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              Notifications
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.08)" }} />
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleClose}
              sx={{
                py: 1.5,
                px: 2,
                "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)" },
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: "text.primary" }}>
                  {notification.text}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              bgcolor: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
              borderRadius: 2,
              minWidth: 200,
              mt: 1,
            },
          }}
        >
          <MenuItem onClick={handleClose} sx={{ "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)" } }}>
            <ListItemIcon>
              <PersonIcon sx={{ color: "text.secondary" }} />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)" } }}>
            <ListItemIcon>
              <SettingsIcon sx={{ color: "text.secondary" }} />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.08)" }} />
          <MenuItem onClick={handleLogout} sx={{ color: "#ef4444", "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" } }}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#ef4444" }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
