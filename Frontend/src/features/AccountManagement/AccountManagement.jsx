import React, { useCallback, useEffect, useState } from 'react'
import CommonTable from '../../commonComponents/CommonTable';

import { FiEye, FiEdit, FiTrash2, FiFileText, FiDownload, FiFilter, FiUserPlus } from "react-icons/fi";
// import { SiMicrosoftexcel } from "react-icons/si";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import Heading from '../../commonComponents/Heading';
import LoadingComponent from '../../commonComponents/Loader';
import CreateUserModal from './CreateUserModal';
import CommonFilter from '../../commonComponents/CommonFilter';
import { exportData } from '../../utils/exportUtils';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ConfirmModal from '../../commonComponents/ConfirmModal';
import ViewModal from '../../commonComponents/ViewModal';
import CreateAccountModal from './CreateAccountModal';
import accountService from '../../services/accountServics';

const columns = [
  { header: "Account Name", accessor: "name", sortable: true },
  { header: "Code", accessor: "code", sortable: true },
  { header: "Type", accessor: "type", sortable: true },
  {
    header: "Status",
    accessor: "status",
    sortable: true,
    render: (value) => (
      <span style={{ color: value === "active" ? "#22c55e" : "#ef4444" }}>
        {value?.charAt(0).toUpperCase() + value?.slice(1)}
      </span>
    ),
  },
  { header: "Plan", accessor: "subscription.plan", sortable: true },
];




const buttonArray = [
  { name: null, key: "excel", icon: <FaFileExcel /> },
  { name: null, key: "csv", icon: <FaFileCsv /> },
  { name: null, key: "pdf", icon: <FaFilePdf /> },
  { name: "Create User", key: "create_user", icon: <FiUserPlus /> },
  { name: "Filter", key: "filter", icon: <FiFilter /> },
];




const AccountManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null); // For edit mode
  const [accountData, setAccountData] = useState([])
  
const handleActionClick = (action, rowData) => {
    console.log(rowData, "rowData");
    if (action === "edit") {
      setEditUser(rowData);
      setCreateUserModalOpen(true);
    } else if (action === "delete") {
      setDeleteModalOpen(true)
      setSelectedUser(rowData);
    } else if (action === "view") {
     setViewModalOpen(true);
      setSelectedUser(rowData);
    }
  };

  const confirmDelete=()=>{
console.log("Deleting user:", selectedUser);
    // Add your API call here to delete user
    setDeleteModalOpen(false);
    setSelectedUser(null)
  }

const getActionIcons = (rowData, index) => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton
        size="small"
        onClick={() => handleActionClick("view", rowData, index)}
        title="View User Details"
      >
        <FiEye fontSize="medium" style={{ color: "#22c55e" }} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => handleActionClick("edit", rowData, index)}
        title="Edit User"
      >
        <FiEdit fontSize="medium" style={{ color: "#3b82f6" }} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => handleActionClick("delete", rowData, index)}
        title="Delete User"
      >
        <FiTrash2 fontSize="medium" style={{ color: "#ef4444" }} />
      </IconButton>
    </Box>
  );

  const handleButtonAction = (action) => {
    switch (action) {
      case "create_user":
        setEditUser(null); // Ensure create mode
        setCreateUserModalOpen(true);
        break;
      case "filter":
        setShowFilter(true);
        break;
      case "excel":
        exportData('excel', filteredData, columns, 'user_management', 'User Management Data');
        break;
      case "pdf":
        exportData('pdf', filteredData, columns, 'user_management', 'User Management Data');
        break;
      case "csv":
        exportData('csv', filteredData, columns, 'user_management');
        break;
      default:
        break;
    }
  };

const handleCreateAccount = async(accountData) => {
  if (editUser) {
    console.log("Updating account:", accountData);
    // Add your API call to update account
  } else {
    console.log("Creating account:", accountData);
    setIsLoading(true)
    try {
      const res = await accountService.createAccount(accountData)
      
      // After successful creation, refresh the accounts list
      await getAccounts();  // Call getAccounts to refresh
      setCreateUserModalOpen(false);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Error creating account:", error);
      alert(error.response?.data?.message || "Server error");
    }finally{
      setIsLoading(false)
    }
  }
};


  const handleSearch = useCallback((debouncedValue)=>{
    if(debouncedValue){
      const filterd = accountData.filter(item => 
        // item.name.toLowerCase().includes(debouncedValue.toLowerCase())
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(debouncedValue.toLowerCase())
        )
      )
      setFilteredData(filterd)
    }else{
      setFilteredData(accountData);
    }
  }, [accountData])

  // View modal sections configuration
  const viewSections = [
    {
      title: 'Basic Information',
      fields: [
        { key: 'name', label: 'Account Name' },
        { key: 'code', label: 'Code' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'board', label: 'Board' },
        { key: 'registrationNumber', label: 'Registration No.' },
        { key: 'academicYearStart', label: 'Academic Year Start', type: 'date' },
      ]
    },
    {
      title: 'Contact Details',
      fields: [
        { key: 'contact.email', label: 'Email' },
        { key: 'contact.phone', label: 'Phone' },
        { key: 'contact.alternatePhone', label: 'Alternate Phone' },
      ]
    },
    {
      title: 'Address',
      fields: [
        { key: 'address.line1', label: 'Address Line 1' },
        { key: 'address.line2', label: 'Address Line 2' },
        { key: 'address.city', label: 'City' },
        { key: 'address.state', label: 'State' },
        { key: 'address.pincode', label: 'Pincode' },
        { key: 'address.country', label: 'Country' },
      ]
    },
    {
      title: 'Subscription & Limits',
      fields: [
        { key: 'subscription.plan', label: 'Plan' },
        { key: 'subscription.isTrial', label: 'Trial', type: 'boolean' },
        { key: 'limits.maxUsers', label: 'Max Users' },
        { key: 'limits.maxStudents', label: 'Max Students' },
        { key: 'limits.maxTeachers', label: 'Max Teachers' },
      ]
    },
    {
      title: 'Modules',
      fields: [
        { key: 'modules.students', label: 'Students', type: 'boolean' },
        { key: 'modules.teachers', label: 'Teachers', type: 'boolean' },
        { key: 'modules.attendance', label: 'Attendance', type: 'boolean' },
        { key: 'modules.fees', label: 'Fees', type: 'boolean' },
        { key: 'modules.exams', label: 'Exams', type: 'boolean' },
        { key: 'modules.reports', label: 'Reports', type: 'boolean' },
        { key: 'modules.transport', label: 'Transport', type: 'boolean' },
        { key: 'modules.hostel', label: 'Hostel', type: 'boolean' },
      ]
    },
    {
      title: 'Additional Info',
      fields: [
        { key: 'branding.themeColor', label: 'Theme Color' },
        { key: 'notes', label: 'Notes', fullWidth: true },
      ]
    },
  ];

const getAccounts = async()=>{
  setIsLoading(true);  // Changed from false to true
  try {
    const res = await accountService.getAccounts();
    console.log("API Response:", res);  // Debug log
    
    // Fixed: Use res.accountData (matches API response)
    if(res.data.accountData && res.data.accountData.length > 0){
      setAccountData(res.data.accountData);
      setFilteredData(res.data.accountData);  // Also set filtered data initially
    } else {
      setAccountData([]);
      setFilteredData([]);
    }
  } catch (error) {
    console.log("Error fetching accounts:", error)
    alert("Failed to fetch accounts");
  }finally{
    setIsLoading(false)
  }
}

useEffect(()=>{
  getAccounts();
},[])

console.log(accountData, "nn")
  return (
    <>
    <LoadingComponent isLoading={isLoading}/>
    <Heading 
    title={"Account Managment"}
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
        onClose={() => {
          setShowFilter(false);
        }}
        data={accountData}
        filterFields={[
          { key: "status", label: "Status" },
          { key: "name", label: "Account Name" },
        ]}
        onFilter={(filtered) => {
          setFilteredData(filtered);
        }}
      />
    )}
    
    <CommonTable
  columns={columns}
  data={filteredData}
  actions={getActionIcons}
/>
<CreateAccountModal
  open={createUserModalOpen}
  onClose={() => setCreateUserModalOpen(false)}
  onSubmit={handleCreateAccount}
  editData={editUser} // null for create mode
/>
    <ConfirmModal
      open={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      onConfirm={confirmDelete}
      action={"Delete"}
      title="Confirm Delete"
      message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
    />

    <ViewModal
      open={viewModalOpen}
      onClose={() => {
        setViewModalOpen(false);
        setSelectedUser(null);
      }}
      data={selectedUser}
      title="Account"
      sections={viewSections}
    />
      
    </>
  )
}

export default AccountManagement