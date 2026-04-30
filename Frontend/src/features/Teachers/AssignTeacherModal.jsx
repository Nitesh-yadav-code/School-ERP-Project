import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import { FiUser, FiBook, FiCalendar, FiLayers, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import teacherService from "../../services/teacherService";
import classService from "../../services/classService";
import sectionService from "../../services/sectionService";
import classSubjectService from "../../services/classSubjectService";

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

const TeacherInfoBox = styled(Box)({
    background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "20px",
    border: "1px solid #667eea30",
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

const AssignTeacherModal = ({ open, onClose, teacher, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [classSubjects, setClassSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [formData, setFormData] = useState({
        classId: "",
        sectionId: "",
        academicYear: "",
        classSubjectId: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            fetchClasses();
            setFormData({
                classId: "",
                sectionId: "",
                academicYear: "",
                classSubjectId: "",
            });
            setSections([]);
            setClassSubjects([]);
            setErrors({});
        }
    }, [open]);

    useEffect(() => {
        if (formData.classId) {
            fetchSections(formData.classId);
        } else {
            setSections([]);
            setFormData(prev => ({ ...prev, sectionId: "" }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.classId]);

    // Fetch class subjects when both classId and academicYear are available
    useEffect(() => {
        if (formData.classId && formData.academicYear && /^\d{4}-\d{2}$/.test(formData.academicYear)) {
            fetchClassSubjects(formData.classId, formData.academicYear);
        } else {
            setClassSubjects([]);
            setFormData(prev => ({ ...prev, classSubjectId: "" }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.classId, formData.academicYear]);

    const fetchClasses = async () => {
        try {
            const res = await classService.getClasses();
            setClasses(res.data.classes || []);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    const fetchSections = async (classId) => {
        try {
            const res = await sectionService.getSectionsByClass(classId);
            setSections(res.data.sections || []);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
    };

    const fetchClassSubjects = async (classId, academicYear) => {
        setLoadingSubjects(true);
        try {
            const res = await classSubjectService.getClassSubjects({ classId, academicYear });
            setClassSubjects(res.data.classSubjects || []);
        } catch (error) {
            console.error("Error fetching class subjects:", error);
            toast.error("Failed to load subjects for this class");
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.classSubjectId) newErrors.classSubjectId = "Subject is required";
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
            const payload = {
                teacherId: teacher._id,
                classSubjectId: formData.classSubjectId,
                academicYear: formData.academicYear,
            };

            // Only include sectionId if it's selected
            if (formData.sectionId) {
                payload.sectionId = formData.sectionId;
            }

            await teacherService.assignTeacher(payload);

            toast.success("Teacher assigned successfully!");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error assigning teacher:", error);
            toast.error(error.response?.data?.message || "Failed to assign teacher");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ classId: "", sectionId: "", academicYear: "", classSubjectId: "" });
        setErrors({});
        onClose();
    };

    return (
        <CommonModal
            open={open}
            onClose={handleClose}
            title="Assign Teacher"
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
                        {loading ? "Assigning..." : "Assign Teacher"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ mt: 2 }}>
                {/* Teacher Info */}
                <TeacherInfoBox>
                    <FiUser size={24} style={{ color: "#667eea" }} />
                    <Box>
                        <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                            {teacher?.name || "Teacher"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            Assigning to class and subject
                        </Typography>
                    </Box>
                </TeacherInfoBox>

                <SectionBox>
                    <SectionTitle>
                        <FiBook size={18} /> Assignment Details
                    </SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ flex: "1 1 180px", minWidth: 160 }}>
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
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Subject *"
                                name="classSubjectId"
                                value={formData.classSubjectId}
                                onChange={handleChange}
                                error={!!errors.classSubjectId}
                                helperText={
                                    errors.classSubjectId ||
                                    (loadingSubjects ? "Loading subjects..." :
                                        (!formData.classId || !formData.academicYear ? "Select class and academic year first" : ""))
                                }
                                disabled={!formData.classId || !formData.academicYear || !/^\d{4}-\d{2}$/.test(formData.academicYear) || loadingSubjects}
                                sx={inputStyles}
                            >
                                <MenuItem value="">
                                    <em>{loadingSubjects ? "Loading..." : "Select Subject"}</em>
                                </MenuItem>
                                {classSubjects.map(cs => (
                                    <MenuItem key={cs._id} value={cs._id}>
                                        {cs.subjectId?.name || "Unknown Subject"}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ flex: "1 1 180px", minWidth: 160 }}>
                            <TextField
                                fullWidth
                                select
                                label="Section (Optional)"
                                name="sectionId"
                                value={formData.sectionId}
                                onChange={handleChange}
                                error={!!errors.sectionId}
                                helperText={errors.sectionId}
                                disabled={!formData.classId}
                                sx={inputStyles}
                            >
                                <MenuItem value=""><em>All Sections</em></MenuItem>
                                {sections.map(sec => (
                                    <MenuItem key={sec._id} value={sec._id}>{sec.name}</MenuItem>
                                ))}
                            </TextField>
                            </Box>
                        </Grid>
                    </Grid>
                </SectionBox>
            </Box>
        </CommonModal>
    );
};

export default AssignTeacherModal;
