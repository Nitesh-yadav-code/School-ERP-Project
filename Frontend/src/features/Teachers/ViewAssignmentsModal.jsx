import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { FiUser, FiBook, FiCalendar, FiLayers, FiRefreshCw } from "react-icons/fi";
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
};

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

const AssignmentCard = styled(Box)({
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "12px",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.2s ease",
    "&:hover": {
        borderColor: "#667eea50",
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.1)",
    },
});

const EmptyState = styled(Box)({
    textAlign: "center",
    padding: "40px 20px",
    color: "#6b7280",
});

const ViewAssignmentsModal = ({ open, onClose, teacher }) => {
    const [loading, setLoading] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [academicYear, setAcademicYear] = useState("");

    useEffect(() => {
        if (open && teacher) {
            // Reset state when modal opens
            setAcademicYear("");
            setAssignments([]);
        }
    }, [open, teacher]);

    const fetchAssignments = async () => {
        if (!academicYear.trim()) {
            toast.warning("Please enter academic year");
            return;
        }

        setLoading(true);
        try {
            const res = await teacherService.getTeacherAssignments({
                teacherId: teacher._id,
                academicYear: academicYear.trim(),
            });
            setAssignments(res.data.assignments || []);
            if ((res.data.assignments || []).length === 0) {
                toast.info("No assignments found for this academic year");
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
            toast.error(error.response?.data?.message || "Failed to fetch assignments");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAcademicYear("");
        setAssignments([]);
        onClose();
    };

    return (
        <CommonModal
            open={open}
            onClose={handleClose}
            title="Teacher Assignments"
            maxWidth="sm"
            actions={
                <Box sx={{ display: "flex", gap: 1.5, width: "100%", justifyContent: "flex-end" }}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        sx={{
                            color: "#374151",
                            borderColor: "#d1d5db",
                            textTransform: "none",
                            px: 3,
                            borderRadius: "10px",
                        }}
                    >
                        Close
                    </Button>
                </Box>
            }
        >
            <Box sx={{ mt: 2 }}>
                {/* Teacher Info */}
                <TeacherInfoBox>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                        }}
                    >
                        <FiUser size={24} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                            {teacher?.name || "Teacher"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            {teacher?.email || "View all class and subject assignments"}
                        </Typography>
                    </Box>
                </TeacherInfoBox>

                {/* Academic Year Filter */}
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <TextField
                        label="Academic Year *"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        placeholder="2024-25"
                        size="small"
                        sx={{ ...inputStyles, flex: 1 }}
                        InputProps={{
                            startAdornment: (
                                <FiCalendar size={16} style={{ marginRight: 8, color: "#6b7280" }} />
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={fetchAssignments}
                        disabled={loading || !academicYear.trim()}
                        sx={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            textTransform: "none",
                            borderRadius: "10px",
                            fontWeight: 600,
                            px: 3,
                            minWidth: 120,
                        }}
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FiRefreshCw size={16} />}
                    >
                        {loading ? "Loading..." : "Fetch"}
                    </Button>
                </Box>

                {/* Assignments List */}
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress size={32} sx={{ color: "#667eea" }} />
                        </Box>
                    ) : assignments.length > 0 ? (
                        <>
                            <Typography variant="body2" sx={{ color: "#6b7280", mb: 2, fontWeight: 500 }}>
                                Found {assignments.length} assignment{assignments.length > 1 ? "s" : ""}
                            </Typography>
                            {assignments.map((assignment, index) => (
                                <AssignmentCard key={assignment._id || index}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: "10px",
                                                bgcolor: "#667eea15",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#667eea",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {index + 1}
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                                                {assignment.classSubjectId?.subjectId?.name || "Subject"}
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                                <Chip
                                                    icon={<FiLayers size={12} />}
                                                    label={assignment.classSubjectId?.classId?.name || "Class"}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: "#3b82f615",
                                                        color: "#3b82f6",
                                                        border: "1px solid #3b82f630",
                                                        fontWeight: 500,
                                                        "& .MuiChip-icon": { color: "#3b82f6" },
                                                    }}
                                                />
                                                {assignment.sectionId && (
                                                    <Chip
                                                        label={`Section ${assignment.sectionId?.name || "-"}`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: "#22c55e15",
                                                            color: "#16a34a",
                                                            border: "1px solid #22c55e30",
                                                            fontWeight: 500,
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Chip
                                        icon={<FiBook size={12} />}
                                        label={assignment.academicYear || academicYear}
                                        size="small"
                                        sx={{
                                            bgcolor: "#8b5cf615",
                                            color: "#7c3aed",
                                            border: "1px solid #8b5cf630",
                                            fontWeight: 500,
                                            "& .MuiChip-icon": { color: "#7c3aed" },
                                        }}
                                    />
                                </AssignmentCard>
                            ))}
                        </>
                    ) : academicYear ? (
                        <EmptyState>
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: "16px",
                                    background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                    mb: 2,
                                }}
                            >
                                <FiBook size={28} style={{ color: "#667eea" }} />
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>
                                No Assignments Found
                            </Typography>
                            <Typography variant="body2">
                                This teacher has no assignments for the selected academic year.
                            </Typography>
                        </EmptyState>
                    ) : (
                        <EmptyState>
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: "16px",
                                    background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                    mb: 2,
                                }}
                            >
                                <FiCalendar size={28} style={{ color: "#667eea" }} />
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: "#374151", mb: 1 }}>
                                Enter Academic Year
                            </Typography>
                            <Typography variant="body2">
                                Enter the academic year (e.g., 2024-25) to view assignments.
                            </Typography>
                        </EmptyState>
                    )}
                </Box>
            </Box>
        </CommonModal>
    );
};

export default ViewAssignmentsModal;
