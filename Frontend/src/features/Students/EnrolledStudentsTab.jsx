import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { FiRefreshCw, FiArrowUpCircle, FiRepeat } from "react-icons/fi";
import { toast } from "react-toastify";
import CommonTable from "../../commonComponents/CommonTable";
import classService from "../../services/classService";
import sectionService from "../../services/sectionService";
import studentService from "../../services/studentService";

const FilterBox = styled(Box)({
    display: "flex",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "16px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
});

const inputStyles = {
    minWidth: 150,
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

const columns = [
    {
        header: "",
        accessor: "select",
        sortable: false,
        render: (value, row, { isSelected, onSelect }) => (
            <Checkbox
                checked={isSelected}
                onChange={(e) => onSelect(row._id, e.target.checked)}
                sx={{ "&.Mui-checked": { color: "#667eea" } }}
            />
        ),
    },
    {
        header: "Student Name",
        accessor: "studentName",
        sortable: true,
    },
    {
        header: "Roll No",
        accessor: "rollNumber",
        sortable: true,
    },
    {
        header: "Class",
        accessor: "className",
        sortable: true,
    },
    {
        header: "Section",
        accessor: "sectionName",
        sortable: true,
    },
];

const EnrolledStudentsTab = ({ onChangeSectionClick, onPromoteClick }) => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    // Filter state
    const [filters, setFilters] = useState({
        classId: "",
        sectionId: "",
        academicYear: "",
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

    const fetchEnrolledStudents = async () => {
        if (!filters.classId || !filters.sectionId || !filters.academicYear) {
            toast.warning("Please select Class, Section, and Academic Year");
            return;
        }

        setLoading(true);
        setSelectedIds([]);
        try {
            const res = await studentService.getEnrolledStudents(filters);
            const enrollments = res.data.enrollments || [];

            // Transform data for table
            const tableData = enrollments.map(e => ({
                _id: e._id,
                studentId: e.studentId?._id,
                studentName: `${e.studentId?.firstName || ""} ${e.studentId?.lastName || ""}`.trim(),
                rollNumber: e.rollNumber || "-",
                className: e.classId?.name || "-",
                sectionName: e.sectionId?.name || "-",
                enrollmentData: e,
            }));

            setEnrolledStudents(tableData);
        } catch (error) {
            console.error("Error fetching enrolled students:", error);
            toast.error(error.response?.data?.message || "Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectStudent = (id, checked) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(enrolledStudents.map(s => s._id));
        } else {
            setSelectedIds([]);
        }
    };

    const getActionIcons = (rowData) => (
        <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
                size="small"
                onClick={() => onChangeSectionClick && onChangeSectionClick(rowData)}
                title="Change Section"
            >
                <FiRepeat fontSize="medium" style={{ color: "#f59e0b" }} />
            </IconButton>
        </Box>
    );

    // Custom render for checkbox column
    const getColumnsWithSelect = () => {
        return columns.map(col => {
            if (col.accessor === "select") {
                return {
                    ...col,
                    render: (value, row) => (
                        <Checkbox
                            checked={selectedIds.includes(row._id)}
                            onChange={(e) => handleSelectStudent(row._id, e.target.checked)}
                            sx={{ "&.Mui-checked": { color: "#667eea" } }}
                        />
                    ),
                };
            }
            return col;
        });
    };

    return (
        <Box>
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
                    sx={{ ...inputStyles, width: 120 }}
                />

                <Button
                    variant="contained"
                    onClick={fetchEnrolledStudents}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FiRefreshCw size={16} />}
                    sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        textTransform: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                    }}
                >
                    {loading ? "Loading..." : "Load Students"}
                </Button>

                {selectedIds.length > 0 && (
                    <Button
                        variant="contained"
                        onClick={() => onPromoteClick && onPromoteClick(selectedIds, enrolledStudents.filter(s => selectedIds.includes(s._id)), filters)}
                        startIcon={<FiArrowUpCircle size={16} />}
                        sx={{
                            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                            textTransform: "none",
                            borderRadius: "8px",
                            fontWeight: 600,
                            ml: "auto",
                        }}
                    >
                        Promote Selected ({selectedIds.length})
                    </Button>
                )}
            </FilterBox>

            {/* Students Table */}
            {enrolledStudents.length > 0 ? (
                <CommonTable
                    columns={getColumnsWithSelect()}
                    data={enrolledStudents}
                    actions={getActionIcons}
                />
            ) : (
                <Box sx={{ textAlign: "center", py: 6, color: "#6b7280" }}>
                    <Typography variant="body1">
                        {loading ? "Loading..." : "Select filters and click 'Load Students' to view enrolled students"}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default EnrolledStudentsTab;
