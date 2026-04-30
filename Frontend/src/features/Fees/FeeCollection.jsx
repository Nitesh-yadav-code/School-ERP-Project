import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import { FiDollarSign, FiUser, FiCalendar, FiCreditCard, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import feeService from "../../services/feeService";
import classService from "../../services/classService";
import sectionService from "../../services/sectionService";
import studentService from "../../services/studentService";

const CollectionCard = styled(Card)({
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    maxWidth: 700,
    margin: "0 auto",
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

const SubmitButton = styled(Button)({
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "#ffffff",
    textTransform: "none",
    borderRadius: "10px",
    fontWeight: 600,
    padding: "12px 24px",
    fontSize: "1rem",
    boxShadow: "0 4px 14px rgba(34, 197, 94, 0.35)",
    "&:hover": {
        background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    },
});

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

const FeeCollection = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);

    const [formData, setFormData] = useState({
        classId: "",
        sectionId: "",
        studentId: "",
        month: new Date().toISOString().slice(0, 7),
        amountPaid: "",
        paymentMode: "cash",
        receiptNo: "",
        remarks: "",
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (formData.classId) {
            fetchSections(formData.classId);
        } else {
            setSections([]);
        }
    }, [formData.classId]);

    useEffect(() => {
        if (formData.classId && formData.sectionId) {
            fetchStudents(formData.classId, formData.sectionId);
        } else {
            setStudents([]);
        }
    }, [formData.classId, formData.sectionId]);

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
        }
    };

    const fetchStudents = async (classId, sectionId) => {
        try {
            const res = await studentService.getStudents({ classId, sectionId });
            setStudents(res.data.students || []);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.studentId || !formData.amountPaid || !formData.month) {
            toast.error("Please fill all required fields");
            return;
        }

        setLoading(true);
        try {
            await feeService.payFees(formData);
            toast.success("Fee collected successfully!");
            setFormData({
                ...formData,
                amountPaid: "",
                receiptNo: "",
                remarks: "",
            });
        } catch (error) {
            console.error("Error collecting fee:", error);
            toast.error(error.response?.data?.message || "Failed to collect fee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CollectionCard>
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Box sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                    }}>
                        <FiDollarSign size={20} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>
                            Collect Fees
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            Record fee payment from students
                        </Typography>
                    </Box>
                </Box>

                {/* Student Selection */}
                <SectionBox>
                    <SectionTitle>
                        <FiUser size={18} /> Select Student
                    </SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ flex: "1 1 180px", minWidth: 160 }}>
                            <TextField
                                fullWidth
                                select
                                label="Class *"
                                name="classId"
                                value={formData.classId}
                                onChange={handleChange}
                                size="small"
                                sx={inputStyles}
                            >
                                <MenuItem value=""><em>Select Class</em></MenuItem>
                                {classes.map((cls) => (
                                    <MenuItem key={cls._id} value={cls._id}>
                                        {cls.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                             <Box sx={{ flex: "1 1 180px", minWidth: 160 }}>
                            <TextField
                                fullWidth
                                select
                                label="Section *"
                                name="sectionId"
                                value={formData.sectionId}
                                onChange={handleChange}
                                size="small"
                                disabled={!formData.classId}
                                sx={inputStyles}
                            >
                                <MenuItem value=""><em>Select Section</em></MenuItem>
                                {sections.map((sec) => (
                                    <MenuItem key={sec._id} value={sec._id}>
                                        {sec.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ flex: "1 1 180px", minWidth: 160 }}>
                            <TextField
                                fullWidth
                                select
                                label="Student *"
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                size="small"
                                disabled={!formData.sectionId}
                                sx={inputStyles}
                            >
                                <MenuItem value=""><em>Select Student</em></MenuItem>
                                {students.map((stu) => (
                                    <MenuItem key={stu._id} value={stu._id}>
                                        {stu.firstName} {stu.lastName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            </Box>
                        </Grid>
                    </Grid>
                </SectionBox>

                {/* Payment Details */}
                <SectionBox>
                    <SectionTitle>
                        <FiCreditCard size={18} /> Payment Details
                    </SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Month *"
                                name="month"
                                type="month"
                                value={formData.month}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                sx={inputStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FiCalendar size={16} style={{ color: "#9ca3af" }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Amount Paid *"
                                name="amountPaid"
                                type="number"
                                value={formData.amountPaid}
                                onChange={handleChange}
                                sx={inputStyles}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography sx={{ color: "#9ca3af" }}>₹</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Payment Mode"
                                name="paymentMode"
                                value={formData.paymentMode}
                                onChange={handleChange}
                                sx={inputStyles}
                            >
                                <MenuItem value="cash">Cash</MenuItem>
                                <MenuItem value="upi">UPI</MenuItem>
                                <MenuItem value="card">Card</MenuItem>
                                <MenuItem value="bank">Bank Transfer</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Receipt No"
                                name="receiptNo"
                                value={formData.receiptNo}
                                onChange={handleChange}
                                placeholder="Auto-generated if empty"
                                sx={inputStyles}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Remarks"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                multiline
                                rows={2}
                                sx={inputStyles}
                            />
                        </Grid>
                    </Grid>
                </SectionBox>

                {/* Submit Button */}
                <SubmitButton
                    fullWidth
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FiCheck size={18} />}
                >
                    {loading ? "Processing..." : "Collect Fee"}
                </SubmitButton>
            </CardContent>
        </CollectionCard>
    );
};

export default FeeCollection;
