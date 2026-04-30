import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import { FiDollarSign, FiCheck, FiCalendar, FiUser, FiList, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import feeService from "../../services/feeService";

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

const FeeItemCard = styled(Box)(({ theme, selected }) => ({
    backgroundColor: selected ? "#667eea10" : "#ffffff",
    borderRadius: "10px",
    padding: "14px 16px",
    marginBottom: "10px",
    border: `1.5px solid ${selected ? "#667eea" : "#e5e7eb"}`,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "&:hover": {
        borderColor: "#667eea",
        boxShadow: "0 2px 8px rgba(102, 126, 234, 0.1)",
    },
}));

const TotalBox = styled(Box)({
    background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
    borderRadius: "12px",
    padding: "16px 20px",
    border: "1px solid #667eea30",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

const FeeAssignmentModal = ({
    open,
    onClose,
    onSuccess,
    studentData = null,
    classId = "",
    academicYear = "",
}) => {
    const [loading, setLoading] = useState(false);
    const [feeStructures, setFeeStructures] = useState([]);
    const [feeLoading, setFeeLoading] = useState(false);
    const [selectedFees, setSelectedFees] = useState([]);
    const [dueDate, setDueDate] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open && classId && academicYear) {
            fetchFeeStructures();
            // Set default due date to 30 days from now
            const defaultDueDate = new Date();
            defaultDueDate.setDate(defaultDueDate.getDate() + 30);
            setDueDate(defaultDueDate.toISOString().split('T')[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, classId, academicYear]);

    useEffect(() => {
        if (!open) {
            setSelectedFees([]);
            setFeeStructures([]);
            setErrors({});
        }
    }, [open]);

    const fetchFeeStructures = async () => {
        setFeeLoading(true);
        try {
            const res = await feeService.getFeeStructures({ classId, academicYear });
            const fees = res.data.feeStructures || [];
            setFeeStructures(fees);
            // Auto-select mandatory fees
            const mandatoryIds = fees
                .filter((f) => f.isMandatory)
                .map((f) => f._id);
            setSelectedFees(mandatoryIds);
        } catch (error) {
            console.error("Error fetching fee structures:", error);
            toast.error("Failed to load fee structures");
        } finally {
            setFeeLoading(false);
        }
    };

    const handleFeeToggle = (feeId) => {
        setSelectedFees((prev) =>
            prev.includes(feeId)
                ? prev.filter((id) => id !== feeId)
                : [...prev, feeId]
        );
    };

    const handleSelectAll = () => {
        if (selectedFees.length === feeStructures.length) {
            // Only keep mandatory fees selected
            const mandatoryIds = feeStructures
                .filter((f) => f.isMandatory)
                .map((f) => f._id);
            setSelectedFees(mandatoryIds);
        } else {
            setSelectedFees(feeStructures.map((f) => f._id));
        }
    };

    const getTotalAmount = () => {
        return feeStructures
            .filter((f) => selectedFees.includes(f._id))
            .reduce((sum, f) => sum + (f.amount || 0), 0);
    };

    const validate = () => {
        const newErrors = {};

        if (selectedFees.length === 0) {
            newErrors.fees = "Please select at least one fee";
        }

        if (!dueDate) {
            newErrors.dueDate = "Due date is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const submitData = {
            studentEnrollmentId: studentData?.enrollmentId,
            feeStructureIds: selectedFees,
            dueDate,
        };

        setLoading(true);
        try {
            await feeService.assignFees(submitData);
            toast.success(`Fees assigned to ${studentData?.studentName} successfully`);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error assigning fees:", error);
            toast.error(error.response?.data?.message || "Failed to assign fees");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedFees([]);
        setErrors({});
        onClose();
    };

    return (
        <CommonModal
            open={open}
            onClose={handleClose}
            title="Assign Fees to Student"
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
                        disabled={loading || selectedFees.length === 0}
                        sx={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            textTransform: "none",
                            px: 3,
                            borderRadius: "10px",
                            fontWeight: 600,
                        }}
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FiCheck size={16} />}
                    >
                        {loading ? "Assigning..." : "Assign Fees"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ mt: 2 }}>
                {/* Student Info */}
                <SectionBox>
                    <SectionTitle>
                        <FiUser size={18} /> Student Information
                    </SectionTitle>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <Box sx={{ flex: 1, minWidth: 150 }}>
                            <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                Student Name
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: "#1f2937" }}>
                                {studentData?.studentName || "-"}
                            </Typography>
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 100 }}>
                            <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                Roll Number
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: "#1f2937" }}>
                                {studentData?.rollNumber || "-"}
                            </Typography>
                        </Box>
                    </Box>
                </SectionBox>

                {/* Due Date */}
                <SectionBox>
                    <SectionTitle>
                        <FiCalendar size={18} /> Due Date
                    </SectionTitle>
                    <TextField
                        fullWidth
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        error={!!errors.dueDate}
                        helperText={errors.dueDate}
                        sx={{ ...inputStyles, maxWidth: 250 }}
                        InputLabelProps={{ shrink: true }}
                    />
                </SectionBox>

                {/* Fee Structures Selection */}
                <SectionBox>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <SectionTitle sx={{ mb: 0 }}>
                            <FiList size={18} /> Select Fee Types
                        </SectionTitle>
                        <Button
                            size="small"
                            onClick={handleSelectAll}
                            sx={{ textTransform: "none", color: "#667eea" }}
                        >
                            {selectedFees.length === feeStructures.length ? "Deselect Optional" : "Select All"}
                        </Button>
                    </Box>

                    {errors.fees && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, color: "#dc2626" }}>
                            <FiAlertCircle size={14} />
                            <Typography variant="caption">{errors.fees}</Typography>
                        </Box>
                    )}

                    {feeLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress size={32} sx={{ color: "#667eea" }} />
                        </Box>
                    ) : feeStructures.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 4, color: "#6b7280" }}>
                            <FiDollarSign size={32} style={{ opacity: 0.5, marginBottom: 8 }} />
                            <Typography variant="body2">
                                No fee structures found for this class and academic year.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ maxHeight: 280, overflowY: "auto", pr: 1 }}>
                                {feeStructures.map((fee) => (
                                    <FeeItemCard
                                        key={fee._id}
                                        selected={selectedFees.includes(fee._id)}
                                        onClick={() => handleFeeToggle(fee._id)}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Checkbox
                                                checked={selectedFees.includes(fee._id)}
                                                onChange={() => handleFeeToggle(fee._id)}
                                                sx={{
                                                    color: "#d1d5db",
                                                    p: 0,
                                                    "&.Mui-checked": { color: "#667eea" },
                                                }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="body1"
                                                    sx={{ fontWeight: 500, color: "#1f2937" }}
                                                >
                                                    {fee.name}
                                                </Typography>
                                                <Chip
                                                    label={fee.isMandatory ? "Mandatory" : "Optional"}
                                                    size="small"
                                                    sx={{
                                                        mt: 0.5,
                                                        height: 20,
                                                        fontSize: "0.7rem",
                                                        bgcolor: fee.isMandatory ? "#22c55e15" : "#f59e0b15",
                                                        color: fee.isMandatory ? "#16a34a" : "#d97706",
                                                        border: `1px solid ${fee.isMandatory ? "#22c55e30" : "#f59e0b30"}`,
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 600, color: "#667eea" }}
                                        >
                                            ₹{fee.amount?.toLocaleString()}
                                        </Typography>
                                    </FeeItemCard>
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Total Amount */}
                            <TotalBox>
                                <Typography variant="body1" sx={{ fontWeight: 500, color: "#374151" }}>
                                    Total Amount ({selectedFees.length} fee{selectedFees.length !== 1 ? "s" : ""})
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    ₹{getTotalAmount().toLocaleString()}
                                </Typography>
                            </TotalBox>
                        </>
                    )}
                </SectionBox>
            </Box>
        </CommonModal>
    );
};

export default FeeAssignmentModal;
