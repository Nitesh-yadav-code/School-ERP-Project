import React, { useCallback, useEffect, useState } from 'react';
import CommonTable from '../../commonComponents/CommonTable';
import { FiEye, FiEdit, FiDollarSign, FiFilter, FiSearch, FiPlus, FiUsers, FiCheckCircle, FiAlertCircle, FiClock } from "react-icons/fi";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import LoadingComponent from '../../commonComponents/Loader';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { exportData } from '../../utils/exportUtils';
import feeService from '../../services/feeService';
import classService from '../../services/classService';
import sectionService from '../../services/sectionService';
import studentService from '../../services/studentService';
import { toast } from 'react-toastify';
import FeeAssignmentModal from './FeeAssignmentModal';
import FeeDetailsModal from './FeeDetailsModal';

// Styled Components
const PageHeader = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
});

const FilterBox = styled(Box)({
    display: "flex",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "20px 24px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    marginBottom: "24px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
});

const StatsCard = styled(Card)(({ gradient }) => ({
    background: gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "16px",
    border: "none",
    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.25)",
    color: "#ffffff",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 30px rgba(102, 126, 234, 0.3)",
    },
}));

const inputStyles = {
    minWidth: 160,
    "& .MuiOutlinedInput-root": {
        bgcolor: "#f9fafb",
        color: "#374151",
        borderRadius: "10px",
        "& fieldset": { borderColor: "rgba(0, 0, 0, 0.08)" },
        "&:hover fieldset": { borderColor: "#667eea" },
        "&.Mui-focused fieldset": { borderColor: "#667eea" },
    },
    "& .MuiInputLabel-root": { color: "#6b7280" },
};

// Status Chip Component
const StatusChip = ({ status }) => {
    const getStyles = () => {
        switch (status) {
            case 'paid':
                return {
                    bgcolor: "#22c55e15",
                    color: "#16a34a",
                    border: "1px solid #22c55e30",
                    icon: <FiCheckCircle size={12} />,
                };
            case 'partial':
                return {
                    bgcolor: "#f59e0b15",
                    color: "#d97706",
                    border: "1px solid #f59e0b30",
                    icon: <FiClock size={12} />,
                };
            case 'pending':
                return {
                    bgcolor: "#ef444415",
                    color: "#dc2626",
                    border: "1px solid #ef444430",
                    icon: <FiAlertCircle size={12} />,
                };
            default:
                return {
                    bgcolor: "#6b728015",
                    color: "#6b7280",
                    border: "1px solid #6b728030",
                    icon: null,
                };
        }
    };

    const styles = getStyles();
    const label = status === 'no-fees' ? 'No Fees' : status?.charAt(0).toUpperCase() + status?.slice(1);

    return (
        <Chip
            icon={styles.icon}
            label={label}
            size="small"
            sx={{
                fontWeight: 500,
                bgcolor: styles.bgcolor,
                color: styles.color,
                border: styles.border,
                "& .MuiChip-icon": { color: styles.color, ml: 0.5 },
            }}
        />
    );
};

// Table columns
const columns = [
    { header: "Roll No", accessor: "rollNumber", sortable: true },
    { header: "Student Name", accessor: "studentName", sortable: true },
    {
        header: "Total Due",
        accessor: "totalDue",
        sortable: true,
        render: (value) => (
            <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                ₹{value?.toLocaleString() || 0}
            </Typography>
        ),
    },
    {
        header: "Total Paid",
        accessor: "totalPaid",
        sortable: true,
        render: (value) => (
            <Typography sx={{ fontWeight: 600, color: "#16a34a" }}>
                ₹{value?.toLocaleString() || 0}
            </Typography>
        ),
    },
    {
        header: "Balance",
        accessor: "balance",
        sortable: true,
        render: (value) => (
            <Typography sx={{ fontWeight: 600, color: value > 0 ? "#dc2626" : "#16a34a" }}>
                ₹{value?.toLocaleString() || 0}
            </Typography>
        ),
    },
    {
        header: "Status",
        accessor: "status",
        sortable: true,
        render: (value) => <StatusChip status={value} />,
    },
];

const FeeAssignments = () => {
    // State
    const [isLoading, setIsLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [assignmentData, setAssignmentData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    // Filter state
    const [filters, setFilters] = useState({
        classId: "",
        sectionId: "",
        academicYear: "",
        status: "",
    });

    // Modal states
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    // Stats
    const [stats, setStats] = useState({
        totalStudents: 0,
        paidCount: 0,
        pendingCount: 0,
        totalCollected: 0,
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (filters.classId) {
            fetchSections(filters.classId);
        } else {
            setSections([]);
            setFilters(prev => ({ ...prev, sectionId: "" }));
        }
    }, [filters.classId]);

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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = async () => {
        if (!filters.classId || !filters.sectionId || !filters.academicYear) {
            toast.warning("Please select class, section, and academic year");
            return;
        }

        setSearchLoading(true);
        try {
            // Get enrolled students
            const enrollRes = await studentService.getEnrolledStudents({
                classId: filters.classId,
                sectionId: filters.sectionId,
                academicYear: filters.academicYear,
            });

            const enrollments = enrollRes.data.enrollments || [];

            // Get fee assignments for each enrollment
            const assignmentsData = await Promise.all(
                enrollments.map(async (enrollment) => {
                    try {
                        const feeRes = await feeService.getFeesByEnrollment(enrollment._id);
                        const fees = feeRes.data.assignments || [];

                        const totalDue = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
                        const totalPaid = fees.reduce((sum, f) => f.status === "paid" ? sum + (f.amount || 0) : sum, 0);
                        const balance = totalDue - totalPaid;

                        let status = "no-fees";
                        if (fees.length > 0) {
                            const allPaid = fees.every(f => f.status === "paid");
                            const anyPartial = fees.some(f => f.status === "partial");
                            if (allPaid) status = "paid";
                            else if (anyPartial) status = "partial";
                            else status = "pending";
                        }

                        return {
                            _id: enrollment._id,
                            enrollmentId: enrollment._id,
                            studentId: enrollment.studentId?._id,
                            studentName: `${enrollment.studentId?.firstName || ""} ${enrollment.studentId?.lastName || ""}`.trim(),
                            rollNumber: enrollment.rollNumber || "-",
                            totalDue,
                            totalPaid,
                            balance,
                            status,
                            fees,
                            enrollment,
                        };
                    } catch (e) {
                        return {
                            _id: enrollment._id,
                            enrollmentId: enrollment._id,
                            studentId: enrollment.studentId?._id,
                            studentName: `${enrollment.studentId?.firstName || ""} ${enrollment.studentId?.lastName || ""}`.trim(),
                            rollNumber: enrollment.rollNumber || "-",
                            totalDue: 0,
                            totalPaid: 0,
                            balance: 0,
                            status: "no-fees",
                            fees: [],
                            enrollment,
                        };
                    }
                })
            );

            setAssignmentData(assignmentsData);

            // Calculate stats
            const paidCount = assignmentsData.filter(a => a.status === "paid").length;
            const pendingCount = assignmentsData.filter(a => a.status === "pending" || a.status === "partial").length;
            const totalCollected = assignmentsData.reduce((sum, a) => sum + a.totalPaid, 0);

            setStats({
                totalStudents: assignmentsData.length,
                paidCount,
                pendingCount,
                totalCollected,
            });

            // Apply status filter if any
            if (filters.status) {
                setFilteredData(assignmentsData.filter(a => a.status === filters.status));
            } else {
                setFilteredData(assignmentsData);
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
            toast.error("Failed to fetch fee assignments");
        } finally {
            setSearchLoading(false);
        }
    };

    // Handle status filter change after search
    useEffect(() => {
        if (filters.status && assignmentData.length > 0) {
            setFilteredData(assignmentData.filter(a => a.status === filters.status));
        } else {
            setFilteredData(assignmentData);
        }
    }, [filters.status, assignmentData]);

    const handleActionClick = (action, rowData) => {
        if (action === "view") {
            setSelectedAssignment(rowData);
            setViewModalOpen(true);
        } else if (action === "assign") {
            setSelectedAssignment(rowData);
            setAssignModalOpen(true);
        }
    };

    const getActionIcons = (rowData, index) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="View Fee Details" arrow>
                <IconButton
                    size="small"
                    onClick={() => handleActionClick("view", rowData, index)}
                >
                    <FiEye fontSize="medium" style={{ color: "#22c55e" }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Assign New Fees" arrow>
                <IconButton
                    size="small"
                    onClick={() => handleActionClick("assign", rowData, index)}
                >
                    <FiPlus fontSize="medium" style={{ color: "#667eea" }} />
                </IconButton>
            </Tooltip>
        </Box>
    );

    const handleExport = (type) => {
        exportData(type, filteredData, columns, 'fee_assignments', 'Fee Assignments Data');
    };

    const handleAssignSuccess = () => {
        handleSearch(); // Refresh data after assignment
    };

    return (
        <>
            <LoadingComponent isLoading={isLoading} />


            {/* Stats Cards */}
            {assignmentData.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "12px",
                                    bgcolor: "rgba(255,255,255,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <FiUsers size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {stats.totalStudents}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Total Students
                                    </Typography>
                                </Box>
                            </CardContent>
                        </StatsCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard gradient="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)">
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "12px",
                                    bgcolor: "rgba(255,255,255,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <FiCheckCircle size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {stats.paidCount}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Fully Paid
                                    </Typography>
                                </Box>
                            </CardContent>
                        </StatsCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "12px",
                                    bgcolor: "rgba(255,255,255,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <FiAlertCircle size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {stats.pendingCount}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Pending
                                    </Typography>
                                </Box>
                            </CardContent>
                        </StatsCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "12px",
                                    bgcolor: "rgba(255,255,255,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <FiDollarSign size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        ₹{stats.totalCollected.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Collected
                                    </Typography>
                                </Box>
                            </CardContent>
                        </StatsCard>
                    </Grid>
                </Grid>
            )}

            {/* Filters */}
            <FilterBox>
                <TextField
                    select
                    label="Class"
                    name="classId"
                    value={filters.classId}
                    onChange={handleFilterChange}
                    size="small"
                    sx={inputStyles}
                >
                    <MenuItem value=""><em>Select Class</em></MenuItem>
                    {classes.map(cls => (
                        <MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Section"
                    name="sectionId"
                    value={filters.sectionId}
                    onChange={handleFilterChange}
                    size="small"
                    disabled={!filters.classId}
                    sx={inputStyles}
                >
                    <MenuItem value=""><em>Select Section</em></MenuItem>
                    {sections.map(sec => (
                        <MenuItem key={sec._id} value={sec._id}>{sec.name}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Academic Year"
                    name="academicYear"
                    value={filters.academicYear}
                    onChange={handleFilterChange}
                    placeholder="2024-25"
                    size="small"
                    sx={{ ...inputStyles, width: 130 }}
                />

                <TextField
                    select
                    label="Status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    size="small"
                    sx={inputStyles}
                >
                    <MenuItem value=""><em>All Status</em></MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="partial">Partial</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="no-fees">No Fees</MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={searchLoading}
                    startIcon={searchLoading ? <CircularProgress size={16} color="inherit" /> : <FiSearch size={16} />}
                    sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        textTransform: "none",
                        borderRadius: "10px",
                        fontWeight: 600,
                        px: 3,
                        boxShadow: "0 4px 14px rgba(102, 126, 234, 0.35)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)",
                        },
                    }}
                >
                    {searchLoading ? "Loading..." : "Search"}
                </Button>

                {/* Export buttons */}
                <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                    <Tooltip title="Export Excel" arrow>
                        <IconButton size="small" onClick={() => handleExport('excel')}>
                            <FaFileExcel style={{ color: "#16a34a" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export CSV" arrow>
                        <IconButton size="small" onClick={() => handleExport('csv')}>
                            <FaFileCsv style={{ color: "#3b82f6" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export PDF" arrow>
                        <IconButton size="small" onClick={() => handleExport('pdf')}>
                            <FaFilePdf style={{ color: "#ef4444" }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </FilterBox>

            {/* Table */}
            {filteredData.length > 0 ? (
                <Box sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}>
                    <CommonTable
                        columns={columns}
                        data={filteredData}
                        actions={getActionIcons}
                    />
                </Box>
            ) : (
                <Box
                    sx={{
                        textAlign: "center",
                        py: 10,
                        bgcolor: "#ffffff",
                        borderRadius: "16px",
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "20px",
                            background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 3,
                        }}
                    >
                        <FiDollarSign size={36} style={{ color: "#667eea" }} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, color: "#374151", fontWeight: 600 }}>
                        No Data to Display
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6b7280", maxWidth: 400, mx: "auto" }}>
                        Select class, section, and academic year, then click Search to view student fee assignments
                    </Typography>
                </Box>
            )}

            {/* Assign Fees Modal */}
            <FeeAssignmentModal
                open={assignModalOpen}
                onClose={() => {
                    setAssignModalOpen(false);
                    setSelectedAssignment(null);
                }}
                onSuccess={handleAssignSuccess}
                studentData={selectedAssignment}
                classId={filters.classId}
                academicYear={filters.academicYear}
            />

            {/* View Fee Details Modal */}
            <FeeDetailsModal
                open={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedAssignment(null);
                }}
                studentData={selectedAssignment}
                onSuccess={handleAssignSuccess}
            />
        </>
    );
};

export default FeeAssignments;
