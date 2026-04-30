import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { FiBook, FiCalendar, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import classSubjectService from "../../services/classSubjectService";
import classService from "../../services/classService";
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

const AddClassSubjectModal = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        classId: "",
        subjectId: "",
        academicYear: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            fetchClasses();
            fetchSubjects();
            setFormData({ classId: "", subjectId: "", academicYear: "" });
            setErrors({});
        }
    }, [open]);

    const fetchClasses = async () => {
        try {
            const res = await classService.getClasses();
            setClasses(res.data.classes || []);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const res = await subjectService.getSubjects();
            setSubjects(res.data.subjects || []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.classId) newErrors.classId = "Class is required";
        if (!formData.subjectId) newErrors.subjectId = "Subject is required";
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
            await classSubjectService.createClassSubject(formData);
            toast.success("Subject assigned to class successfully");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error creating class subject:", error);
            toast.error(error.response?.data?.message || "Failed to assign subject");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ classId: "", subjectId: "", academicYear: "" });
        setErrors({});
        onClose();
    };

    return (
        <CommonModal
            open={open}
            onClose={handleClose}
            title="Assign Subject to Class"
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
                        {loading ? "Assigning..." : "Assign Subject"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ mt: 2 }}>
                <SectionBox>
                    <SectionTitle>
                        <FiBook size={18} /> Assignment Details
                    </SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                                sx={inputStyles}
                            >
                                <MenuItem value=""><em>Select Class</em></MenuItem>
                                {classes.map(cls => (
                                    <MenuItem key={cls._id} value={cls._id}>
                                        {cls.name} {cls.academicYear && `(${cls.academicYear})`}
                                    </MenuItem>
                                ))}
                            </TextField>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ flex: "1 1 180px", minWidth: 160 }}>
                            <TextField
                                fullWidth
                                select
                                label="Select Subject *"
                                name="subjectId"
                                value={formData.subjectId}
                                onChange={handleChange}
                                error={!!errors.subjectId}
                                helperText={errors.subjectId}
                                sx={inputStyles}
                            >
                                <MenuItem value=""><em>Select Subject</em></MenuItem>
                                {subjects.map(sub => (
                                    <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                                ))}
                            </TextField>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
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
                                        <Box sx={{ mr: 1, color: "#9ca3af" }}>
                                            <FiCalendar size={16} />
                                        </Box>
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

export default AddClassSubjectModal;
