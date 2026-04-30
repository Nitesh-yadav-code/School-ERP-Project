import React, { useEffect, useState } from 'react';
import CommonTable from '../../commonComponents/CommonTable';
import { FiEye, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import LoadingComponent from '../../commonComponents/Loader';
import CommonFilter from '../../commonComponents/CommonFilter';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import ConfirmModal from '../../commonComponents/ConfirmModal';
import ViewModal from '../../commonComponents/ViewModal';
import FeeStructureModal from './FeeStructureModal';
import feeService from '../../services/feeService';
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

// Fee Structure Table columns
const columns = [
    { header: "Fee Name", accessor: "name", sortable: true },
    { header: "Class", accessor: "className", sortable: true },
    {
        header: "Amount",
        accessor: "amount",
        sortable: true,
        render: (value) => (
            <Typography sx={{ fontWeight: 600, color: "#667eea" }}>
                ₹{value?.toLocaleString() || 0}
            </Typography>
        ),
    },
    { header: "Academic Year", accessor: "academicYear", sortable: true },
    {
        header: "Type",
        accessor: "isMandatory",
        sortable: true,
        render: (value) => (
            <Chip
                label={value ? "Mandatory" : "Optional"}
                size="small"
                sx={{
                    bgcolor: value ? "#22c55e15" : "#f59e0b15",
                    color: value ? "#16a34a" : "#d97706",
                    fontWeight: 500,
                    border: `1px solid ${value ? "#22c55e30" : "#f59e0b30"}`,
                }}
            />
        ),
    },
];

const FeeStructureTab = ({
    showFilter,
    onCloseFilter,
    onDataChange,
    filteredData,
    setFilteredData,
    createModalOpen,
    setCreateModalOpen,
}) => {
    // State
    const [isLoading, setIsLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [feeStructureData, setFeeStructureData] = useState([]);
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
    const [editData, setEditData] = useState(null);

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

    const fetchFeeStructures = async () => {
        if (!filters.classId || !filters.academicYear) {
            toast.warning("Please select class and academic year");
            return;
        }

        setSearchLoading(true);
        try {
            const res = await feeService.getFeeStructures({
                classId: filters.classId,
                academicYear: filters.academicYear,
            });

            const data = (res.data.feeStructures || []).map(item => ({
                _id: item._id,
                name: item.name,
                className: item.classId?.name || "N/A",
                classId: item.classId?._id || item.classId,
                amount: item.amount,
                academicYear: item.academicYear,
                isMandatory: item.isMandatory,
            }));

            setFeeStructureData(data);
            setFilteredData(data);
            onDataChange(data);
        } catch (error) {
            console.error("Error fetching fee structures:", error);
            toast.error(error.response?.data?.message || "Failed to fetch fee structures");
        } finally {
            setSearchLoading(false);
        }
    };

    const handleActionClick = (action, rowData) => {
        if (action === "view") {
            setSelectedItem(rowData);
            setViewModalOpen(true);
        } else if (action === "edit") {
            setEditData(rowData);
            setCreateModalOpen(true);
        } else if (action === "delete") {
            setSelectedItem(rowData);
            setDeleteModalOpen(true);
        }
    };

    const confirmDelete = async () => {
        try {
            await feeService.deleteFeeStructure(selectedItem._id);
            toast.success("Fee structure deleted successfully");
            fetchFeeStructures();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete fee structure");
        } finally {
            setDeleteModalOpen(false);
            setSelectedItem(null);
        }
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
                onClick={() => handleActionClick("edit", rowData, index)}
                title="Edit Fee"
            >
                <FiEdit fontSize="medium" style={{ color: "#3b82f6" }} />
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleActionClick("delete", rowData, index)}
                title="Delete Fee"
            >
                <FiTrash2 fontSize="medium" style={{ color: "#ef4444" }} />
            </IconButton>
        </Box>
    );

    const viewSections = [
        {
            title: 'Fee Structure Details',
            fields: [
                { key: 'name', label: 'Fee Name' },
                { key: 'className', label: 'Class' },
                { key: 'amount', label: 'Amount', type: 'currency' },
                { key: 'academicYear', label: 'Academic Year' },
                { key: 'isMandatory', label: 'Type', type: 'boolean', trueLabel: 'Mandatory', falseLabel: 'Optional' },
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
                    data={feeStructureData}
                    filterFields={[
                        { key: "isMandatory", label: "Type" },
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
                    onClick={fetchFeeStructures}
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
            <FeeStructureModal
                open={createModalOpen}
                onClose={() => {
                    setCreateModalOpen(false);
                    setEditData(null);
                }}
                onSuccess={fetchFeeStructures}
                editData={editData}
                classes={classes}
                defaultValues={{
                    classId: filters.classId,
                    academicYear: filters.academicYear,
                }}
            />

            <ViewModal
                open={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedItem(null);
                }}
                data={selectedItem}
                title="Fee Structure Details"
                sections={viewSections}
            />

            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                action={"Delete"}
                title="Delete Fee Structure"
                message={`Are you sure you want to delete "${selectedItem?.name}"?`}
            />
        </>
    );
};

export default FeeStructureTab;
