import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { FiUser, FiBook, FiCalendar, FiHash, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import classService from "../../services/classService";
import sectionService from "../../services/sectionService";

// Styled Components - matching CreateStudentModal
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
    "& .MuiSelect-icon": { color: "#6b7280" },
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

const StudentInfoBox = styled(Box)({
    background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "16px",
    border: "1px solid #667eea30",
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

const EnrollStudentModal = ({ open, onClose, student, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [formData, setFormData] = useState({
        classId: "",
        sectionId: "",
        academicYear: "",
        rollNumber: "",
    });
    const [errors, setErrors] = useState({});

    // Fetch classes when modal opens
    useEffect(() => {
        if (open) {
            fetchClasses();
            // Reset form
            setFormData({
                classId: "",
                sectionId: "",
                academicYear: "",
                rollNumber: "",
            });
            setSections([]);
            setErrors({});
        }
    }, [open]);

    // Fetch sections when class changes
    useEffect(() => {
        if (formData.classId) {
            fetchSections(formData.classId);
        } else {
            setSections([]);
            setFormData((prev) => ({ ...prev, sectionId: "" }));
        }
    }, [formData.classId]);

    const fetchClasses = async () => {
        try {
            const res = await classService.getClasses();
            setClasses(res.data.classes || []);
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast.error("Failed to load classes");
        }
    };

    const fetchSections = async (classId) => {
        try {
            const res = await sectionService.getSectionsByClass(classId);
            setSections(res.data.sections || []);
            setFormData((prev) => ({ ...prev, sectionId: "" }));
        } catch (error) {
            console.error("Error fetching sections:", error);
            toast.error("Failed to load sections");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.classId) newErrors.classId = "Class is required";
        if (!formData.sectionId) newErrors.sectionId = "Section is required";
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
            const enrollmentData = {
                studentId: student._id,
                classId: formData.classId,
                sectionId: formData.sectionId,
                academicYear: formData.academicYear,
                rollNumber: formData.rollNumber || undefined,
            };

            // Call enrollment API via studentService
            const { enrollStudent } = await import("../../services/studentService");
            await enrollStudent(enrollmentData);

            toast.success("Student enrolled successfully!");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error enrolling student:", error);
            toast.error(error.response?.data?.message || "Failed to enroll student");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            classId: "",
            sectionId: "",
            academicYear: "",
            rollNumber: "",
        });
        setErrors({});
        onClose();
    };

    const studentName = student
        ? `${student.firstName || ""} ${student.lastName || ""}`.trim()
        : "";

    return (
        <CommonModal
            open={open}
            onClose={handleClose}
            title="Enroll Student"
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
                            "&:hover": { borderColor: "#9ca3af" },
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
                            boxShadow: "0 4px 14px rgba(102, 126, 234, 0.35)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                            },
                        }}
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FiCheck size={16} />}
                    >
                        {loading ? "Enrolling..." : "Enroll Student"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                {/* Student Info Display */}
                <StudentInfoBox>
                    <FiUser size={24} style={{ color: "#667eea" }} />
                    <Box>
                        <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                            {studentName || "Student"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            Enrolling to class for academic session
                        </Typography>
                    </Box>
                </StudentInfoBox>

                {/* Enrollment Details */}
                <SectionBox>
                    <SectionTitle>
                        <FiBook size={18} /> Enrollment Details
                    </SectionTitle>
                    <Grid container spacing={2}>
                        {/* Class Selection */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Class *"
                                name="classId"
                                value={formData.classId}
                                onChange={handleChange}
                                error={!!errors.classId}
                                helperText={errors.classId}
                                sx={inputStyles}
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{ displayEmpty: true }}
                            >
                                <MenuItem value="">
                                    <em>Select Class</em>
                                </MenuItem>
                                {classes.map((cls) => (
                                    <MenuItem key={cls._id} value={cls._id}>
                                        {cls.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Section Selection */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Section *"
                                name="sectionId"
                                value={formData.sectionId}
                                onChange={handleChange}
                                error={!!errors.sectionId}
                                helperText={errors.sectionId}
                                disabled={!formData.classId || sections.length === 0}
                                sx={inputStyles}
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{ displayEmpty: true }}
                            >
                                <MenuItem value="">
                                    <em>{!formData.classId ? "Select class first" : "Select Section"}</em>
                                </MenuItem>
                                {sections.map((sec) => (
                                    <MenuItem key={sec._id} value={sec._id}>
                                        {sec.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Academic Year */}
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

                        {/* Roll Number */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Roll Number"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                placeholder="Optional"
                                sx={inputStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiHash size={16} />
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

export default EnrollStudentModal;
