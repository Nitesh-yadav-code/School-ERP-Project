import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { FiUser, FiCalendar, FiBook, FiLayers } from "react-icons/fi";
import { toast } from "react-toastify";
import studentService from "../../services/studentService";

const StudentInfoBox = styled(Box)({
    background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "20px",
    border: "1px solid #667eea30",
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

const HistoryItem = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    marginBottom: "12px",
    border: "1px solid #e5e7eb",
    transition: "box-shadow 0.2s",
    "&:hover": {
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
});

const InfoBadge = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#6b7280",
    fontSize: "0.875rem",
});

const EnrollmentHistoryModal = ({ open, onClose, student }) => {
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (open && student?._id) {
            fetchHistory(student._id);
        }
    }, [open, student]);

    const fetchHistory = async (studentId) => {
        setLoading(true);
        try {
            const res = await studentService.getEnrollmentHistory(studentId);
            setHistory(res.data.history || []);
        } catch (error) {
            console.error("Error fetching enrollment history:", error);
            toast.error("Failed to load enrollment history");
        } finally {
            setLoading(false);
        }
    };

    const studentName = student
        ? `${student.firstName || ""} ${student.lastName || ""}`.trim()
        : "Student";

    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title="Enrollment History"
            maxWidth="sm"
            actions={
                <Button
                    variant="outlined"
                    onClick={onClose}
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
            }
        >
            <Box sx={{ mt: 2 }}>
                <StudentInfoBox>
                    <FiUser size={24} style={{ color: "#667eea" }} />
                    <Box>
                        <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                            {studentName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            Complete enrollment history
                        </Typography>
                    </Box>
                </StudentInfoBox>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress sx={{ color: "#667eea" }} />
                    </Box>
                ) : history.length > 0 ? (
                    <Box>
                        {history.map((item, index) => (
                            <HistoryItem key={item._id || index}>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                                            {item.classId?.name || "Class"}
                                        </Typography>
                                        <Typography sx={{ color: "#6b7280" }}>-</Typography>
                                        <Typography sx={{ fontWeight: 500, color: "#374151" }}>
                                            {item.sectionId?.name || "Section"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                        <InfoBadge>
                                            <FiCalendar size={14} />
                                            {item.academicYear}
                                        </InfoBadge>
                                        {item.rollNumber && (
                                            <InfoBadge>
                                                Roll: {item.rollNumber}
                                            </InfoBadge>
                                        )}
                                    </Box>
                                </Box>
                                <Chip
                                    label={item.isActive ? "Active" : "Past"}
                                    size="small"
                                    sx={{
                                        bgcolor: item.isActive ? "#22c55e20" : "#6b728020",
                                        color: item.isActive ? "#16a34a" : "#6b7280",
                                        fontWeight: 500,
                                    }}
                                />
                            </HistoryItem>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: "center", py: 4, color: "#6b7280" }}>
                        <FiLayers size={40} style={{ opacity: 0.5 }} />
                        <Typography sx={{ mt: 2 }}>No enrollment history found</Typography>
                    </Box>
                )}
            </Box>
        </CommonModal>
    );
};

export default EnrollmentHistoryModal;
