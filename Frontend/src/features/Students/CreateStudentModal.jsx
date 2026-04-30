import React, { useState, useEffect } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import { FiUser, FiPhone, FiMapPin, FiCalendar, FiUsers, FiCheck } from "react-icons/fi";

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

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const CreateStudentModal = ({ open, onClose, onSubmit, editData = null }) => {
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    guardianName: "",
    guardianPhone: "",
    address: "",
    admissionDate: new Date().toISOString().split("T")[0],
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  // Populate form when editData changes
  useEffect(() => {
    if (editData) {
      setFormData({
        firstName: editData.firstName || "",
        lastName: editData.lastName || "",
        dateOfBirth: editData.dateOfBirth
          ? new Date(editData.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: editData.gender || "",
        guardianName: editData.guardianName || "",
        guardianPhone: editData.guardianPhone || "",
        address: editData.address || "",
        admissionDate: editData.admissionDate
          ? new Date(editData.admissionDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        isActive: editData.isActive !== undefined ? editData.isActive : true,
      });
    } else {
      // Reset form for create mode
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        guardianName: "",
        guardianPhone: "",
        address: "",
        admissionDate: new Date().toISOString().split("T")[0],
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

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian name is required";
    if (!formData.guardianPhone.trim()) {
      newErrors.guardianPhone = "Guardian phone is required";
    } else if (!/^\d{10}$/.test(formData.guardianPhone.replace(/\D/g, ""))) {
      newErrors.guardianPhone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        isActive: formData.isActive,
      };

      // Include optional fields only if provided
      if (formData.dateOfBirth) {
        submitData.dateOfBirth = formData.dateOfBirth;
      }
      if (formData.gender) {
        submitData.gender = formData.gender;
      }
      if (formData.address) {
        submitData.address = formData.address;
      }
      if (formData.admissionDate) {
        submitData.admissionDate = formData.admissionDate;
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
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      guardianName: "",
      guardianPhone: "",
      address: "",
      admissionDate: new Date().toISOString().split("T")[0],
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Edit Student" : "Create New Student"}
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
            {isEditMode ? "Update Student" : "Create Student"}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name *"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                placeholder="John"
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name *"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                placeholder="Doe"
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                sx={inputStyles}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiCalendar size={16} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                sx={inputStyles}
                InputLabelProps={{ shrink: true }}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="">
                  <em>Select Gender</em>
                </MenuItem>
                {genderOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </SectionBox>

        {/* Guardian Information */}
        <SectionBox>
          <SectionTitle>
            <FiUsers size={18} /> Guardian / Parent Information
          </SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Guardian Name *"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                error={!!errors.guardianName}
                helperText={errors.guardianName}
                placeholder="Parent/Guardian Name"
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Guardian Phone *"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                error={!!errors.guardianPhone}
                helperText={errors.guardianPhone}
                placeholder="9876543210"
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiPhone size={16} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </SectionBox>

        {/* Additional Information */}
        <SectionBox>
          <SectionTitle>
            <FiMapPin size={18} /> Additional Information
          </SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address"
                multiline
                rows={2}
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                      <FiMapPin size={16} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Admission Date"
                name="admissionDate"
                type="date"
                value={formData.admissionDate}
                onChange={handleChange}
                sx={inputStyles}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiCalendar size={16} />
                    </InputAdornment>
                  ),
                }}
              />
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
      </Box>
    </CommonModal>
  );
};

export default CreateStudentModal;
