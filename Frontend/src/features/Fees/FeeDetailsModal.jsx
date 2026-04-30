import React, { useState } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import {
    FiUser,
    FiDollarSign,
    FiEdit,
    FiTrash2,
    FiCalendar,
    FiCheck,
    FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import feeService from "../../services/feeService";
import ConfirmModal from "../../commonComponents/ConfirmModal";

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

const FeeItemCard = styled(Box)(({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case "paid":
                return { bg: "#22c55e08", border: "#22c55e30" };
            case "partial":
                return { bg: "#f59e0b08", border: "#f59e0b30" };
            default:
                return { bg: "#ffffff", border: "#e5e7eb" };
        }
    };
    const colors = getStatusColor();
    return {
        backgroundColor: colors.bg,
        borderRadius: "10px",
        padding: "14px 16px",
        marginBottom: "10px",
        border: `1.5px solid ${colors.border}`,
        transition: "all 0.2s ease",
    };
});

const StatusChip = ({ status }) => {
    const getStyles = () => {
        switch (status) {
            case "paid":
                return { bgcolor: "#22c55e15", color: "#16a34a", border: "1px solid #22c55e30" };
            case "partial":
                return { bgcolor: "#f59e0b15", color: "#d97706", border: "1px solid #f59e0b30" };
            case "pending":
                return { bgcolor: "#ef444415", color: "#dc2626", border: "1px solid #ef444430" };
            default:
                return { bgcolor: "#6b728015", color: "#6b7280", border: "1px solid #6b728030" };
        }
    };

    return (
        <Chip
            label={status?.charAt(0).toUpperCase() + status?.slice(1)}
            size="small"
            sx={{ fontWeight: 500, height: 22, fontSize: "0.75rem", ...getStyles() }}
        />
    );
};

const SummaryBox = styled(Box)({
    background: "linear-gradient(135deg, #667eea08 0%, #764ba208 100%)",
    borderRadius: "12px",
    padding: "16px 20px",
    border: "1px solid #667eea20",
});

const SummaryItem = ({ label, value, color = "#374151", highlight = false }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
            {label}
        </Typography>
        <Typography
            variant="body2"
            sx={{
                fontWeight: highlight ? 700 : 600,
                color,
                fontSize: highlight ? "1.1rem" : "0.875rem",
            }}
        >
            {value}
        </Typography>
    </Box>
);

const inputStyles = {
    "& .MuiOutlinedInput-root": {
        bgcolor: "#ffffff",
        color: "#374151",
        borderRadius: "8px",
        "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
        "&:hover fieldset": { borderColor: "#667eea" },
        "&.Mui-focused fieldset": { borderColor: "#667eea" },
    },
    "& .MuiInputLabel-root": { color: "#6b7280" },
};

const FeeDetailsModal = ({ open, onClose, studentData = null, onSuccess }) => {
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [loading, setLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);

    const fees = studentData?.fees || [];

    const handleEdit = (fee) => {
        setEditingId(fee._id);
        setEditValues({
            amount: fee.amount || 0,
            dueDate: fee.dueDate?.split("T")[0] || "",
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditValues({});
    };

    const handleSaveEdit = async (feeId) => {
        setLoading(true);
        try {
            await feeService.updateFeeAssignment(feeId, {
                amount: Number(editValues.amount),
                dueDate: editValues.dueDate,
            });
            toast.success("Fee assignment updated successfully");
            setEditingId(null);
            setEditValues({});
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error updating fee:", error);
            toast.error(error.response?.data?.message || "Failed to update fee");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (fee) => {
        setSelectedFee(fee);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedFee) return;
        setLoading(true);
        try {
            await feeService.deleteFeeAssignment(selectedFee._id);
            toast.success("Fee assignment deleted successfully");
            setDeleteModalOpen(false);
            setSelectedFee(null);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error deleting fee:", error);
            toast.error(error.response?.data?.message || "Failed to delete fee");
        } finally {
            setLoading(false);
        }
    };

    const totalDue = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
    const totalPaid = fees.reduce((sum, f) => (f.status === "paid" ? sum + (f.amount || 0) : sum), 0);
    const balance = totalDue - totalPaid;

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <>
            <CommonModal
                open={open}
                onClose={onClose}
                title="Fee Details"
                maxWidth="sm"
                actions={
                    <Box sx={{ display: "flex", gap: 1.5, width: "100%", justifyContent: "flex-end" }}>
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
                    </Box>
                }
            >
                <Box sx={{ mt: 2 }}>
                    {/* Student Info */}
                    <SectionBox>
                        <SectionTitle>
                            <FiUser size={18} /> Student Information
                        </SectionTitle>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                    Student Name
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: "#1f2937" }}>
                                    {studentData?.studentName || "-"}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                    Roll Number
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: "#1f2937" }}>
                                    {studentData?.rollNumber || "-"}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                    Overall Status
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <StatusChip status={studentData?.status} />
                                </Box>
                            </Box>
                        </Box>
                    </SectionBox>

                    {/* Assigned Fees List */}
                    <SectionBox>
                        <SectionTitle>
                            <FiDollarSign size={18} /> Assigned Fees ({fees.length})
                        </SectionTitle>

                        {fees.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 4, color: "#6b7280" }}>
                                <FiDollarSign size={32} style={{ opacity: 0.5, marginBottom: 8 }} />
                                <Typography variant="body2">No fees assigned to this student.</Typography>
                            </Box>
                        ) : (
                            <Box sx={{ maxHeight: 320, overflowY: "auto", pr: 0.5 }}>
                                {fees.map((fee) => (
                                    <FeeItemCard key={fee._id} status={fee.status}>
                                        {editingId === fee._id ? (
                                            // Edit Mode
                                            <Box>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                                                    <Typography sx={{ fontWeight: 600, color: "#1f2937" }}>
                                                        {fee.feeStructureId?.name || "Fee"}
                                                    </Typography>
                                                    <Box sx={{ display: "flex", gap: 0.5 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleSaveEdit(fee._id)}
                                                            disabled={loading}
                                                            sx={{ color: "#16a34a" }}
                                                        >
                                                            {loading ? (
                                                                <CircularProgress size={16} />
                                                            ) : (
                                                                <FiCheck size={16} />
                                                            )}
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleCancelEdit}
                                                            sx={{ color: "#dc2626" }}
                                                        >
                                                            <FiX size={16} />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", gap: 2 }}>
                                                    <TextField
                                                        label="Amount"
                                                        type="number"
                                                        size="small"
                                                        value={editValues.amount}
                                                        onChange={(e) =>
                                                            setEditValues((prev) => ({
                                                                ...prev,
                                                                amount: e.target.value,
                                                            }))
                                                        }
                                                        sx={{ ...inputStyles, flex: 1 }}
                                                    />
                                                    <TextField
                                                        label="Due Date"
                                                        type="date"
                                                        size="small"
                                                        value={editValues.dueDate}
                                                        onChange={(e) =>
                                                            setEditValues((prev) => ({
                                                                ...prev,
                                                                dueDate: e.target.value,
                                                            }))
                                                        }
                                                        sx={{ ...inputStyles, flex: 1 }}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Box>
                                            </Box>
                                        ) : (
                                            // View Mode
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 600, color: "#1f2937", mb: 0.5 }}>
                                                        {fee.feeStructureId?.name || "Fee"}
                                                    </Typography>
                                                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                                        <Typography variant="caption" sx={{ color: "#6b7280", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                            <FiCalendar size={12} />
                                                            Due: {formatDate(fee.dueDate)}
                                                        </Typography>
                                                        <StatusChip status={fee.status} />
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Typography sx={{ fontWeight: 700, color: "#667eea", fontSize: "1rem" }}>
                                                        ₹{fee.amount?.toLocaleString()}
                                                    </Typography>
                                                    {fee.status !== "paid" && (
                                                        <Box sx={{ display: "flex", gap: 0 }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEdit(fee)}
                                                                title="Edit"
                                                            >
                                                                <FiEdit size={14} style={{ color: "#3b82f6" }} />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDeleteClick(fee)}
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 size={14} style={{ color: "#ef4444" }} />
                                                            </IconButton>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                    </FeeItemCard>
                                ))}
                            </Box>
                        )}
                    </SectionBox>

                    {/* Summary */}
                    {fees.length > 0 && (
                        <SummaryBox>
                            <SummaryItem label="Total Due" value={`₹${totalDue.toLocaleString()}`} />
                            <SummaryItem label="Total Paid" value={`₹${totalPaid.toLocaleString()}`} color="#16a34a" />
                            <Divider sx={{ my: 1 }} />
                            <SummaryItem
                                label="Balance"
                                value={`₹${balance.toLocaleString()}`}
                                color={balance > 0 ? "#dc2626" : "#16a34a"}
                                highlight
                            />
                        </SummaryBox>
                    )}
                </Box>
            </CommonModal>

            {/* Delete Confirmation */}
            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedFee(null);
                }}
                onConfirm={confirmDelete}
                action="Delete"
                title="Delete Fee Assignment"
                message={`Are you sure you want to delete "${selectedFee?.feeStructureId?.name || "this fee"}" assignment?`}
            />
        </>
    );
};

export default FeeDetailsModal;
