import React, { useState, useEffect } from "react";
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
import { styled } from "@mui/material/styles";
import { FiBook, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import subjectService from "../../services/subjectService";

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

const AddSubjectModal = ({ open, onClose, onSuccess, editData = null }) => {
    const isEditMode = !!editData;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        isActive: true,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            if (editData) {
                setFormData({
                    name: editData.name || "",
                    code: editData.code || "",
                    description: editData.description || "",
                    isActive: editData.isActive ?? true,
                });
            } else {
                setFormData({ name: "", code: "", description: "", isActive: true });
            }
            setErrors({});
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
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Subject name is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            if (isEditMode) {
                await subjectService.updateSubject(editData._id, formData);
                toast.success("Subject updated successfully");
            } else {
                await subjectService.createSubject(formData);
                toast.success("Subject created successfully");
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving subject:", error);
            toast.error(error.response?.data?.message || "Failed to save subject");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: "", code: "", description: "", isActive: true });
        setErrors({});
        onClose();
    };

    return (
        <CommonModal
            open={open}
            onClose={handleClose}
            title={isEditMode ? "Edit Subject" : "Add New Subject"}
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
                        {loading ? "Saving..." : isEditMode ? "Update Subject" : "Create Subject"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ mt: 2 }}>
                <SectionBox>
                    <SectionTitle>
                        <FiBook size={18} /> Subject Information
                    </SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                label="Subject Name *"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                placeholder="e.g. Mathematics"
                                sx={inputStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiBook size={16} style={{ color: "#9ca3af" }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Subject Code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="e.g. MATH"
                                sx={inputStyles}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={2}
                                placeholder="Optional description..."
                                sx={inputStyles}
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
            </Box>
        </CommonModal>
    );
};

export default AddSubjectModal;
