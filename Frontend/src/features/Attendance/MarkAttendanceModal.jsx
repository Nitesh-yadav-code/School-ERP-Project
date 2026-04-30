import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import {
  FiCheck,
  FiX,
  FiMinus,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import classService from "../../services/classService";
import sectionService from "../../services/sectionService";
import studentService from "../../services/studentService";
import attendanceService from "../../services/attendanceService";

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

const StudentCard = styled(Box)(({ status }) => {
  const getColors = () => {
    switch (status) {
      case "Present":
        return { bg: "#f0fdf4", border: "#86efac" };
      case "Absent":
        return { bg: "#fef2f2", border: "#fca5a5" };
      case "Leave":
        return { bg: "#fffbeb", border: "#fcd34d" };
      default:
        return { bg: "#f9fafb", border: "#e5e7eb" };
    }
  };
  const colors = getColors();
  return {
    backgroundColor: colors.bg,
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "8px",
    border: `1.5px solid ${colors.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.2s ease",
  };
});

const StatusButton = styled(IconButton)(({ active, variant }) => {
  const colors = {
    Present: { bg: "#22c55e", hover: "#16a34a" },
    Absent: { bg: "#ef4444", hover: "#dc2626" },
    Leave: { bg: "#f59e0b", hover: "#d97706" },
  };
  const color = colors[variant] || colors.Present;
  return {
    width: 36,
    height: 36,
    backgroundColor: active ? color.bg : "#e5e7eb",
    color: active ? "#ffffff" : "#6b7280",
    "&:hover": {
      backgroundColor: active ? color.hover : "#d1d5db",
    },
  };
});

const SummaryChip = styled(Chip)(({ variant }) => {
  const colors = {
    total: { bg: "#667eea15", color: "#667eea", border: "#667eea30" },
    present: { bg: "#22c55e15", color: "#16a34a", border: "#22c55e30" },
    absent: { bg: "#ef444415", color: "#dc2626", border: "#ef444430" },
    leave: { bg: "#f59e0b15", color: "#d97706", border: "#f59e0b30" },
  };
  const c = colors[variant] || colors.total;
  return {
    backgroundColor: c.bg,
    color: c.color,
    border: `1px solid ${c.border}`,
    fontWeight: 600,
  };
});

const MarkAttendanceModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [formData, setFormData] = useState({
    classId: "",
    sectionId: "",
    date: new Date().toISOString().split("T")[0],
    academicYear: "",
  });

  // Attendance state: { enrollmentId: status }
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    if (open) {
      fetchClasses();
      // Reset state
      setFormData({
        classId: "",
        sectionId: "",
        date: new Date().toISOString().split("T")[0],
        academicYear: "",
      });
      setEnrollments([]);
      setAttendance({});
    }
  }, [open]);

  useEffect(() => {
    if (formData.classId) {
      fetchSections(formData.classId);
    } else {
      setSections([]);
      setFormData((prev) => ({ ...prev, sectionId: "" }));
    }
  }, [formData.classId]);

  useEffect(() => {
    if (formData.classId && formData.sectionId && formData.academicYear) {
      fetchEnrollments();
    } else {
      setEnrollments([]);
      setAttendance({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.classId, formData.sectionId, formData.academicYear]);

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
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error("Failed to load sections");
    }
  };

  const fetchEnrollments = async () => {
    setFetchingStudents(true);
    try {
      const res = await studentService.getEnrolledStudents({
        classId: formData.classId,
        sectionId: formData.sectionId,
        academicYear: formData.academicYear,
      });

      const enrollmentList = res.data.enrollments || [];
      setEnrollments(enrollmentList);

      // Initialize all students as Present by default
      const initialAttendance = {};
      enrollmentList.forEach((e) => {
        initialAttendance[e._id] = "Present";
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast.error("Failed to load students");
    } finally {
      setFetchingStudents(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (enrollmentId, status) => {
    setAttendance((prev) => ({ ...prev, [enrollmentId]: status }));
  };

  const handleMarkAll = (status) => {
    const newAttendance = {};
    enrollments.forEach((e) => {
      newAttendance[e._id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    if (
      !formData.classId ||
      !formData.sectionId ||
      !formData.academicYear ||
      !formData.date
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (enrollments.length === 0) {
      toast.error("No students found to mark attendance");
      return;
    }

    setLoading(true);
    try {
      const enrollmentData = Object.entries(attendance).map(
        ([studentEnrollmentId, status]) => ({
          studentEnrollmentId,
          status,
        }),
      );

      const payload = {
        date: formData.date,
        enrollments: enrollmentData,
      };

      await attendanceService.markAttendance(payload);
      toast.success("Attendance marked successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      classId: "",
      sectionId: "",
      date: new Date().toISOString().split("T")[0],
      academicYear: "",
    });
    setEnrollments([]);
    setAttendance({});
    onClose();
  };

  // Calculate summary
  const getSummary = () => {
    const values = Object.values(attendance);
    return {
      total: values.length,
      present: values.filter((v) => v === "Present").length,
      absent: values.filter((v) => v === "Absent").length,
      leave: values.filter((v) => v === "Leave").length,
    };
  };

  const summary = getSummary();

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Mark Attendance"
      maxWidth="md"
      actions={
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
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
            disabled={loading || enrollments.length === 0}
            sx={{
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              textTransform: "none",
              px: 3,
              borderRadius: "10px",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(34, 197, 94, 0.35)",
            }}
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <FiCheck size={16} />
              )
            }
          >
            {loading ? "Saving..." : "Save Attendance"}
          </Button>
        </Box>
      }
    >
      <Box sx={{ mt: 2 }}>
        {/* Filters Section */}
        <SectionBox>
          <SectionTitle>
            <FiCalendar size={18} /> Select Class & Date
          </SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ flex: "1 1 180px", minWidth: 160 }}>
                <TextField
                  fullWidth
                  select
                  label="Class *"
                  name="classId"
                  value={formData.classId || ""}
                  onChange={handleChange}
                  size="small"
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
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ flex: "1 1 180px", minWidth: 160 }}>
                <TextField
                  fullWidth
                  select
                  label="Section *"
                  name="sectionId"
                  value={formData.sectionId || ""}
                  onChange={handleChange}
                  size="small"
                >
                  <MenuItem value="">
                    <em>Select Section</em>
                  </MenuItem>
                  {sections.map((sec) => (
                    <MenuItem key={sec._id} value={sec._id}>
                      {sec.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Academic Year *"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="2024-25"
                size="small"
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Date *"
                name="date"
                value={formData.date}
                onChange={handleChange}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={inputStyles}
              />
            </Grid>
          </Grid>
        </SectionBox>

        {/* Students List Section */}
        <SectionBox>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <SectionTitle sx={{ mb: 0 }}>
              <FiUsers size={18} /> Students ({enrollments.length})
            </SectionTitle>

            {enrollments.length > 0 && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Mark All Present" arrow>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleMarkAll("Present")}
                    sx={{
                      color: "#16a34a",
                      borderColor: "#22c55e50",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#22c55e",
                        bgcolor: "#22c55e10",
                      },
                    }}
                    startIcon={<FiCheckCircle size={14} />}
                  >
                    All Present
                  </Button>
                </Tooltip>
                <Tooltip title="Mark All Absent" arrow>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleMarkAll("Absent")}
                    sx={{
                      color: "#dc2626",
                      borderColor: "#ef444450",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#ef4444",
                        bgcolor: "#ef444410",
                      },
                    }}
                    startIcon={<FiXCircle size={14} />}
                  >
                    All Absent
                  </Button>
                </Tooltip>
              </Box>
            )}
          </Box>

          {/* Summary */}
          {enrollments.length > 0 && (
            <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
              <SummaryChip
                variant="total"
                label={`Total: ${summary.total}`}
                size="small"
              />
              <SummaryChip
                variant="present"
                label={`Present: ${summary.present}`}
                size="small"
              />
              <SummaryChip
                variant="absent"
                label={`Absent: ${summary.absent}`}
                size="small"
              />
              <SummaryChip
                variant="leave"
                label={`Leave: ${summary.leave}`}
                size="small"
              />
            </Box>
          )}

          {fetchingStudents ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={32} sx={{ color: "#667eea" }} />
            </Box>
          ) : enrollments.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4, color: "#6b7280" }}>
              <FiUsers size={32} style={{ opacity: 0.5, marginBottom: 8 }} />
              <Typography variant="body2">
                {formData.classId && formData.sectionId && formData.academicYear
                  ? "No students found for this selection"
                  : "Select class, section, and academic year to load students"}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ maxHeight: 380, overflowY: "auto", pr: 0.5 }}>
              {enrollments.map((enrollment, index) => (
                <StudentCard
                  key={enrollment._id}
                  status={attendance[enrollment._id]}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "8px",
                        bgcolor: "#667eea15",
                        color: "#667eea",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: "#1f2937" }}>
                        {enrollment.studentId?.firstName}{" "}
                        {enrollment.studentId?.lastName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        Roll No: {enrollment.rollNumber || "-"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Present" arrow>
                      <StatusButton
                        variant="Present"
                        active={attendance[enrollment._id] === "Present"}
                        onClick={() =>
                          handleStatusChange(enrollment._id, "Present")
                        }
                      >
                        <FiCheck size={18} />
                      </StatusButton>
                    </Tooltip>
                    <Tooltip title="Absent" arrow>
                      <StatusButton
                        variant="Absent"
                        active={attendance[enrollment._id] === "Absent"}
                        onClick={() =>
                          handleStatusChange(enrollment._id, "Absent")
                        }
                      >
                        <FiX size={18} />
                      </StatusButton>
                    </Tooltip>
                    <Tooltip title="Leave" arrow>
                      <StatusButton
                        variant="Leave"
                        active={attendance[enrollment._id] === "Leave"}
                        onClick={() =>
                          handleStatusChange(enrollment._id, "Leave")
                        }
                      >
                        <FiMinus size={18} />
                      </StatusButton>
                    </Tooltip>
                  </Box>
                </StudentCard>
              ))}
            </Box>
          )}
        </SectionBox>
      </Box>
    </CommonModal>
  );
};

export default MarkAttendanceModal;
