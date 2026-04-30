import React, { useEffect, useState } from 'react';
import CommonTable from '../../commonComponents/CommonTable';
import { FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import LoadingComponent from '../../commonComponents/Loader';
import CommonFilter from '../../commonComponents/CommonFilter';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import ConfirmModal from '../../commonComponents/ConfirmModal';
import ViewModal from '../../commonComponents/ViewModal';
import AddClassSubjectModal from './AddClassSubjectModal';
import classSubjectService from '../../services/classSubjectService';
import classService from '../../services/classService';
import { toast } from 'react-toastify';

// Styled Components
const FilterBox = styled(Box)({
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "16px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
});

const inputStyles = {
    minWidth: 200,
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

// Class Subject Table columns
const columns = [
    { header: "Class", accessor: "className", sortable: true },
    {
        header: "Subject",
        accessor: "subjectName",
        sortable: true,
        render: (value) => (
            <Chip
                label={value || "N/A"}
                size="small"
                sx={{
                    bgcolor: "#667eea15",
                    color: "#667eea",
                    fontWeight: 500,
                    border: "1px solid #667eea30",
                }}
            />
        ),
    },
    { header: "Academic Year", accessor: "academicYear", sortable: true },
    {
        header: "Status",
        accessor: "isActive",
        sortable: true,
        render: (value) => (
            <span style={{ color: value === true ? "#22c55e" : "#ef4444" }}>
                {value === true ? "Active" : "Inactive"}
            </span>
        ),
    },
];

const ClassSubjectsTab = ({
    showFilter,
    onCloseFilter,
    onDataChange,
    filteredData,
    setFilteredData,
    assignModalOpen,
    setAssignModalOpen,
}) => {
    // State
    const [isLoading, setIsLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [classSubjectData, setClassSubjectData] = useState([]);
    const [classes, setClasses] = useState([]);

    // Filter state
    const [filters, setFilters] = useState({
        classId: "",
        academicYear: "",
    });

    // Modal states
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await classService.getClasses();
            setClasses(res.data.classes || []);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const fetchClassSubjects = async () => {
        if (!filters.classId || !filters.academicYear) {
            toast.warning("Please select class and academic year");
            return;
        }

        setSearchLoading(true);
        try {
            const res = await classSubjectService.getClassSubjects({
                classId: filters.classId,
                academicYear: filters.academicYear,
            });

            const data = (res.data.classSubjects || []).map(item => ({
                _id: item._id,
                className: item.classId?.name || "N/A",
                subjectName: item.subjectId?.name || "N/A",
                academicYear: item.academicYear,
                isActive: item.isActive,
                classId: item.classId,
                subjectId: item.subjectId,
            }));

            setClassSubjectData(data);
            setFilteredData(data);
            onDataChange(data);
        } catch (error) {
            console.error("Error fetching class subjects:", error);
            toast.error("Failed to fetch class subjects");
        } finally {
            setSearchLoading(false);
        }
    };

    const handleActionClick = (action, rowData) => {
        if (action === "view") {
            setSelectedItem(rowData);
            setViewModalOpen(true);
        } else if (action === "delete") {
            setSelectedItem(rowData);
            setDeleteModalOpen(true);
        }
    };

    const confirmDelete = async () => {
        toast.info("Delete functionality coming soon");
        setDeleteModalOpen(false);
        setSelectedItem(null);
    };

    const getActionIcons = (rowData, index) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
                size="small"
                onClick={() => handleActionClick("view", rowData, index)}
                title="View Details"
            >
                <FiEye fontSize="medium" style={{ color: "#22c55e" }} />
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleActionClick("delete", rowData, index)}
                title="Remove Subject"
            >
                <FiTrash2 fontSize="medium" style={{ color: "#ef4444" }} />
            </IconButton>
        </Box>
    );

    const viewSections = [
        {
            title: 'Assignment Details',
            fields: [
                { key: 'className', label: 'Class' },
                { key: 'subjectName', label: 'Subject' },
                { key: 'academicYear', label: 'Academic Year' },
                { key: 'isActive', label: 'Status', type: 'boolean' },
            ]
        },
    ];

    return (
        <>
            <LoadingComponent isLoading={isLoading} />

            {/* Filter Modal from parent */}
            {showFilter && (
                <CommonFilter
                    show={showFilter}
                    onClose={onCloseFilter}
                    data={classSubjectData}
                    filterFields={[
                        { key: "isActive", label: "Status" },
                    ]}
                    onFilter={(filtered) => setFilteredData(filtered)}
                />
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
                        <MenuItem key={cls._id} value={cls._id}>
                            {cls.name} {cls.academicYear && `(${cls.academicYear})`}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Academic Year"
                    name="academicYear"
                    value={filters.academicYear}
                    onChange={handleFilterChange}
                    placeholder="2024-25"
                    size="small"
                    sx={{ ...inputStyles, minWidth: 140, maxWidth: 160 }}
                />

                <Button
                    variant="contained"
                    onClick={fetchClassSubjects}
                    disabled={searchLoading}
                    startIcon={searchLoading ? <CircularProgress size={16} color="inherit" /> : <FiSearch size={16} />}
                    sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        textTransform: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                    }}
                >
                    {searchLoading ? "Loading..." : "Search"}
                </Button>
            </FilterBox>

            {/* Table */}
            <CommonTable
                columns={columns}
                data={filteredData}
                actions={getActionIcons}
            />

            {/* Modals */}
            <AddClassSubjectModal
                open={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                onSuccess={fetchClassSubjects}
            />

            <ViewModal
                open={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedItem(null);
                }}
                data={selectedItem}
                title="Class Subject Details"
                sections={viewSections}
            />

            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                action={"Delete"}
                title="Remove Subject"
                message={`Are you sure you want to remove "${selectedItem?.subjectName}" from "${selectedItem?.className}"?`}
            />
        </>
    );
};

export default ClassSubjectsTab;
