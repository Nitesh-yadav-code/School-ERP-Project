import React, { useCallback, useEffect, useState } from 'react'
import CommonTable from '../../commonComponents/CommonTable';

import { FiEye, FiEdit, FiTrash2, FiFileText, FiDownload, FiFilter, FiUserPlus } from "react-icons/fi";
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
import accountService from '../../services/accountServics';
import authService from '../../services/authService';

const columns = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Email", accessor: "email", sortable: true },
  { header: "Role", accessor: "role", sortable: true },
  {
    header: "Status",
    accessor: "isActive",
    sortable: true,
    render: (value) => (
      <span style={{ color: value === true ? "#22c55e" : "#ef4444" }}>
       { value === true ? "Active" : "InActive" }
      </span>
    ),
  },
];

const buttonArray = [
  { name: null, key: "excel", icon: <FaFileExcel /> },
  { name: null, key: "csv", icon: <FaFileCsv /> },
  { name: null, key: "pdf", icon: <FaFilePdf /> },
  { name: "Create User", key: "create_user", icon: <FiUserPlus /> },
  { name: "Filter", key: "filter", icon: <FiFilter /> },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  
  // Fixed: Separate state for users and accounts
  const [userData, setUserData] = useState([]);  // Stores users
  const [accounts, setAccounts] = useState([]);   // Stores accounts for dropdown

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
    }
  };

  const confirmDelete = async () => {
    console.log("Deleting user:", selectedUser);
    // Add your API call here to delete user
    // await authService.deleteUser(selectedUser._id);
    // await getUsers(); // Refresh list
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

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
        setEditUser(null);
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


  // Fixed: Handle user creation/update
  const handleCreateUser = async (formData) => {
    setIsLoading(true);
    try {
      if (editUser) {
        console.log("Updating user:", editUser);
        // await authService.updateUser(editUser._id, formData);
        await authService.updateUser(editUser._id, formData)
        alert("User updated successfully!");
      } else {
        console.log("Creating user:", formData);
        await authService.createUser(formData);
        alert("User created successfully!");
      }
      await getUsers(); // Refresh user list
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
        item.name?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        item.email?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        item.role?.toLowerCase().includes(debouncedValue.toLowerCase())
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
        { key: 'name', label: 'User Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'isActive', label: 'Status', type: 'boolean' },
        { key: 'createdAt', label: 'Joining Date', type: 'date' },
      ]
    },
    {
      title: 'Account Assignment',
      fields: [
        { key: 'accountId.name', label: 'Account Name' },
        { key: 'accountId.code', label: 'Account Code' },
      ]
    },
    {
      title: 'Permissions',
      fields: [
        { key: 'permissions', label: 'Permissions', type: 'array', fullWidth: true },
      ]
    },
  ];

  // Fixed: Fetch users
  const getUsers = async () => {
    setIsLoading(true);
    try {
      const res = await authService.getUsers();
      console.log("Users API Response:", res);
      
      if (res.data?.users && res.data.users.length > 0) {
        setUserData(res.data.users);
        setFilteredData(res.data.users);
      } else {
        setUserData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
      alert("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed: Fetch accounts for the dropdown in CreateUserModal
  const getAccounts = async () => {
    try {
      const res = await accountService.getAccounts();
      console.log("Accounts API Response:", res);
      
      if (res.data.accountData && res.data.accountData.length > 0) {
        setAccounts(res.data.accountData);
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.log("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    getUsers();     // Fetch users for the table
    getAccounts();  // Fetch accounts for the dropdown
  }, []);

  return (
    <>
      <LoadingComponent isLoading={isLoading} />
      <Heading
        title={"User Management"}
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
          data={userData}
          filterFields={[
            { key: "role", label: "Role" },
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

      <CreateUserModal
        open={createUserModalOpen}
        onClose={() => {
          setCreateUserModalOpen(false);
          setEditUser(null);
        }}
        onSubmit={handleCreateUser}
        editData={editUser}
        accounts={accounts}  // Pass accounts list for dropdown
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
        title="User Details"
        sections={viewSections}
      />
    </>
  );
};

export default UserManagement;