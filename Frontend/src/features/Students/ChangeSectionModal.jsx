import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { FiRepeat, FiUser, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
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

const StudentInfoBox = styled(Box)({
    background: "linear-gradient(135deg, #f59e0b15 0%, #d9730615 100%)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "20px",
    border: "1px solid #f59e0b30",
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

const ChangeSectionModal = ({ open, onClose, enrollment, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [sections, setSections] = useState([]);
    const [newSectionId, setNewSectionId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (open && enrollment?.enrollmentData?.classId) {
            const classId = enrollment.enrollmentData.classId._id || enrollment.enrollmentData.classId;
            fetchSections(classId);
            setNewSectionId("");
            setError("");
        }
    }, [open, enrollment]);

    const fetchSections = async (classId) => {
        try {
            const res = await sectionService.getSectionsByClass(classId);
            setSections(res.data.sections || []);
        } catch (error) {
            console.error("Error fetching sections:", error);
            toast.error("Failed to load sections");
        }
    };

    const handleSubmit = async () => {
        if (!newSectionId) {
            setError("Please select a new section");
            return;
        }

        setLoading(true);
        try {
            await studentService.changeSection({
                enrollmentId: enrollment._id,
                newSectionId: newSectionId,
            });

            toast.success("Section changed successfully!");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error changing section:", error);
            toast.error(error.response?.data?.message || "Failed to change section");
        } finally {
            setLoading(false);
        }
    };

    const studentName = enrollment?.studentName || "Student";
    const currentSection = enrollment?.sectionName || "-";

    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title="Change Section"
            maxWidth="xs"
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
                            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                            textTransform: "none",
                            px: 3,
                            borderRadius: "10px",
                            fontWeight: 600,
                        }}
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FiCheck size={16} />}
                    >
                        {loading ? "Saving..." : "Change Section"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ mt: 2 }}>
                <StudentInfoBox>
                    <FiUser size={24} style={{ color: "#f59e0b" }} />
                    <Box>
                        <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                            {studentName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            Current Section: <strong>{currentSection}</strong>
                        </Typography>
                    </Box>
                </StudentInfoBox>

                <TextField
                    fullWidth
                    select
                    label="New Section *"
                    value={newSectionId}
                    onChange={(e) => {
                        setNewSectionId(e.target.value);
                        setError("");
                    }}
                    error={!!error}
                    helperText={error}
                    sx={inputStyles}
                >
                    <MenuItem value=""><em>Select New Section</em></MenuItem>
                    {sections.map(sec => (
                        <MenuItem key={sec._id} value={sec._id}>{sec.name}</MenuItem>
                    ))}
                </TextField>
            </Box>
        </CommonModal>
    );
};

export default ChangeSectionModal;
