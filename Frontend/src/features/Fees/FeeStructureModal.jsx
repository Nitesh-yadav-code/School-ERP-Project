import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import { FiDollarSign, FiBook, FiCheck, FiCalendar, FiTag } from "react-icons/fi";
import { toast } from "react-toastify";
import feeService from "../../services/feeService";
import classService from "../../services/classService";

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

const FeeStructureModal = ({ open, onClose, onSuccess, editData = null, classes: propClasses = [], defaultValues = {} }) => {
    const isEditMode = !!editData;
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState(propClasses);
    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        classId: "",
        academicYear: "",
        isMandatory: true,
    });
    const [errors, setErrors] = useState({});

    // Sync propClasses to local state
    useEffect(() => {
        if (propClasses.length > 0) {
            setClasses(propClasses);
        }
    }, [propClasses]);

    useEffect(() => {
        if (open) {
            // Only fetch classes if not provided via props
            if (propClasses.length === 0 && classes.length === 0) {
                fetchClasses();
            }

            if (editData) {
                setFormData({
                    name: editData.name || "",
                    amount: editData.amount || "",
                    classId: editData.classId?._id || editData.classId || "",
                    academicYear: editData.academicYear || "",
                    isMandatory: editData.isMandatory !== undefined ? editData.isMandatory : true,
                });
            } else {
                setFormData({
                    name: "",
                    amount: "",
                    classId: defaultValues?.classId || "",
                    academicYear: defaultValues?.academicYear || "",
                    isMandatory: true,
                });
            }
            setErrors({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, editData]);

    const fetchClasses = async () => {
        try {
            const res = await classService.getClasses();
            setClasses(res.data.classes || []);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSwitchChange = (e) => {
        setFormData(prev => ({ ...prev, isMandatory: e.target.checked }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Fee name is required";
        }

        if (!formData.amount || Number(formData.amount) <= 0) {
            newErrors.amount = "Valid amount is required";
        }

        if (!formData.classId) {
            newErrors.classId = "Class is required";
        }

        if (!formData.academicYear.trim()) {
            newErrors.academicYear = "Academic year is required";
        } else if (!/^\d{4}-\d{2}$/.test(formData.academicYear)) {
            newErrors.academicYear = "Format should be YYYY-YY (e.g., 2025-26)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const submitData = {
            name: formData.name.trim(),
            amount: Number(formData.amount),
            classId: formData.classId,
            academicYear: formData.academicYear.trim(),
            isMandatory: formData.isMandatory,
        };

        setLoading(true);
        try {
            if (isEditMode) {
                await feeService.updateFeeStructure(editData._id, submitData);
                toast.success("Fee structure updated successfully");
            } else {
                await feeService.createFeeStructure(submitData);
                toast.success("Fee structure created successfully");
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving fee structure:", error);
            toast.error(error.response?.data?.message || "Failed to save fee structure");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: "", amount: "", classId: "", academicYear: "", isMandatory: true });
        setErrors({});
        onClose();
    };

    return (
        <CommonModal
            open={open}
            onClose={handleClose}
            title={isEditMode ? "Edit Fee Structure" : "Add Fee Structure"}
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
                        {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ mt: 2 }}>
                {/* Fee Details */}
                <SectionBox>
                    <SectionTitle>
                        <FiTag size={18} /> Fee Details
                    </SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Fee Name *"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                placeholder="e.g., Tuition Fee, Lab Fee, Sports Fee"
                                sx={inputStyles}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Amount *"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                error={!!errors.amount}
                                helperText={errors.amount}
                                sx={inputStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography sx={{ color: "#9ca3af" }}>₹</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                height: "100%",
                                pl: 1,
                                bgcolor: "#ffffff",
                                borderRadius: "10px",
                                border: "1px solid rgba(0, 0, 0, 0.1)",
                                px: 2,
                            }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isMandatory}
                                            onChange={handleSwitchChange}
                                            sx={{
                                                "& .MuiSwitch-switchBase.Mui-checked": {
                                                    color: "#667eea",
                                                },
                                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                    backgroundColor: "#667eea",
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography sx={{ color: "#374151", fontWeight: 500 }}>
                                            Mandatory Fee
                                        </Typography>
                                    }
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </SectionBox>

                {/* Class & Academic Year */}
                <SectionBox>
                    <SectionTitle>
                        <FiBook size={18} /> Class & Academic Year
                    </SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ flex: "1 1 180px", minWidth: 160 }}>
                            <TextField
                                fullWidth
                                select
                                label="Select Class *"
                                name="classId"
                                value={formData.classId}
                                onChange={handleChange}
                                error={!!errors.classId}
                                helperText={errors.classId}
                                disabled={isEditMode}
                                sx={inputStyles}
                            >
                                <MenuItem value=""><em>Select Class</em></MenuItem>
                                {classes.map(cls => (
                                    <MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>
                                ))}
                            </TextField>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Academic Year *"
                                name="academicYear"
                                value={formData.academicYear}
                                onChange={handleChange}
                                error={!!errors.academicYear}
                                helperText={errors.academicYear || "Format: 2025-26"}
                                placeholder="2025-26"
                                disabled={isEditMode}
                                sx={inputStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiCalendar size={16} style={{ color: "#9ca3af" }} />
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

export default FeeStructureModal;
