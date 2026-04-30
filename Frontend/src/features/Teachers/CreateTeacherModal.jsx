import React, { useState } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { FiUser, FiMail, FiPhone, FiCheck, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import teacherService from "../../services/teacherService";

const inputStyles = {
    "& .MuiOutlinedInput-root": {
        bgcolor: "#ffffff",
        color: "#374151",
        borderRadius: "10px",
        "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
        "&:hover fieldset": { borderColor: "#667eea" },
        "&.Mui-focused fieldset": { borderColor: "#667eea" },
    },
    "& .MuiInputLabel-root": { color: "#6b7280" },
    "& .MuiInputAdornment-root": { color: "#9ca3af" },
};

const SectionBox = styled(Box)({
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    border: "1px solid #e5e7eb",
});

const SectionTitle = styled(Typography)({
    color: "#374151",
    fontWeight: 600,
    fontSize: "0.95rem",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
});

const LoginSection = styled(Box)(({ enabled }) => ({
    backgroundColor: enabled ? "#667eea08" : "#f9fafb",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    border: enabled ? "1px solid #667eea30" : "1px solid #e5e7eb",
    transition: "all 0.3s ease",
}));

const CreateTeacherModal = ({ open, onClose, onSuccess, editData = null }) => {
    const isEditMode = !!editData;
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: editData?.name || "",
        email: editData?.email || "",
        phone: editData?.phone || "",
        isActive: editData?.isActive ?? true,
        enableLogin: false,
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});

    React.useEffect(() => {
        if (open) {
            if (editData) {
                setFormData({
                    name: editData.name || "",
                    email: editData.email || "",
                    phone: editData.phone || "",
                    isActive: editData.isActive ?? true,
                    enableLogin: !!editData.userId,
                    password: "",
                    confirmPassword: "",
                });
            } else {
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    isActive: true,
                    enableLogin: false,
                    password: "",
                    confirmPassword: "",
                });
            }
            setErrors({});
            setShowPassword(false);
            setShowConfirmPassword(false);
        }
    }, [open, editData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
        // Clear password errors when disabling login
        if (name === "enableLogin" && !checked) {
            setErrors(prev => ({ ...prev, password: "", confirmPassword: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        // Password validation only if enableLogin is true
        if (formData.enableLogin) {
            if (!isEditMode || formData.password) {
                if (!formData.password) {
                    newErrors.password = "Password is required for login";
                } else if (formData.password.length < 6) {
                    newErrors.password = "Password must be at least 6 characters";
                }
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = "Passwords do not match";
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const submitData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            isActive: formData.isActive,
            enableLogin: formData.enableLogin,
        };

        // Include password only if enableLogin and password is provided
        if (formData.enableLogin && formData.password) {
            submitData.password = formData.password;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                await teacherService.updateTeacher(editData._id, submitData);
                toast.success("Teacher updated successfully");
            } else {
                await teacherService.createTeacher(submitData);
                toast.success(formData.enableLogin
                    ? "Teacher created with login access"
                    : "Teacher created successfully"
                );
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving teacher:", error);
            toast.error(error.response?.data?.message || "Failed to save teacher");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: "", email: "", phone: "", isActive: true, enableLogin: false, password: "", confirmPassword: "" });
        setErrors({});
        onClose();
    };

    return (
        <CommonModal
            open={open}
            onClose={handleClose}
            title={isEditMode ? "Edit Teacher" : "Add New Teacher"}
            maxWidth="sm"
            actions={
                <Box sx={{ display: "flex", gap: 1.5, width: "100%", justifyContent: "flex-end" }}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        disabled={loading}
                        sx={{
                            color: "#374151",
                            borderColor: "#d1d5db",
                            textTransform: "none",
                            px: 3,
                            borderRadius: "10px",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            textTransform: "none",
                            px: 3,
                            borderRadius: "10px",
                            fontWeight: 600,
                        }}
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FiCheck size={16} />}
                    >
                        {loading ? "Saving..." : isEditMode ? "Update Teacher" : "Create Teacher"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ mt: 2 }}>
                {/* Teacher Information */}
                <SectionBox>
                    <SectionTitle>
                        <FiUser size={18} /> Teacher Information
                    </SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name *"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                placeholder="John Doe"
                                sx={inputStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiUser size={16} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email *"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                placeholder="teacher@school.com"
                                sx={inputStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiMail size={16} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="9876543210"
                                sx={inputStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiPhone size={16} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={handleSwitchChange}
                                        name="isActive"
                                        sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked": { color: "#22c55e" },
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#22c55e" },
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={{ color: "#374151", fontWeight: 500 }}>
                                        {formData.isActive ? "Active" : "Inactive"}
                                    </Typography>
                                }
                            />
                        </Grid>
                    </Grid>
                </SectionBox>

                {/* Login Access Section */}
                <LoginSection enabled={formData.enableLogin}>
                    <SectionTitle>
                        <FiLock size={18} /> Login Access
                    </SectionTitle>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.enableLogin}
                                onChange={handleSwitchChange}
                                name="enableLogin"
                                sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#667eea" },
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#667eea" },
                                }}
                            />
                        }
                        label={
                            <Box>
                                <Typography sx={{ color: "#374151", fontWeight: 500 }}>
                                    Enable Login Access
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                    Allow this teacher to login to the system
                                </Typography>
                            </Box>
                        }
                        sx={{ mb: 2 }}
                    />

                    {formData.enableLogin && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Password *"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password || (isEditMode ? "Leave blank to keep current" : "")}
                                    placeholder="Min 6 characters"
                                    sx={inputStyles}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FiLock size={16} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Confirm Password *"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                    placeholder="Confirm password"
                                    sx={inputStyles}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FiLock size={16} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mt: -1 }}>
                                    💡 Teacher will be able to login with email and password. Default role: Teacher
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </LoginSection>
            </Box>
        </CommonModal>
    );
};

export default CreateTeacherModal;
