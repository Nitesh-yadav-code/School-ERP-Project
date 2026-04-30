import React, { useCallback, useEffect, useState } from 'react';
import CommonTable from '../../commonComponents/CommonTable';
import { FiEye, FiFilter, FiCheckCircle, FiCalendar, FiUsers, FiXCircle, FiClock, FiSearch, FiUser, FiPercent } from "react-icons/fi";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import Heading from '../../commonComponents/Heading';
import LoadingComponent from '../../commonComponents/Loader';
import { exportData } from '../../utils/exportUtils';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import ViewModal from '../../commonComponents/ViewModal';
import MarkAttendanceModal from './MarkAttendanceModal';
import attendanceService from '../../services/attendanceService';
import classService from '../../services/classService';
import sectionService from '../../services/sectionService';
import { toast } from 'react-toastify';
import studentService from '../../services/studentService';

// Styled Components
const PageHeader = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
});

const StyledTabs = styled(Tabs)({
    marginBottom: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '4px',
    border: '1px solid #e5e7eb',
    '& .MuiTabs-indicator': {
        display: 'none',
    },
});

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#6b7280',
    borderRadius: '8px',
    minHeight: '40px',
    padding: '8px 20px',
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
        color: '#ffffff',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    '&:hover:not(.Mui-selected)': {
        backgroundColor: '#f3f4f6',
    },
}));

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
            case 'Present':
                return {
                    bgcolor: "#22c55e15",
                    color: "#16a34a",
                    border: "1px solid #22c55e30",
                    icon: <FiCheckCircle size={12} />,
                };
            case 'Absent':
                return {
                    bgcolor: "#ef444415",
                    color: "#dc2626",
                    border: "1px solid #ef444430",
                    icon: <FiXCircle size={12} />,
                };
            case 'Leave':
                return {
                    bgcolor: "#f59e0b15",
                    color: "#d97706",
                    border: "1px solid #f59e0b30",
                    icon: <FiClock size={12} />,
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

    return (
        <Chip
            icon={styles.icon}
            label={status || 'Not Marked'}
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

// Columns for attendance table
const columns = [
    { header: "Roll No", accessor: "rollNumber", sortable: true },
    { header: "Student Name", accessor: "studentName", sortable: true },
    {
        header: "Date",
        accessor: "date",
        sortable: true,
        render: (value) => value ? new Date(value).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }) : '-',
    },
    {
        header: "Status",
        accessor: "status",
        sortable: true,
        render: (value) => <StatusChip status={value} />,
    },
];

const buttonArray = [
    { name: null, key: "excel", icon: <FaFileExcel /> },
    { name: null, key: "csv", icon: <FaFileCsv /> },
    { name: null, key: "pdf", icon: <FaFilePdf /> },
    { name: "Mark Attendance", key: "mark_attendance", icon: <FiCheckCircle /> },
];

// Columns for student attendance report table
const studentReportColumns = [
    {
        header: "Date",
        accessor: "date",
        sortable: true,
        render: (value) => value ? new Date(value).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }) : '-',
    },
    {
        header: "Day",
        accessor: "date",
        sortable: false,
        render: (value) => value ? new Date(value).toLocaleDateString('en-IN', { weekday: 'long' }) : '-',
    },
    {
        header: "Status",
        accessor: "status",
        sortable: true,
        render: (value) => <StatusChip status={value} />,
    },
    { header: "Marked By", accessor: "markedBy", sortable: true },
];

const Attendance = () => {
    // Tab state
    const [activeTab, setActiveTab] = useState(0);

    // Common state
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);

    // Filter state
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [filters, setFilters] = useState({
        classId: "",
        sectionId: "",
        date: new Date().toISOString().split('T')[0],
        academicYear: "",
        status: "",
    });

    // Modal states
    const [markModalOpen, setMarkModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        present: 0,
        absent: 0,
        leave: 0,
    });

    // Student Report Tab State
    const [studentReportFilters, setStudentReportFilters] = useState({
        classId: "",
        sectionId: "",
        academicYear: "",
        studentEnrollmentId: "",
        startDate: "",
        endDate: "",
    });
    const [studentReportSections, setStudentReportSections] = useState([]);
    const [studentEnrollments, setStudentEnrollments] = useState([]);
    const [studentAttendanceData, setStudentAttendanceData] = useState([]);
    const [studentStats, setStudentStats] = useState({
        total: 0,
        present: 0,
        absent: 0,
        leave: 0,
        percentage: 0,
    });
    const [studentSearchLoading, setStudentSearchLoading] = useState(false);
    const [fetchingEnrollments, setFetchingEnrollments] = useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Fetch sections for student report tab
    const fetchStudentReportSections = async (classId) => {
        try {
            const res = await sectionService.getSectionsByClass(classId);
            setStudentReportSections(res.data.sections || []);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
    };

    // Fetch enrollments for student selection
    const fetchStudentEnrollments = async () => {
        if (!studentReportFilters.classId || !studentReportFilters.sectionId || !studentReportFilters.academicYear) {
            return;
        }
        setFetchingEnrollments(true);
        try {
            const res = await studentService.getEnrolledStudents({
                classId: studentReportFilters.classId,
                sectionId: studentReportFilters.sectionId,
                academicYear: studentReportFilters.academicYear,
            });
            setStudentEnrollments(res.data.enrollments || []);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
            toast.error("Failed to load students");
        } finally {
            setFetchingEnrollments(false);
        }
    };

    // Handle student report filter changes
    const handleStudentReportFilterChange = (e) => {
        const { name, value } = e.target;
        setStudentReportFilters(prev => {
            const updated = { ...prev, [name]: value };
            // Reset dependent fields
            if (name === "classId") {
                updated.sectionId = "";
                updated.studentEnrollmentId = "";
                setStudentReportSections([]);
                setStudentEnrollments([]);
                if (value) fetchStudentReportSections(value);
            }
            if (name === "sectionId" || name === "academicYear") {
                updated.studentEnrollmentId = "";
                setStudentEnrollments([]);
            }
            return updated;
        });
    };

    // Fetch enrollments when class, section, and academic year are selected
    useEffect(() => {
        if (studentReportFilters.classId && studentReportFilters.sectionId && studentReportFilters.academicYear) {
            fetchStudentEnrollments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentReportFilters.classId, studentReportFilters.sectionId, studentReportFilters.academicYear]);

    // Fetch student attendance
    const fetchStudentAttendance = async () => {
        if (!studentReportFilters.studentEnrollmentId) {
            toast.warning("Please select a student");
            return;
        }

        setStudentSearchLoading(true);
        try {
            const params = {
                studentEnrollmentId: studentReportFilters.studentEnrollmentId,
            };
            if (studentReportFilters.startDate && studentReportFilters.endDate) {
                params.startDate = studentReportFilters.startDate;
                params.endDate = studentReportFilters.endDate;
            }

            const res = await attendanceService.getAttendanceByStudent(params);
            const records = res.data.attendance || [];
            const summary = res.data.summary || {};

            // Format data for table
            const formattedData = records.map((record) => ({
                _id: record._id,
                date: record.date,
                status: record.status,
                markedBy: record.markedBy?.name || "-",
            }));

            setStudentAttendanceData(formattedData);
            setStudentStats({
                total: summary.total || 0,
                present: summary.present || 0,
                absent: summary.absent || 0,
                leave: summary.leave || 0,
                percentage: summary.percentage || 0,
            });
        } catch (error) {
            console.error("Error fetching student attendance:", error);
            toast.error(error.response?.data?.message || "Failed to fetch attendance");
        } finally {
            setStudentSearchLoading(false);
        }
    };

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

    const fetchAttendance = async () => {
        if (!filters.classId || !filters.sectionId || !filters.date || !filters.academicYear) {
            toast.warning("Please select class, section, date, and academic year");
            return;
        }

        setSearchLoading(true);
        try {
            const res = await attendanceService.getAttendanceByClass({
                classId: filters.classId,
                sectionId: filters.sectionId,
                date: filters.date,
                academicYear: filters.academicYear,
            });

            const records = res.data.attendance || [];

            // Format data for table - matching new controller response shape
            const formattedData = records.map((record) => ({
                _id: record.studentEnrollmentId,
                studentEnrollmentId: record.studentEnrollmentId,
                studentName: record.studentName || "-",
                rollNumber: record.rollNumber || "-",
                date: record.date,
                status: record.status,
                markedBy: record.markedBy?.name || "-",
                record,
            }));

            setAttendanceData(formattedData);

            // Calculate stats
            const present = formattedData.filter(a => a.status === "Present").length;
            const absent = formattedData.filter(a => a.status === "Absent").length;
            const leave = formattedData.filter(a => a.status === "Leave").length;

            setStats({
                total: formattedData.length,
                present,
                absent,
                leave,
            });

            // Apply status filter
            if (filters.status) {
                setFilteredData(formattedData.filter(a => a.status === filters.status));
            } else {
                setFilteredData(formattedData);
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
            toast.error(error.response?.data?.message || "Failed to fetch attendance");
        } finally {
            setSearchLoading(false);
        }
    };

    // Apply status filter after search
    useEffect(() => {
        if (filters.status && attendanceData.length > 0) {
            setFilteredData(attendanceData.filter(a => a.status === filters.status));
        } else {
            setFilteredData(attendanceData);
        }
    }, [filters.status, attendanceData]);

    const handleActionClick = (action, rowData) => {
        if (action === "view") {
            setSelectedAttendance(rowData);
            setViewModalOpen(true);
        }
    };

    const getActionIcons = (rowData, index) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="View Details" arrow>
                <IconButton
                    size="small"
                    onClick={() => handleActionClick("view", rowData, index)}
                >
                    <FiEye fontSize="medium" style={{ color: "#22c55e" }} />
                </IconButton>
            </Tooltip>
        </Box>
    );

    const handleButtonAction = (action) => {
        switch (action) {
            case "mark_attendance":
                setMarkModalOpen(true);
                break;
            case "excel":
                exportData('excel', filteredData, columns, 'attendance', 'Attendance Data');
                break;
            case "pdf":
                exportData('pdf', filteredData, columns, 'attendance', 'Attendance Data');
                break;
            case "csv":
                exportData('csv', filteredData, columns, 'attendance');
                break;
            default:
                break;
        }
    };

    const handleSearch = useCallback((debouncedValue) => {
        if (debouncedValue) {
            const filtered = attendanceData.filter(item =>
                item.studentName?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
                item.rollNumber?.toLowerCase().includes(debouncedValue.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            if (filters.status) {
                setFilteredData(attendanceData.filter(a => a.status === filters.status));
            } else {
                setFilteredData(attendanceData);
            }
        }
    }, [attendanceData, filters.status]);

    const viewSections = [
        {
            title: 'Student Information',
            fields: [
                { key: 'studentName', label: 'Student Name' },
                { key: 'rollNumber', label: 'Roll Number' },
            ]
        },
        {
            title: 'Attendance Details',
            fields: [
                { key: 'date', label: 'Date', type: 'date' },
                { key: 'status', label: 'Status' },
                { key: 'markedBy', label: 'Marked By' },
            ]
        },
    ];

    const handleMarkSuccess = () => {
        fetchAttendance();
    };

    return (
        <>
            <LoadingComponent isLoading={isLoading} />

            {/* Page Header */}
            <PageHeader>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1f2937", mb: 0.5 }}>
                        Attendance Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        Track and manage daily student attendance
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => setMarkModalOpen(true)}
                    startIcon={<FiCheckCircle size={16} />}
                    sx={{
                        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        textTransform: "none",
                        borderRadius: "10px",
                        fontWeight: 600,
                        px: 3,
                        boxShadow: "0 4px 14px rgba(34, 197, 94, 0.35)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                        },
                    }}
                >
                    Mark Attendance
                </Button>
            </PageHeader>

            {/* Tab Navigation */}
            <StyledTabs value={activeTab} onChange={handleTabChange}>
                <StyledTab label="Daily Attendance" />
                <StyledTab label="Attendance Report" />
            </StyledTabs>

            {/* Tab Content */}
            {activeTab === 0 && (
                <>
                    {/* Stats Cards */}
                    {attendanceData.length > 0 && (
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={6} sm={3}>
                                <StatsCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                                        <Box sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "10px",
                                            bgcolor: "rgba(255,255,255,0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <FiUsers size={22} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {stats.total}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Total
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <StatsCard gradient="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)">
                                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                                        <Box sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "10px",
                                            bgcolor: "rgba(255,255,255,0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <FiCheckCircle size={22} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {stats.present}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Present
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <StatsCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
                                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                                        <Box sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "10px",
                                            bgcolor: "rgba(255,255,255,0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <FiXCircle size={22} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {stats.absent}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Absent
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <StatsCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                                        <Box sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "10px",
                                            bgcolor: "rgba(255,255,255,0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <FiClock size={22} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {stats.leave}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Leave
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
                            type="date"
                            label="Date"
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            sx={inputStyles}
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
                            <MenuItem value="Present">Present</MenuItem>
                            <MenuItem value="Absent">Absent</MenuItem>
                            <MenuItem value="Leave">Leave</MenuItem>
                        </TextField>

                        <Button
                            variant="contained"
                            onClick={fetchAttendance}
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
                            {searchLoading ? "Loading..." : "View Attendance"}
                        </Button>

                        {/* Export buttons */}
                        <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                            <Tooltip title="Export Excel" arrow>
                                <IconButton size="small" onClick={() => handleButtonAction('excel')}>
                                    <FaFileExcel style={{ color: "#16a34a" }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export CSV" arrow>
                                <IconButton size="small" onClick={() => handleButtonAction('csv')}>
                                    <FaFileCsv style={{ color: "#3b82f6" }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export PDF" arrow>
                                <IconButton size="small" onClick={() => handleButtonAction('pdf')}>
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
                                <FiCalendar size={36} style={{ color: "#667eea" }} />
                            </Box>
                            <Typography variant="h6" sx={{ mb: 1, color: "#374151", fontWeight: 600 }}>
                                No Attendance Data
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6b7280", maxWidth: 400, mx: "auto" }}>
                                Select class, section, academic year, and date, then click "View Attendance" to see records
                            </Typography>
                        </Box>
                    )}
                </>
            )}

            {activeTab === 1 && (
                <>
                    {/* Student Stats Cards */}
                    {studentAttendanceData.length > 0 && (
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={6} sm={2.4}>
                                <StatsCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                                        <Box sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "10px",
                                            bgcolor: "rgba(255,255,255,0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <FiUsers size={22} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {studentStats.total}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Total Days
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={6} sm={2.4}>
                                <StatsCard gradient="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)">
                                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                                        <Box sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "10px",
                                            bgcolor: "rgba(255,255,255,0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <FiCheckCircle size={22} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {studentStats.present}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Present
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={6} sm={2.4}>
                                <StatsCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
                                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                                        <Box sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "10px",
                                            bgcolor: "rgba(255,255,255,0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <FiXCircle size={22} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {studentStats.absent}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Absent
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={6} sm={2.4}>
                                <StatsCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                                        <Box sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "10px",
                                            bgcolor: "rgba(255,255,255,0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <FiClock size={22} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {studentStats.leave}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Leave
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={6} sm={2.4}>
                                <StatsCard gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)">
                                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                                        <Box sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "10px",
                                            bgcolor: "rgba(255,255,255,0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <FiPercent size={22} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {studentStats.percentage}%
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Attendance
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StatsCard>
                            </Grid>
                        </Grid>
                    )}

                    {/* Student Report Filters */}
                    <FilterBox>
                        <TextField
                            select
                            label="Class"
                            name="classId"
                            value={studentReportFilters.classId}
                            onChange={handleStudentReportFilterChange}
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
                            value={studentReportFilters.sectionId}
                            onChange={handleStudentReportFilterChange}
                            size="small"
                            disabled={!studentReportFilters.classId}
                            sx={inputStyles}
                        >
                            <MenuItem value=""><em>Select Section</em></MenuItem>
                            {studentReportSections.map(sec => (
                                <MenuItem key={sec._id} value={sec._id}>{sec.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Academic Year"
                            name="academicYear"
                            value={studentReportFilters.academicYear}
                            onChange={handleStudentReportFilterChange}
                            placeholder="2024-25"
                            size="small"
                            sx={{ ...inputStyles, width: 130 }}
                        />

                        <TextField
                            select
                            label="Student"
                            name="studentEnrollmentId"
                            value={studentReportFilters.studentEnrollmentId}
                            onChange={handleStudentReportFilterChange}
                            size="small"
                            disabled={fetchingEnrollments || studentEnrollments.length === 0}
                            sx={{ ...inputStyles, minWidth: 200 }}
                        >
                            <MenuItem value="">
                                <em>{fetchingEnrollments ? "Loading..." : "Select Student"}</em>
                            </MenuItem>
                            {studentEnrollments.map(enrollment => (
                                <MenuItem key={enrollment._id} value={enrollment._id}>
                                    {enrollment.studentId?.firstName} {enrollment.studentId?.lastName} ({enrollment.rollNumber || 'N/A'})
                                </MenuItem>
                            ))}
                        </TextField>
                    </FilterBox>

                    {/* Date Range Filters */}
                    <FilterBox>
                        <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
                            Date Range (Optional):
                        </Typography>
                        <TextField
                            type="date"
                            label="Start Date"
                            name="startDate"
                            value={studentReportFilters.startDate}
                            onChange={handleStudentReportFilterChange}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            sx={inputStyles}
                        />
                        <TextField
                            type="date"
                            label="End Date"
                            name="endDate"
                            value={studentReportFilters.endDate}
                            onChange={handleStudentReportFilterChange}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            sx={inputStyles}
                        />

                        <Button
                            variant="contained"
                            onClick={fetchStudentAttendance}
                            disabled={studentSearchLoading || !studentReportFilters.studentEnrollmentId}
                            startIcon={studentSearchLoading ? <CircularProgress size={16} color="inherit" /> : <FiSearch size={16} />}
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
                            {studentSearchLoading ? "Loading..." : "View Attendance"}
                        </Button>

                        {/* Export buttons */}
                        <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                            <Tooltip title="Export Excel" arrow>
                                <IconButton size="small" onClick={() => exportData('excel', studentAttendanceData, studentReportColumns, 'student_attendance', 'Student Attendance')}>
                                    <FaFileExcel style={{ color: "#16a34a" }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export CSV" arrow>
                                <IconButton size="small" onClick={() => exportData('csv', studentAttendanceData, studentReportColumns, 'student_attendance')}>
                                    <FaFileCsv style={{ color: "#3b82f6" }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export PDF" arrow>
                                <IconButton size="small" onClick={() => exportData('pdf', studentAttendanceData, studentReportColumns, 'student_attendance', 'Student Attendance')}>
                                    <FaFilePdf style={{ color: "#ef4444" }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </FilterBox>

                    {/* Student Attendance Table */}
                    {studentAttendanceData.length > 0 ? (
                        <Box sx={{
                            bgcolor: "#ffffff",
                            borderRadius: "16px",
                            border: "1px solid #e5e7eb",
                            overflow: "hidden",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                        }}>
                            <CommonTable
                                columns={studentReportColumns}
                                data={studentAttendanceData}
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
                                <FiUser size={36} style={{ color: "#667eea" }} />
                            </Box>
                            <Typography variant="h6" sx={{ mb: 1, color: "#374151", fontWeight: 600 }}>
                                No Attendance Data
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6b7280", maxWidth: 400, mx: "auto" }}>
                                Select class, section, academic year, and student, then click "View Attendance" to see records
                            </Typography>
                        </Box>
                    )}
                </>
            )}

            {/* Modals */}
            <MarkAttendanceModal
                open={markModalOpen}
                onClose={() => setMarkModalOpen(false)}
                onSuccess={handleMarkSuccess}
            />

            <ViewModal
                open={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedAttendance(null);
                }}
                data={selectedAttendance}
                title="Attendance Details"
                sections={viewSections}
            />
        </>
    );
};

export default Attendance;
