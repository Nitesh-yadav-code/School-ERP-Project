import React, { useCallback, useEffect, useState } from 'react';
import CommonTable from '../../commonComponents/CommonTable';
import { FiEye, FiEdit, FiTrash2, FiFilter, FiPlus, FiLink } from "react-icons/fi";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import Heading from '../../commonComponents/Heading';
import LoadingComponent from '../../commonComponents/Loader';
import CommonFilter from '../../commonComponents/CommonFilter';
import { exportData } from '../../utils/exportUtils';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import ConfirmModal from '../../commonComponents/ConfirmModal';
import ViewModal from '../../commonComponents/ViewModal';
import AddSubjectModal from './AddSubjectModal';
import AddClassSubjectModal from './AddClassSubjectModal';
import ClassSubjectsTab from './classSubjectTab';
import subjectService from '../../services/subjectService';
import { toast } from 'react-toastify';

// Styled Tabs
const StyledTabs = styled(Tabs)({
    marginBottom: '20px',
    '& .MuiTabs-indicator': {
        backgroundColor: '#667eea',
    },
});

const StyledTab = styled(Tab)({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#6b7280',
    '&.Mui-selected': {
        color: '#667eea',
    },
});

// Subject Table columns
const subjectColumns = [
    { header: "Subject Name", accessor: "name", sortable: true },
    { header: "Subject Code", accessor: "code", sortable: true },
    { header: "Description", accessor: "description", sortable: false },
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

// Button arrays for each tab
const subjectButtonArray = [
    { name: null, key: "excel", icon: <FaFileExcel /> },
    { name: null, key: "csv", icon: <FaFileCsv /> },
    { name: null, key: "pdf", icon: <FaFilePdf /> },
    { name: "Add Subject", key: "create_subject", icon: <FiPlus /> },
    { name: "Filter", key: "filter", icon: <FiFilter /> },
];

const classSubjectButtonArray = [
    { name: null, key: "excel", icon: <FaFileExcel /> },
    { name: null, key: "csv", icon: <FaFileCsv /> },
    { name: null, key: "pdf", icon: <FaFilePdf /> },
    { name: "Assign Subject", key: "assign_subject", icon: <FiPlus /> },
    { name: "Filter", key: "filter", icon: <FiFilter /> },
];

const ClassSubject = () => {
    // Tab state
    const [activeTab, setActiveTab] = useState(0);

    // Common state
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);

    // Modal states - Subjects Tab
    const [createSubjectModalOpen, setCreateSubjectModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editSubject, setEditSubject] = useState(null);

    // Modal states - Class Subjects Tab
    const [assignModalOpen, setAssignModalOpen] = useState(false);

    // Class Subjects Tab state (lifted from child)
    const [classSubjectData, setClassSubjectData] = useState([]);
    const [filteredClassSubjectData, setFilteredClassSubjectData] = useState([]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setSearchTerm("");
    };

    // Subject Actions
    const handleActionClick = (action, rowData) => {
        if (action === "edit") {
            setEditSubject(rowData);
            setCreateSubjectModalOpen(true);
        } else if (action === "delete") {
            setDeleteModalOpen(true);
            setSelectedSubject(rowData);
        } else if (action === "view") {
            setViewModalOpen(true);
            setSelectedSubject(rowData);
        } else if (action === "assign") {
            setSelectedSubject(rowData);
            setAssignModalOpen(true);
        }
    };

    const confirmDelete = async () => {
        try {
            await subjectService.deleteSubject(selectedSubject._id);
            toast.success("Subject deleted successfully");
            await getSubjects();
        } catch (error) {
            console.error("Error deleting subject:", error);
            toast.error("Failed to delete subject");
        }
        setDeleteModalOpen(false);
        setSelectedSubject(null);
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
                title="Edit Subject"
            >
                <FiEdit fontSize="medium" style={{ color: "#3b82f6" }} />
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleActionClick("assign", rowData, index)}
                title="Assign to Class"
            >
                <FiLink fontSize="medium" style={{ color: "#8b5cf6" }} />
            </IconButton>
            <IconButton
                size="small"
                onClick={() => handleActionClick("delete", rowData, index)}
                title="Delete Subject"
            >
                <FiTrash2 fontSize="medium" style={{ color: "#ef4444" }} />
            </IconButton>
        </Box>
    );

    // Handle button actions based on active tab
    const handleButtonAction = (action) => {
        if (activeTab === 0) {
            // Subject tab actions
            switch (action) {
                case "create_subject":
                    setEditSubject(null);
                    setCreateSubjectModalOpen(true);
                    break;
                case "filter":
                    setShowFilter(true);
                    break;
                case "excel":
                    exportData('excel', filteredData, subjectColumns, 'subjects', 'Subjects Data');
                    break;
                case "pdf":
                    exportData('pdf', filteredData, subjectColumns, 'subjects', 'Subjects Data');
                    break;
                case "csv":
                    exportData('csv', filteredData, subjectColumns, 'subjects');
                    break;
                default:
                    break;
            }
        } else {
            // Class Subject tab actions
            switch (action) {
                case "assign_subject":
                    setAssignModalOpen(true);
                    break;
                case "filter":
                    setShowFilter(true);
                    break;
                case "excel":
                    exportData('excel', filteredClassSubjectData, classSubjectColumns, 'class_subjects', 'Class Subjects Data');
                    break;
                case "pdf":
                    exportData('pdf', filteredClassSubjectData, classSubjectColumns, 'class_subjects', 'Class Subjects Data');
                    break;
                case "csv":
                    exportData('csv', filteredClassSubjectData, classSubjectColumns, 'class_subjects');
                    break;
                default:
                    break;
            }
        }
    };

    // Search handler based on active tab
    const handleSearch = useCallback((debouncedValue) => {
        if (activeTab === 0) {
            if (debouncedValue) {
                const filtered = subjectData.filter(item =>
                    item.name?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
                    item.code?.toLowerCase().includes(debouncedValue.toLowerCase())
                );
                setFilteredData(filtered);
            } else {
                setFilteredData(subjectData);
            }
        } else {
            if (debouncedValue) {
                const filtered = classSubjectData.filter(item =>
                    item.className?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
                    item.subjectName?.toLowerCase().includes(debouncedValue.toLowerCase())
                );
                setFilteredClassSubjectData(filtered);
            } else {
                setFilteredClassSubjectData(classSubjectData);
            }
        }
    }, [activeTab, subjectData, classSubjectData]);

    const viewSections = [
        {
            title: 'Subject Information',
            fields: [
                { key: 'name', label: 'Subject Name' },
                { key: 'code', label: 'Subject Code' },
                { key: 'description', label: 'Description' },
                { key: 'isActive', label: 'Status', type: 'boolean' },
            ]
        },
    ];

    const getSubjects = async () => {
        setIsLoading(true);
        try {
            const res = await subjectService.getSubjects();
            if (res.data?.subjects && res.data.subjects.length > 0) {
                setSubjectData(res.data.subjects);
                setFilteredData(res.data.subjects);
            } else {
                setSubjectData([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.log("Error fetching subjects:", error);
            toast.error("Failed to fetch subjects");
        } finally {
            setIsLoading(false);
        }
    };

    // Class Subject columns for export
    const classSubjectColumns = [
        { header: "Class", accessor: "className" },
        { header: "Subject", accessor: "subjectName" },
        { header: "Academic Year", accessor: "academicYear" },
    ];

    // Callbacks for ClassSubjectsTab
    const handleClassSubjectDataChange = (data) => {
        setClassSubjectData(data);
        setFilteredClassSubjectData(data);
    };

    useEffect(() => {
        getSubjects();
    }, []);

    return (
        <>
            <LoadingComponent isLoading={isLoading} />
            <Heading
                title={"Subject Management"}
                showSearch={true}
                buttonArray={activeTab === 0 ? subjectButtonArray : classSubjectButtonArray}
                handleButtonAction={handleButtonAction}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
            />

            {/* Tab Navigation */}
            <StyledTabs value={activeTab} onChange={handleTabChange}>
                <StyledTab label="Subjects" />
                <StyledTab label="Class Subjects" />
            </StyledTabs>

            {/* Tab Content */}
            {activeTab === 0 && (
                <>
                    {showFilter && (
                        <CommonFilter
                            show={showFilter}
                            onClose={() => setShowFilter(false)}
                            data={subjectData}
                            filterFields={[
                                { key: "isActive", label: "Status" },
                            ]}
                            onFilter={(filtered) => setFilteredData(filtered)}
                        />
                    )}

                    <CommonTable
                        columns={subjectColumns}
                        data={filteredData}
                        actions={getActionIcons}
                    />
                </>
            )}

            {activeTab === 1 && (
                <ClassSubjectsTab
                    showFilter={showFilter}
                    onCloseFilter={() => setShowFilter(false)}
                    onDataChange={handleClassSubjectDataChange}
                    filteredData={filteredClassSubjectData}
                    setFilteredData={setFilteredClassSubjectData}
                    assignModalOpen={assignModalOpen}
                    setAssignModalOpen={setAssignModalOpen}
                />
            )}

            {/* Modals */}
            <AddSubjectModal
                open={createSubjectModalOpen}
                onClose={() => {
                    setCreateSubjectModalOpen(false);
                    setEditSubject(null);
                }}
                onSuccess={getSubjects}
                editData={editSubject}
            />

            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                action={"Delete"}
                title="Confirm Delete"
                message={`Are you sure you want to delete "${selectedSubject?.name}"? This action cannot be undone.`}
            />

            <ViewModal
                open={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedSubject(null);
                }}
                data={selectedSubject}
                title="Subject Details"
                sections={viewSections}
            />

            <AddClassSubjectModal
                open={assignModalOpen}
                onClose={() => {
                    setAssignModalOpen(false);
                    setSelectedSubject(null);
                }}
                onSuccess={() => { }}
                selectedSubject={selectedSubject}
            />
        </>
    );
};

export default ClassSubject;
