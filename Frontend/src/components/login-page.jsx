"use client"

import { useContext, useState } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Divider from "@mui/material/Divider"
import Fade from "@mui/material/Fade"
import Zoom from "@mui/material/Zoom"
import CircularProgress from "@mui/material/CircularProgress"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import SchoolIcon from "@mui/icons-material/School"
import GoogleIcon from "@mui/icons-material/Google"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import { ThemeProvider, createTheme } from "@mui/material"
import { UserContext } from "./UserContext"
import authService from "../services/authService"
import { useNavigate } from "react-router-dom"

// Dark theme specifically for login page
const loginDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#22d3ee",
    },
    background: {
      default: "#0f0f23",
      paper: "#1a1a2e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#94a3b8",
    },
  },
});

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { setIsLoggedIn, login } = useContext(UserContext);

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      const data = res.data;

      if (res.status === 200) {
        alert("Login successful!");
        login(data.user, data.authToken)
        localStorage.setItem("authToken", data.authToken);
         localStorage.setItem('userName', data?.user?.name);
        setIsLoggedIn(true);
        navigate('/dashboard')
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={loginDarkTheme}>
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient effects */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <Fade in timeout={800}>
        <Card
          sx={{
            maxWidth: 420,
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            position: "relative",
            overflow: "visible",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: "3px",
              background: "linear-gradient(90deg, transparent, #6366f1, #22d3ee, transparent)",
              borderRadius: "0 0 4px 4px",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Logo Section */}
            <Zoom in timeout={600}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    boxShadow: "0 10px 40px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 36, color: "white" }} />
                </Box>
                <Typography variant="h5" fontWeight={700} color="white" gutterBottom>
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to School Management System
                </Typography>
              </Box>
            </Zoom>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="admin@school.edu"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 1.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: 20 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your password"
              />

              {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      sx={{
                        color: "text.secondary",
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Remember me
                    </Typography>
                  }
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
                    boxShadow: "0 12px 28px rgba(99, 102, 241, 0.4)",
                  },
                  "&:disabled": {
                    background: "rgba(99, 102, 241, 0.5)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Sign In"
                )}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.3,
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "text.primary",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                Continue with Google
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", mt: 3 }}
              >
                Don't have an account?{" "}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: 500,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Contact Admin
                </Typography>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Box>
    </ThemeProvider>
  )
}
