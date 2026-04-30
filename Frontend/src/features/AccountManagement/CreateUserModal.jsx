import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiCheck } from "react-icons/fi";

// Styled Components
const inputStyles = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#ffffff",
    color: "#374151",
    borderRadius: "10px",
    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
    "&:hover fieldset": { borderColor: "#667eea" },
    "&.Mui-focused fieldset": { borderColor: "#667eea" },
  },
  "& .MuiInputLabel-root": { color: "#6b7280" },
  "& .MuiSelect-icon": { color: "#6b7280" },
  "& .MuiInputAdornment-root": { color: "#9ca3af" },
};

const SectionBox = styled(Box)({
  backgroundColor: "#f9fafb",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "16px",
  border: "1px solid #e5e7eb",
});

const SectionTitle = styled(Typography)({
  color: "#374151",
  fontWeight: 600,
  fontSize: "0.95rem",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const PermissionChip = styled(Chip)(({ selected }) => ({
  backgroundColor: selected ? "rgba(102, 126, 234, 0.15)" : "#ffffff",
  color: selected ? "#4f46e5" : "#6b7280",
  border: selected ? "1.5px solid #667eea" : "1px solid #e5e7eb",
  fontWeight: 500,
  fontSize: "0.8rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: selected ? "rgba(102, 126, 234, 0.25)" : "#f3f4f6",
    borderColor: "#667eea",
  },
}));

// Available permissions based on your system modules
const availablePermissions = [
  { value: "USER_VIEW", label: "View Users", group: "User Management" },
  { value: "USER_UPDATE", label: "Update Users", group: "User Management" },
  { value: "STUDENT_VIEW", label: "View Students", group: "Students" },
  { value: "STUDENT_CREATE", label: "Create Students", group: "Students" },
  { value: "STUDENT_UPDATE", label: "Edit Students", group: "Students" },
  { value: "STUDENT_DELETE", label: "Delete Students", group: "Students" },

  { value: "STUDENT_ENROLL", label: "Enroll Students", group: "Students" },

  { value: "TEACHER_VIEW", label: "View Teachers", group: "Teachers" },
  { value: "TEACHER_CREATE", label: "Create Teachers", group: "Teachers" },
  { value: "TEACHER_EDIT", label: "Edit Teachers", group: "Teachers" },
  { value: "TEACHER_DELETE", label: "Delete Teachers", group: "Teachers" },
  { value: "TEACHER_ASSIGN_VIEW", label: "View Assign Teacher", group: "Teacher" },
  { value: "TEACHER_ASSIGN", label: "Assign Teacher", group: "Teacher" },
  { value: "ATTENDANCE_VIEW", label: "View Attendance", group: "Attendance" },
  { value: "ATTENDANCE_MARK", label: "Mark Attendance", group: "Attendance" },
  { value: "FEES_VIEW", label: "View Fees", group: "Fees" },
  { value: "FEES_COLLECT", label: "Collect Fees", group: "Fees" },
  { value: "FEES_MANAGE", label: "Manage Fees", group: "Fees" },
  { value: "FEE_ASSIGN", label: "Assign Fees", group: "Fees" },
  { value: "FEE_ASSIGN_UPDATE", label: "Update Assign Fees", group: "Fees" },
  { value: "FEE_ASSIGN_DELETE", label: "Delete Assign Fees", group: "Fees" },
  { value: "REPORTS_VIEW", label: "View Reports", group: "Reports" },
  { value: "REPORTS_EXPORT", label: "Export Reports", group: "Reports" },
  { value: "CLASS_MANAGE", label: "Manage Classes", group: "Academic" },
  { value: "SUBJECT_MANAGE", label: "Manage Subjects", group: "Academic" },
  { value: "CLASS_CREATE", label: "Create Class", group: "Class & Section" },
  { value: "CLASS_VIEW", label: "View Class", group: "Class & Section" },
  { value: "SECTION_CREATE", label: "Create Section", group: "Class & Section" },
  { value: "SECTION_VIEW", label: "View Section", group: "Class & Section" },
  { value: "SUBJECT_CREATE", label: "Create Subject", group: "Class & Subject" },
  { value: "SUBJECT_VIEW", label: "View Subject", group: "Class & Subject" },
  { value: "CLASS_SUBJECT_CREATE", label: "Create Class Subject", group: "Class & Subject" },
  { value: "CLASS_SUBJECT_VIEW", label: "View Class Subject", group: "Class & Subject" },

];

// Group permissions by category
const groupedPermissions = availablePermissions.reduce((acc, perm) => {
  if (!acc[perm.group]) acc[perm.group] = [];
  acc[perm.group].push(perm);
  return acc;
}, {});

const roles = [
  { value: "Admin", label: "Admin" },
  { value: "Teacher", label: "Teacher" },
];

const CreateUserModal = ({ open, onClose, onSubmit, editData = null, accounts = [] }) => {
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountId: null,
    role: "Teacher",
    permissions: [],
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Populate form when editData changes
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        email: editData.email || "",
        password: "",
        confirmPassword: "",
        accountId: editData.accountId || null,
        role: editData.role || "Teacher",
        permissions: editData.permissions || [],
        isActive: editData.isActive !== undefined ? editData.isActive : true,
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountId: null,
        role: "Teacher",
        permissions: [],
        isActive: true,
      });
    }
    setErrors({});
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAccountChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, accountId: newValue?._id || null }));
    if (errors.accountId) setErrors((prev) => ({ ...prev, accountId: "" }));
  };

  const handlePermissionToggle = (permission) => {
    setFormData((prev) => {
      const permissions = prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions };
    });
  };

  const handleSelectAllGroup = (group) => {
    const groupPerms = groupedPermissions[group].map((p) => p.value);
    const allSelected = groupPerms.every((p) => formData.permissions.includes(p));

    setFormData((prev) => {
      if (allSelected) {
        // Deselect all in group
        return { ...prev, permissions: prev.permissions.filter((p) => !groupPerms.includes(p)) };
      } else {
        // Select all in group
        const newPerms = [...new Set([...prev.permissions, ...groupPerms])];
        return { ...prev, permissions: newPerms };
      }
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.role) newErrors.role = "Role is required";

    // Password validation
    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (formData.password) {
      // Edit mode - validate only if password is provided
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const submitData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        permissions: formData.permissions,
        isActive: formData.isActive,
        accountId: formData.accountId,
      };

      // Include password only if provided
      if (formData.password) {
        submitData.password = formData.password;
      }

      // Include id for edit mode
      if (isEditMode && editData._id) {
        submitData._id = editData._id;
      }

      onSubmit(submitData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountId: null,
      role: "Teacher",
      permissions: [],
      isActive: true,
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  // Get selected account object for Autocomplete
  const selectedAccount = accounts.find((acc) => acc._id === formData.accountId) || null;

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Edit User" : "Create New User"}
      maxWidth="md"
      actions={
        <Box sx={{ display: "flex", gap: 1.5, width: "100%", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              color: "#374151",
              borderColor: "#d1d5db",
              textTransform: "none",
              px: 3,
              borderRadius: "10px",
              "&:hover": { borderColor: "#9ca3af" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textTransform: "none",
              px: 3,
              borderRadius: "10px",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(102, 126, 234, 0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              },
            }}
            startIcon={<FiCheck size={16} />}
          >
            {isEditMode ? "Update User" : "Create User"}
          </Button>
        </Box>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        {/* Basic Information */}
        <SectionBox>
          <SectionTitle>
            <FiUser size={18} /> Basic Information
          </SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="John Doe"
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiUser size={16} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="john@example.com"
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiMail size={16} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Role *"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={!!errors.role}
                helperText={errors.role}
                sx={inputStyles}
                InputLabelProps={{ shrink: true }}
                SelectProps={{ displayEmpty: true }}
              >
                {roles.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", height: "100%", pl: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleSwitchChange}
                      name="isActive"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#22c55e",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#22c55e",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "#374151", fontWeight: 500 }}>
                      {formData.isActive ? "Active" : "Inactive"}
                    </Typography>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </SectionBox>

        {/* Account Selection (Optional) */}
        {/* <SectionBox>
          <SectionTitle>
            <FiShield size={18} /> Account Assignment
          </SectionTitle>
          <Autocomplete
            options={accounts}
            getOptionLabel={(option) => `${option.name} (${option.code})`}
            value={selectedAccount}
            onChange={handleAccountChange}
            noOptionsText="No accounts available"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Account (Optional)"
                  placeholder="Search accounts..."
                  sx={inputStyles}
                  helperText="Leave empty for SuperAdmin users"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                      {option.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {option.code} • {option.type}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </SectionBox>
 */}

        {/* Password Section */}
        <SectionBox>
          <SectionTitle>
            <FiLock size={18} />
            {isEditMode ? "Change Password (Optional)" : "Set Password"}
          </SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={isEditMode ? "New Password" : "Password *"}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || (isEditMode ? "Leave blank to keep current" : "Minimum 6 characters")}
                sx={inputStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={inputStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </SectionBox>

        {/* Permissions Section */}
        <SectionBox>
          <SectionTitle>
            <FiShield size={18} /> Permissions
          </SectionTitle>
          <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
            Select the permissions for this user. Click on group name to select/deselect all.
          </Typography>

          {Object.entries(groupedPermissions).map(([group, perms]) => {
            const allSelected = perms.every((p) => formData.permissions.includes(p.value));
            const someSelected = perms.some((p) => formData.permissions.includes(p.value));

            return (
              <Box key={group} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { opacity: 0.8 },
                  }}
                  onClick={() => handleSelectAllGroup(group)}
                >
                  <Checkbox
                    size="small"
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    sx={{
                      color: "#d1d5db",
                      "&.Mui-checked": { color: "#667eea" },
                      "&.MuiCheckbox-indeterminate": { color: "#667eea" },
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#374151", fontWeight: 600, fontSize: "0.85rem" }}
                  >
                    {group}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pl: 4 }}>
                  {perms.map((perm) => (
                    <PermissionChip
                      key={perm.value}
                      label={perm.label}
                      selected={formData.permissions.includes(perm.value)}
                      onClick={() => handlePermissionToggle(perm.value)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            );
          })}

          {formData.permissions.length > 0 && (
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e5e7eb" }}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Selected: {formData.permissions.length} permission(s)
              </Typography>
            </Box>
          )}
        </SectionBox>
      </Box>
    </CommonModal>
  );
};

export default CreateUserModal;
