import React, { useCallback, useEffect, useState } from 'react';
import CommonTable from '../../commonComponents/CommonTable';
import { FiEye, FiEdit, FiTrash2, FiFilter, FiUserPlus, FiBook, FiClipboard } from "react-icons/fi";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import Heading from '../../commonComponents/Heading';
import LoadingComponent from '../../commonComponents/Loader';
import CommonFilter from '../../commonComponents/CommonFilter';
import { exportData } from '../../utils/exportUtils';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ConfirmModal from '../../commonComponents/ConfirmModal';
import ViewModal from '../../commonComponents/ViewModal';
import CreateTeacherModal from './CreateTeacherModal';
import AssignTeacherModal from './AssignTeacherModal';
import ViewAssignmentsModal from './ViewAssignmentsModal';
import teacherService from '../../services/teacherService';
import { toast } from 'react-toastify';

const columns = [
    { header: "Name", accessor: "name", sortable: true },
    { header: "Email", accessor: "email", sortable: true },
    { header: "Phone", accessor: "phone", sortable: true },
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

const buttonArray = [
    { name: null, key: "excel", icon: <FaFileExcel /> },
    { name: null, key: "csv", icon: <FaFileCsv /> },
    { name: null, key: "pdf", icon: <FaFilePdf /> },
    { name: "Add Teacher", key: "create_teacher", icon: <FiUserPlus /> },
    { name: "Filter", key: "filter", icon: <FiFilter /> },
];

const Teachers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [teacherData, setTeacherData] = useState([]);

    // Modal states
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editTeacher, setEditTeacher] = useState(null);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedTeacherForAssign, setSelectedTeacherForAssign] = useState(null);
    const [viewAssignmentsModalOpen, setViewAssignmentsModalOpen] = useState(false);
    const [selectedTeacherForViewAssignments, setSelectedTeacherForViewAssignments] = useState(null);

    const handleActionClick = (action, rowData) => {
        if (action === "edit") {
            setEditTeacher(rowData);
            setCreateModalOpen(true);
        } else if (action === "delete") {
            setDeleteModalOpen(true);
            setSelectedTeacher(rowData);
        } else if (action === "view") {
            setViewModalOpen(true);
            setSelectedTeacher(rowData);
        } else if (action === "assign") {
            setSelectedTeacherForAssign(rowData);
            setAssignModalOpen(true);
        } else if (action === "view_assignments") {
            setSelectedTeacherForViewAssignments(rowData);
            setViewAssignmentsModalOpen(true);
        }
    };

    const confirmDelete = async () => {
        try {
            await teacherService.deleteTeacher(selectedTeacher._id);
            toast.success("Teacher deleted successfully");
            await fetchTeachers();
        } catch (error) {
            console.error("Error deleting teacher:", error);
            toast.error("Failed to delete teacher");
        }
        setDeleteModalOpen(false);
        setSelectedTeacher(null);
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
                title="Edit Teacher"
            >
                <FiEdit fontSize="medium" style={{ color: "#3b82f6" }} />
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleActionClick("assign", rowData, index)}
                title="Assign to Class"
            >
                <FiBook fontSize="medium" style={{ color: "#8b5cf6" }} />
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleActionClick("view_assignments", rowData, index)}
                title="View Assignments"
            >
                <FiClipboard fontSize="medium" style={{ color: "#06b6d4" }} />
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleActionClick("delete", rowData, index)}
                title="Delete Teacher"
            >
                <FiTrash2 fontSize="medium" style={{ color: "#ef4444" }} />
            </IconButton>
        </Box>
    );

    const handleButtonAction = (action) => {
        switch (action) {
            case "create_teacher":
                setEditTeacher(null);
                setCreateModalOpen(true);
                break;
            case "filter":
                setShowFilter(true);
                break;
            case "excel":
                exportData('excel', filteredData, columns, 'teachers', 'Teachers Data');
                break;
            case "pdf":
                exportData('pdf', filteredData, columns, 'teachers', 'Teachers Data');
                break;
            case "csv":
                exportData('csv', filteredData, columns, 'teachers');
                break;
            default:
                break;
        }
    };

    const handleSearch = useCallback((debouncedValue) => {
        if (debouncedValue) {
            const filtered = teacherData.filter(item =>
                item.name?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
                item.email?.toLowerCase().includes(debouncedValue.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(teacherData);
        }
    }, [teacherData]);

    const viewSections = [
        {
            title: 'Teacher Information',
            fields: [
                { key: 'name', label: 'Full Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'isActive', label: 'Status', type: 'boolean' },
            ]
        },
        {
            title: 'System Information',
            fields: [
                { key: 'createdAt', label: 'Created At', type: 'date' },
                { key: 'updatedAt', label: 'Updated At', type: 'date' },
            ]
        },
    ];

    const fetchTeachers = async () => {
        setIsLoading(true);
        try {
            const res = await teacherService.getTeachers();
            const teachers = res.data.teachers || [];
            setTeacherData(teachers);
            setFilteredData(teachers);
        } catch (error) {
            console.log("Error fetching teachers:", error);
            toast.error("Failed to fetch teachers");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    return (
        <>
            <LoadingComponent isLoading={isLoading} />
            <Heading
                title={"Teacher Management"}
                showSearch={true}
                buttonArray={buttonArray}
                handleButtonAction={handleButtonAction}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
            />

            {showFilter && (
                <CommonFilter
                    show={showFilter}
                    onClose={() => setShowFilter(false)}
                    data={teacherData}
                    filterFields={[
                        { key: "isActive", label: "Status" },
                    ]}
                    onFilter={(filtered) => setFilteredData(filtered)}
                />
            )}

            <CommonTable
                columns={columns}
                data={filteredData}
                actions={getActionIcons}
            />

            {/* Modals */}
            <CreateTeacherModal
                open={createModalOpen}
                onClose={() => {
                    setCreateModalOpen(false);
                    setEditTeacher(null);
                }}
                onSuccess={fetchTeachers}
                editData={editTeacher}
            />

            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                action={"Delete"}
                title="Confirm Delete"
                message={`Are you sure you want to delete "${selectedTeacher?.name}"? This action cannot be undone.`}
            />

            <ViewModal
                open={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedTeacher(null);
                }}
                data={selectedTeacher}
                title="Teacher Details"
                sections={viewSections}
            />

            <AssignTeacherModal
                open={assignModalOpen}
                onClose={() => {
                    setAssignModalOpen(false);
                    setSelectedTeacherForAssign(null);
                }}
                teacher={selectedTeacherForAssign}
                onSuccess={fetchTeachers}
            />

            <ViewAssignmentsModal
                open={viewAssignmentsModalOpen}
                onClose={() => {
                    setViewAssignmentsModalOpen(false);
                    setSelectedTeacherForViewAssignments(null);
                }}
                teacher={selectedTeacherForViewAssignments}
            />
        </>
    );
};

export default Teachers;