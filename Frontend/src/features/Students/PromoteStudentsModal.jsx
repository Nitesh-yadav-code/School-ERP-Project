import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { FiArrowUpCircle, FiUsers, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import classService from "../../services/classService";
import sectionService from "../../services/sectionService";
import studentService from "../../services/studentService";

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

const InfoBox = styled(Box)({
    background: "linear-gradient(135deg, #22c55e15 0%, #16a34a15 100%)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "20px",
    border: "1px solid #22c55e30",
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

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

const StudentChip = styled(Chip)({
    margin: "4px",
    backgroundColor: "#667eea15",
    color: "#667eea",
    fontWeight: 500,
});

const PromoteStudentsModal = ({ open, onClose, selectedStudents, currentFilters, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [formData, setFormData] = useState({
        newClassId: "",
        newSectionId: "",
        toAcademicYear: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            fetchClasses();
            setFormData({
                newClassId: "",
                newSectionId: "",
                toAcademicYear: "",
            });
            setSections([]);
            setErrors({});
        }
    }, [open]);

    useEffect(() => {
        if (formData.newClassId) {
            fetchSections(formData.newClassId);
        } else {
            setSections([]);
            setFormData(prev => ({ ...prev, newSectionId: "" }));
        }
    }, [formData.newClassId]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.newClassId) newErrors.newClassId = "Target class is required";
        if (!formData.newSectionId) newErrors.newSectionId = "Target section is required";
        if (!formData.toAcademicYear.trim()) {
            newErrors.toAcademicYear = "Target academic year is required";
        } else if (!/^\d{4}-\d{2}$/.test(formData.toAcademicYear)) {
            newErrors.toAcademicYear = "Format should be YYYY-YY (e.g., 2025-26)";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const studentIds = selectedStudents.map(s => s.studentId);

            await studentService.promoteStudents({
                studentIds,
                fromAcademicYear: currentFilters.academicYear,
                toAcademicYear: formData.toAcademicYear,
                newClassId: formData.newClassId,
                newSectionId: formData.newSectionId,
            });

            toast.success(`${selectedStudents.length} students promoted successfully!`);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error promoting students:", error);
            toast.error(error.response?.data?.message || "Failed to promote students");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title="Promote Students"
            maxWidth="sm"
            actions={
                <Box sx={{ display: "flex", gap: 1.5, width: "100%", justifyContent: "flex-end" }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
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
                            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                            textTransform: "none",
                            px: 3,
                            borderRadius: "10px",
                            fontWeight: 600,
                        }}
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FiCheck size={16} />}
                    >
                        {loading ? "Promoting..." : "Promote Students"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ mt: 2 }}>
                <InfoBox>
                    <FiArrowUpCircle size={24} style={{ color: "#22c55e" }} />
                    <Box>
                        <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                            Promoting {selectedStudents.length} Students
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            From: {currentFilters?.academicYear || "Current Year"}
                        </Typography>
                    </Box>
                </InfoBox>

                {/* Selected Students */}
                <SectionBox>
                    <SectionTitle>
                        <FiUsers size={18} /> Selected Students
                    </SectionTitle>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {selectedStudents.map(student => (
                            <StudentChip
                                key={student._id}
                                label={student.studentName}
                                size="small"
                            />
                        ))}
                    </Box>
                </SectionBox>

                {/* Promotion Target */}
                <SectionBox>
                    <SectionTitle>
                        <FiArrowUpCircle size={18} /> Promote To
                    </SectionTitle>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            fullWidth
                            select
                            label="Target Class *"
                            name="newClassId"
                            value={formData.newClassId}
                            onChange={handleChange}
                            error={!!errors.newClassId}
                            helperText={errors.newClassId}
                            sx={inputStyles}
                        >
                            <MenuItem value=""><em>Select Class</em></MenuItem>
                            {classes.map(cls => (
                                <MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            select
                            label="Target Section *"
                            name="newSectionId"
                            value={formData.newSectionId}
                            onChange={handleChange}
                            error={!!errors.newSectionId}
                            helperText={errors.newSectionId}
                            disabled={!formData.newClassId}
                            sx={inputStyles}
                        >
                            <MenuItem value=""><em>Select Section</em></MenuItem>
                            {sections.map(sec => (
                                <MenuItem key={sec._id} value={sec._id}>{sec.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            label="Target Academic Year *"
                            name="toAcademicYear"
                            value={formData.toAcademicYear}
                            onChange={handleChange}
                            error={!!errors.toAcademicYear}
                            helperText={errors.toAcademicYear || "Format: 2025-26"}
                            placeholder="2025-26"
                            sx={inputStyles}
                        />
                    </Box>
                </SectionBox>
            </Box>
        </CommonModal>
    );
};

export default PromoteStudentsModal;
