import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import { FiLayers, FiCalendar, FiBook, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import sectionService from "../../services/sectionService";

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

const ClassInfoBox = styled(Box)({
    background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "20px",
    border: "1px solid #667eea30",
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

const AddSectionModal = ({ open, onClose, onSuccess, classData }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        academicYear: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open && classData) {
            setFormData({
                name: "",
                academicYear: classData.academicYear || "",
            });
            setErrors({});
        }
    }, [open, classData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Section name is required";
        if (!formData.academicYear.trim()) {
            newErrors.academicYear = "Academic year is required";
        } else if (!/^\d{4}-\d{2}$/.test(formData.academicYear)) {
            newErrors.academicYear = "Format should be YYYY-YY (e.g., 2024-25)";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await sectionService.createSection({
                name: formData.name,
                classId: classData._id,
                academicYear: formData.academicYear,
            });
            toast.success("Section created successfully");
            setFormData({ name: "", academicYear: "" });
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error creating section:", error);
            toast.error(error.response?.data?.message || "Failed to create section");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: "", academicYear: "" });
        setErrors({});
        onClose();
    };

    return (
        <CommonModal
            open={open}
            onClose={handleClose}
            title="Add New Section"
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
                        {loading ? "Creating..." : "Create Section"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ mt: 2 }}>
                {/* Class Info Display */}
                <ClassInfoBox>
                    <FiBook size={24} style={{ color: "#667eea" }} />
                    <Box>
                        <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                            {classData?.name || "Class"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            Adding section to this class
                        </Typography>
                    </Box>
                </ClassInfoBox>

                <SectionBox>
                    <SectionTitle>
                        <FiLayers size={18} /> Section Details
                    </SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Section Name *"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                placeholder="e.g. Section A"
                                sx={inputStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiLayers size={16} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Academic Year *"
                                name="academicYear"
                                value={formData.academicYear}
                                onChange={handleChange}
                                error={!!errors.academicYear}
                                helperText={errors.academicYear || "Format: 2024-25"}
                                placeholder="2024-25"
                                sx={inputStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiCalendar size={16} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </SectionBox>
            </Box>
        </CommonModal>
    );
};

export default AddSectionModal;
