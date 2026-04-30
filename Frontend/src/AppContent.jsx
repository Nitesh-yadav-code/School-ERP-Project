import React, { useState, useContext } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  useMediaQuery,
  Fade,
  CircularProgress,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { UserContext, UserProvider } from "./components/UserContext";
import Sidebar from "./components/sidebar";
import LoginPage from "./components/login-page";
import TopNav from "./components/top-nav";
import DashboardContent from "./components/dashboard-content";
import Teachers from "./features/Teachers/Teachers";
import Students from "./features/Students/Students";
import Attendance from "./features/Attendance/Attendance";
import Classes from "./features/Classes/Classes";
import Fees from "./features/Fees/Fees";

// Create theme
const darkTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#22d3ee",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6366f1",
            },
          },
        },
      },
    },
  },
});

// Separate component that uses UserContext (inside UserProvider)
function AppContent() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const { isLoggedIn, loading } = useContext(UserContext); // ✅ Now inside UserProvider

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };
 if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Fade in timeout={500}>
          <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
            <Sidebar
              open={sidebarOpen}
              setOpen={setSidebarOpen}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isMobile={isMobile}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", width: "100%", overflow: "hidden" }}>
              <TopNav
                sidebarOpen={sidebarOpen}
                setSidebarOpen={handleDrawerToggle}
                isMobile={isMobile}
              />
              <Box component="main" sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2, md: 2 }, mt: "64px", width: "100%" }}>
                <Routes>
                  <Route path="/dashboard" element={<DashboardContent />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/classes" element={<Classes />} />
                  <Route path="/fees" element={<Fees />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Box>
            </Box>
          </Box>
        </Fade>
      )}
    </>
  );
}
