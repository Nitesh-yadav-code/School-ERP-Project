import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { UserContext } from './UserContext';
import authService from '../services/authService';

const AuthModal = ({ open, onClose, type }) => {
  const { setIsLoggedIn } = useContext(UserContext);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    localStorage.clear();
    try {
      const res = await authService.login({
        email: form.email,
        password: form.password,
      });
      const data = res.data;
      if (res.status === 200) {
        alert('Login successful!');
        localStorage.setItem('authToken', data.authToken);
        localStorage.setItem('userName', data?.user?.name);
        setIsLoggedIn(true);
        setForm({
          name: '',
          email: '',
          password: '',
        });
        onClose();
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || 'Server error');
    }
  };

  const handleSignup = async () => {
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
    };
    try {
      const res = await authService.signup(payload);
      console.log(res);
      alert('Signup successful!');
      setForm({
        name: '',
        email: '',
        password: '',
      });
      onClose();
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={open && type === 'login'} onClose={onClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            value={form.email}
            name="email"
            onChange={handleChange}
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            name="password"
            value={form.password}
            onChange={handleChange}
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={open && type === 'signup'} onClose={onClose}>
        <DialogTitle>Signup</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            value={form.name}
            name="name"
            onChange={handleChange}
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            name="email"
            value={form.email}
            onChange={handleChange}
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            name="password"
            value={form.password}
            onChange={handleChange}
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSignup}>
            Signup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthModal;