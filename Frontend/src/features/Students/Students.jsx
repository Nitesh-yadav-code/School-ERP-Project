import React, { useCallback, useEffect, useState } from 'react';
import CommonTable from '../../commonComponents/CommonTable';
import { FiEye, FiEdit, FiTrash2, FiFilter, FiUserPlus, FiBookOpen, FiClock } from "react-icons/fi";
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
import CreateStudentModal from './CreateStudentModal';
import EnrollStudentModal from './EnrollStudentModal';
import EnrolledStudentsTab from './EnrolledStudentsTab';
import ChangeSectionModal from './ChangeSectionModal';
import EnrollmentHistoryModal from './EnrollmentHistoryModal';
import PromoteStudentsModal from './PromoteStudentsModal';
import studentService from '../../services/studentService';

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

const columns = [
  { header: "Name", accessor: "firstName", sortable: true },
  { header: "Guardian Name", accessor: "guardianName", sortable: true },
  { header: "Guardian Phone", accessor: "guardianPhone", sortable: true },
  {
    header: "Status",
    accessor: "isActive",
    sortable: true,
    render: (value) => (
      <span style={{ color: value === true ? "#22c55e" : "#ef4444" }}>
        {value === true ? "Active" : "InActive"}
      </span>
    ),
  },
];

const buttonArray = [
  { name: null, key: "excel", icon: <FaFileExcel /> },
  { name: null, key: "csv", icon: <FaFileCsv /> },
  { name: null, key: "pdf", icon: <FaFilePdf /> },
  { name: "Create Student", key: "create_user", icon: <FiUserPlus /> },
  { name: "Filter", key: "filter", icon: <FiFilter /> },
];

const Students = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Common state
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [userData, setUserData] = useState([]);

  // Modal states - Student Master
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedStudentForEnroll, setSelectedStudentForEnroll] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);

  // Modal states - Enrolled Students
  const [changeSectionModalOpen, setChangeSectionModalOpen] = useState(false);
  const [selectedEnrollmentForSection, setSelectedEnrollmentForSection] = useState(null);
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [selectedStudentsForPromotion, setSelectedStudentsForPromotion] = useState([]);
  const [promotionFilters, setPromotionFilters] = useState({});

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleActionClick = (action, rowData) => {
    console.log(rowData, "rowData");
    if (action === "edit") {
      setEditUser(rowData);
      setCreateUserModalOpen(true);
    } else if (action === "delete") {
      setDeleteModalOpen(true);
      setSelectedUser(rowData);
    } else if (action === "view") {
      setViewModalOpen(true);
      setSelectedUser(rowData);
    } else if (action === "enroll") {
      setSelectedStudentForEnroll(rowData);
      setEnrollModalOpen(true);
    } else if (action === "history") {
      setSelectedStudentForHistory(rowData);
      setHistoryModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    console.log("Deleting user:", selectedUser);
    try {
      await studentService.deleteStudent(selectedUser._id);
      await getUsers();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
    setDeleteModalOpen(false);
    setSelectedUser(null);
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
        title="Edit Student"
      >
        <FiEdit fontSize="medium" style={{ color: "#3b82f6" }} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => handleActionClick("enroll", rowData, index)}
        title="Enroll Student"
      >
        <FiBookOpen fontSize="medium" style={{ color: "#8b5cf6" }} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => handleActionClick("history", rowData, index)}
        title="Enrollment History"
      >
        <FiClock fontSize="medium" style={{ color: "#f59e0b" }} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => handleActionClick("delete", rowData, index)}
        title="Delete Student"
      >
        <FiTrash2 fontSize="medium" style={{ color: "#ef4444" }} />
      </IconButton>
    </Box>
  );

  const handleButtonAction = (action) => {
    switch (action) {
      case "create_user":
        setEditUser(null);
        setCreateUserModalOpen(true);
        break;
      case "filter":
        setShowFilter(true);
        break;
      case "excel":
        exportData('excel', filteredData, columns, 'student_management', 'Student Management Data');
        break;
      case "pdf":
        exportData('pdf', filteredData, columns, 'student_management', 'Student Management Data');
        break;
      case "csv":
        exportData('csv', filteredData, columns, 'student_management');
        break;
      default:
        break;
    }
  };

  const handleCreateUser = async (formData) => {
    setIsLoading(true);
    try {
      if (editUser) {
        await studentService.updateStudent(editUser._id, formData);
        alert("Student updated successfully!");
      } else {
        await studentService.addStudent(formData);
        alert("Student created successfully!");
      }
      await getUsers();
      setCreateUserModalOpen(false);
      setEditUser(null);
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback((debouncedValue) => {
    if (debouncedValue) {
      const filtered = userData.filter(item =>
        item.firstName?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        item.lastName?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        item.guardianName?.toLowerCase().includes(debouncedValue.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(userData);
    }
  }, [userData]);

  const viewSections = [
    {
      title: 'Basic Information',
      fields: [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
        { key: 'gender', label: 'Gender' },
        { key: 'isActive', label: 'Status', type: 'boolean' },
      ]
    },
    {
      title: 'Guardian Information',
      fields: [
        { key: 'guardianName', label: 'Guardian Name' },
        { key: 'guardianPhone', label: 'Guardian Phone' },
      ]
    },
    {
      title: 'Additional Information',
      fields: [
        { key: 'address', label: 'Address' },
        { key: 'admissionDate', label: 'Admission Date', type: 'date' },
      ]
    },
  ];

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const res = await studentService.getStudents();
      console.log("Students API Response:", res);

      if (res.data?.students && res.data.students.length > 0) {
        setUserData(res.data.students);
        setFilteredData(res.data.students);
      } else {
        setUserData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.log("Error fetching students:", error);
      alert("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  // Enrolled Students Tab handlers
  const handleChangeSectionClick = (enrollment) => {
    setSelectedEnrollmentForSection(enrollment);
    setChangeSectionModalOpen(true);
  };

  const handlePromoteClick = (selectedIds, selectedStudents, filters) => {
    setSelectedStudentsForPromotion(selectedStudents);
    setPromotionFilters(filters);
    setPromoteModalOpen(true);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <LoadingComponent isLoading={isLoading} />
      <Heading
        title={"Student Management"}
        showSearch={activeTab === 0}
        buttonArray={activeTab === 0 ? buttonArray : []}
        handleButtonAction={handleButtonAction}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
      />

      {/* Tab Navigation */}
      <StyledTabs value={activeTab} onChange={handleTabChange}>
        <StyledTab label="Student Master" />
        <StyledTab label="Enrolled Students" />
      </StyledTabs>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {showFilter && (
            <CommonFilter
              show={showFilter}
              onClose={() => setShowFilter(false)}
              data={userData}
              filterFields={[
                { key: "gender", label: "Gender" },
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
        </>
      )}

      {activeTab === 1 && (
        <EnrolledStudentsTab
          onChangeSectionClick={handleChangeSectionClick}
          onPromoteClick={handlePromoteClick}
        />
      )}

      {/* Modals */}
      <CreateStudentModal
        open={createUserModalOpen}
        onClose={() => {
          setCreateUserModalOpen(false);
          setEditUser(null);
        }}
        onSubmit={handleCreateUser}
        editData={editUser}
      />

      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        action={"Delete"}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${selectedUser?.firstName}"? This action cannot be undone.`}
      />

      <ViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedUser(null);
        }}
        data={selectedUser}
        title="Student Details"
        sections={viewSections}
      />

      <EnrollStudentModal
        open={enrollModalOpen}
        onClose={() => {
          setEnrollModalOpen(false);
          setSelectedStudentForEnroll(null);
        }}
        student={selectedStudentForEnroll}
        onSuccess={() => getUsers()}
      />

      <EnrollmentHistoryModal
        open={historyModalOpen}
        onClose={() => {
          setHistoryModalOpen(false);
          setSelectedStudentForHistory(null);
        }}
        student={selectedStudentForHistory}
      />

      <ChangeSectionModal
        open={changeSectionModalOpen}
        onClose={() => {
          setChangeSectionModalOpen(false);
          setSelectedEnrollmentForSection(null);
        }}
        enrollment={selectedEnrollmentForSection}
        onSuccess={() => {
          // Refresh will be handled by the tab component
        }}
      />

      <PromoteStudentsModal
        open={promoteModalOpen}
        onClose={() => {
          setPromoteModalOpen(false);
          setSelectedStudentsForPromotion([]);
          setPromotionFilters({});
        }}
        selectedStudents={selectedStudentsForPromotion}
        currentFilters={promotionFilters}
        onSuccess={() => {
          // Refresh will be handled by the tab component
        }}
      />
    </>
  );
};

export default Students;