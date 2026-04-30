import React, { useState, useEffect, useRef } from "react";
import CommonModal from "../../commonComponents/CommonModal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiSettings,
  FiCreditCard,
  FiImage,
  FiFileText,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiUpload,
  FiX,
  FiDroplet,
} from "react-icons/fi";

// ========================= STYLED COMPONENTS =========================

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#ffffff",
    color: "#374151",
    borderRadius: "8px",
    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
    "&:hover fieldset": { borderColor: "#667eea" },
    "&.Mui-focused fieldset": { borderColor: "#667eea" },
  },
  "& .MuiInputLabel-root": { color: "#6b7280" },
  "& .MuiSelect-icon": { color: "#6b7280" },
  "& .MuiInputAdornment-root": { color: "#6b7280" },
};

const selectStyles = {
  ...inputStyles,
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  minWidth: "100%",
};

const LogoUploadBox = styled(Box)(({ hasImage }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: hasImage ? "auto" : "140px",
  border: "2px dashed rgba(102, 126, 234, 0.4)",
  borderRadius: "12px",
  backgroundColor: "rgba(102, 126, 234, 0.03)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  padding: "16px",
  "&:hover": {
    borderColor: "#667eea",
    backgroundColor: "rgba(102, 126, 234, 0.08)",
  },
}));

const ColorPickerWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 12px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: "rgba(102, 126, 234, 0.5)",
  },
  "&:focus-within": {
    borderColor: "#667eea",
  },
});

const SectionTitle = styled(Typography)({
  color: "#374151",
  fontWeight: 600,
  fontSize: "1rem",
  marginBottom: "12px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const SectionBox = styled(Box)({
  backgroundColor: "#f9fafb",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "16px",
  border: "1px solid rgba(0, 0, 0, 0.06)",
});

const ModuleChip = styled(Chip)(({ active }) => ({
  backgroundColor: active ? "rgba(102, 126, 234, 0.15)" : "#f3f4f6",
  color: active ? "#4f46e5" : "#6b7280",
  border: active ? "1px solid #667eea" : "1px solid rgba(0, 0, 0, 0.1)",
  fontWeight: 500,
  transition: "all 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: active ? "rgba(102, 126, 234, 0.25)" : "#e5e7eb",
  },
}));

const StyledStepper = styled(Stepper)({
  "& .MuiStepLabel-root .Mui-completed": {
    color: "#22c55e",
  },
  "& .MuiStepLabel-root .Mui-active": {
    color: "#667eea",
  },
  "& .MuiStepLabel-label": {
    color: "#6b7280",
    fontSize: "0.85rem",
  },
  "& .MuiStepLabel-label.Mui-active": {
    color: "#374151",
    fontWeight: 600,
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: "#22c55e",
  },
  "& .MuiStepIcon-root": {
    color: "#d1d5db",
  },
  "& .MuiStepConnector-line": {
    borderColor: "#d1d5db",
  },
});

// ========================= CONSTANTS =========================

const steps = ["Basic Info", "Contact & Address", "Settings", "Admin Setup", "Review"];

const institutionTypes = [
  { value: "school", label: "School" },
  { value: "college", label: "College" },
  { value: "institute", label: "Institute" },
];

const statusOptions = [
  { value: "active", label: "Active", color: "#22c55e" },
  { value: "suspended", label: "Suspended", color: "#f59e0b" },
  { value: "inactive", label: "Inactive", color: "#ef4444" },
];

const boardOptions = [
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "STATE", label: "State Board" },
  { value: "IB", label: "IB" },
  { value: "OTHER", label: "Other" },
];

const planOptions = [
  { value: "free", label: "Free", color: "#6b7280" },
  { value: "basic", label: "Basic", color: "#22d3ee" },
  { value: "pro", label: "Pro", color: "#667eea" },
  { value: "enterprise", label: "Enterprise", color: "#f59e0b" },
];

const modulesList = [
  { key: "students", label: "Students", default: true },
  { key: "teachers", label: "Teachers", default: true },
  { key: "attendance", label: "Attendance", default: true },
  { key: "exams", label: "Exams", default: false },
  { key: "fees", label: "Fees", default: false },
  { key: "transport", label: "Transport", default: false },
  { key: "hostel", label: "Hostel", default: false },
  { key: "reports", label: "Reports", default: true },
];

const defaultFormData = {
  // Basic Info
  name: "",
  code: "",
  type: "school",
  status: "active",
  registrationNumber: "",
  board: "",
  academicYearStart: "",

  // Contact
  contact: {
    email: "",
    phone: "",
    alternatePhone: "",
  },

  // Address
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  },

  // Subscription
  subscription: {
    plan: "free",
    startDate: "",
    endDate: "",
    isTrial: true,
  },

  // Limits
  limits: {
    maxUsers: 10,
    maxStudents: 100,
    maxTeachers: 10,
  },

  // Modules
  modules: {
    students: true,
    teachers: true,
    attendance: true,
    exams: false,
    fees: false,
    transport: false,
    hostel: false,
    reports: true,
  },

  // Branding
  branding: {
    logoFile: null,
    logoPreview: "",
    themeColor: "#1976d2",
  },

  // Admin
  admin: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  },

  // Notes
  notes: "",
};

// ========================= MAIN COMPONENT =========================

const CreateAccountModal = ({ open, onClose, onSubmit, editData = null }) => {
  const isEditMode = !!editData;
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const logoInputRef = useRef(null);

  // Populate form when editData changes
  useEffect(() => {
    if (editData) {
      setFormData({
        ...defaultFormData,
        ...editData,
        contact: { ...defaultFormData.contact, ...editData.contact },
        address: { ...defaultFormData.address, ...editData.address },
        subscription: { ...defaultFormData.subscription, ...editData.subscription },
        limits: { ...defaultFormData.limits, ...editData.limits },
        modules: { ...defaultFormData.modules, ...editData.modules },
        branding: { ...defaultFormData.branding, ...editData.branding },
        admin: { ...defaultFormData.admin, ...editData.admin },
      });
    } else {
      setFormData(defaultFormData);
    }
    setActiveStep(0);
    setErrors({});
  }, [editData, open]);

  // ========================= HANDLERS =========================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) setErrors((prev) => ({ ...prev, [errorKey]: "" }));
  };

  const handleModuleToggle = (moduleKey) => {
    setFormData((prev) => ({
      ...prev,
      modules: { ...prev.modules, [moduleKey]: !prev.modules[moduleKey] },
    }));
  };

  // Logo upload handlers
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, logo: "File size must be less than 5MB" }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, logo: "Please upload an image file" }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          branding: {
            ...prev.branding,
            logoFile: file,
            logoPreview: reader.result,
          },
        }));
        setErrors((prev) => ({ ...prev, logo: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        logoFile: null,
        logoPreview: "",
      },
    }));
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleColorChange = (color) => {
    // Validate hex color
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    if (isValidHex || color === "" || color.startsWith("#")) {
      handleNestedChange("branding", "themeColor", color);
    }
  };

  // ========================= VALIDATION =========================

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = "Institution name is required";
      if (!formData.code.trim()) newErrors.code = "Code is required";
      else if (!/^[A-Z0-9]+$/.test(formData.code.toUpperCase())) {
        newErrors.code = "Code must be alphanumeric";
      }
    }

    if (step === 1) {
      if (!formData.contact.email.trim()) {
        newErrors["contact.email"] = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.contact.email)) {
        newErrors["contact.email"] = "Invalid email format";
      }
      if (!formData.contact.phone.trim()) {
        newErrors["contact.phone"] = "Phone is required";
      } else if (!/^\d{10}$/.test(formData.contact.phone.replace(/\D/g, ""))) {
        newErrors["contact.phone"] = "Invalid phone number";
      }
      if (!formData.address.city.trim()) {
        newErrors["address.city"] = "City is required";
      }
      if (!formData.address.state.trim()) {
        newErrors["address.state"] = "State is required";
      }
    }

    // Admin validation (step 3) - only for new accounts
    if (step === 3 && !isEditMode) {
      if (!formData.admin.name.trim()) {
        newErrors["admin.name"] = "Admin name is required";
      }
      if (!formData.admin.email.trim()) {
        newErrors["admin.email"] = "Admin email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.admin.email)) {
        newErrors["admin.email"] = "Invalid email format";
      }
      if (!formData.admin.password.trim()) {
        newErrors["admin.password"] = "Password is required";
      } else if (formData.admin.password.length < 6) {
        newErrors["admin.password"] = "Password must be at least 6 characters";
      }
      if (formData.admin.password !== formData.admin.confirmPassword) {
        newErrors["admin.confirmPassword"] = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      const submitData = {
        ...formData,
        code: formData.code.toUpperCase(),
      };
      if (isEditMode && editData._id) {
        submitData._id = editData._id;
      }
      onSubmit(submitData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    setErrors({});
    setActiveStep(0);
    onClose();
  };

  // ========================= RENDER STEPS =========================

  const renderBasicInfo = () => (
    <>
      <SectionBox>
        <SectionTitle>
          <FiUser size={18} /> Institution Details
        </SectionTitle>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Institution Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="e.g., Sunrise Public School"
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Code *"
              name="code"
              value={formData.code}
              onChange={(e) =>
                handleChange({
                  target: { name: "code", value: e.target.value.toUpperCase() },
                })
              }
              error={!!errors.code}
              helperText={errors.code || "Unique identifier (e.g., SUNRISEPS)"}
              placeholder="SUNRISEPS"
              sx={inputStyles}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                ...selectStyles,
                "& .MuiInputLabel-root": {
                  color: "#6b7280",
                  "&.Mui-focused": { color: "#667eea" },
                },
                "& .MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              }}
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: "#ffffff",
                      "& .MuiMenuItem-root": {
                        color: "#374151",
                        "&:hover": { bgcolor: "rgba(102, 126, 234, 0.2)" },
                        "&.Mui-selected": { bgcolor: "rgba(102, 126, 234, 0.3)" },
                      },
                    },
                  },
                },
              }}
            >
              {institutionTypes.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                ...selectStyles,
                "& .MuiInputLabel-root": {
                  color: "#6b7280",
                  "&.Mui-focused": { color: "#667eea" },
                },
                "& .MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              }}
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: "#ffffff",
                      "& .MuiMenuItem-root": {
                        color: "#374151",
                        "&:hover": { bgcolor: "rgba(102, 126, 234, 0.2)" },
                        "&.Mui-selected": { bgcolor: "rgba(102, 126, 234, 0.3)" },
                      },
                    },
                  },
                },
              }}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: opt.color,
                      }}
                    />
                    {opt.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              label="Board"
              name="board"
              value={formData.board}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                ...selectStyles,
                "& .MuiInputLabel-root": {
                  color: "#6b7280",
                  "&.Mui-focused": { color: "#667eea" },
                },
                "& .MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              }}
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: "#ffffff",
                      "& .MuiMenuItem-root": {
                        color: "#374151",
                        "&:hover": { bgcolor: "rgba(102, 126, 234, 0.2)" },
                        "&.Mui-selected": { bgcolor: "rgba(102, 126, 234, 0.3)" },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                <em style={{ color: "#9ca3af" }}>Select Board</em>
              </MenuItem>
              {boardOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="Official registration number"
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Academic Year Start"
              name="academicYearStart"
              type="date"
              value={formData.academicYearStart}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={inputStyles}
            />
          </Grid>
        </Grid>
      </SectionBox>
    </>
  );

  const renderContactAddress = () => (
    <>
      <SectionBox>
        <SectionTitle>
          <FiMail size={18} /> Contact Information
        </SectionTitle>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Email *"
              value={formData.contact.email}
              onChange={(e) => handleNestedChange("contact", "email", e.target.value)}
              error={!!errors["contact.email"]}
              helperText={errors["contact.email"]}
              placeholder="school@example.com"
              sx={inputStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiMail />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Phone *"
              value={formData.contact.phone}
              onChange={(e) => handleNestedChange("contact", "phone", e.target.value)}
              error={!!errors["contact.phone"]}
              helperText={errors["contact.phone"]}
              placeholder="9876543210"
              sx={inputStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiPhone />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Alternate Phone"
              value={formData.contact.alternatePhone}
              onChange={(e) => handleNestedChange("contact", "alternatePhone", e.target.value)}
              placeholder="Optional"
              sx={inputStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiPhone />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </SectionBox>

      <SectionBox>
        <SectionTitle>
          <FiMapPin size={18} /> Address
        </SectionTitle>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 1"
              value={formData.address.line1}
              onChange={(e) => handleNestedChange("address", "line1", e.target.value)}
              placeholder="Street address"
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address Line 2"
              value={formData.address.line2}
              onChange={(e) => handleNestedChange("address", "line2", e.target.value)}
              placeholder="Apartment, suite, etc. (optional)"
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="City *"
              value={formData.address.city}
              onChange={(e) => handleNestedChange("address", "city", e.target.value)}
              error={!!errors["address.city"]}
              helperText={errors["address.city"]}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="State *"
              value={formData.address.state}
              onChange={(e) => handleNestedChange("address", "state", e.target.value)}
              error={!!errors["address.state"]}
              helperText={errors["address.state"]}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Country"
              value={formData.address.country}
              onChange={(e) => handleNestedChange("address", "country", e.target.value)}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Pincode"
              value={formData.address.pincode}
              onChange={(e) => handleNestedChange("address", "pincode", e.target.value)}
              placeholder="110001"
              sx={inputStyles}
            />
          </Grid>
        </Grid>
      </SectionBox>
    </>
  );

  const renderSettings = () => (
    <>
      <SectionBox>
        <SectionTitle>
          <FiCreditCard size={18} /> Subscription Plan
        </SectionTitle>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Plan"
              value={formData.subscription.plan}
              onChange={(e) => handleNestedChange("subscription", "plan", e.target.value)}
              sx={selectStyles}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: "#ffffff",
                      "& .MuiMenuItem-root": {
                        color: "#374151",
                        "&:hover": { bgcolor: "rgba(102, 126, 234, 0.2)" },
                        "&.Mui-selected": { bgcolor: "rgba(102, 126, 234, 0.3)" },
                      },
                    },
                  },
                },
              }}
            >
              {planOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: opt.color,
                      }}
                    />
                    {opt.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.subscription.startDate}
              onChange={(e) => handleNestedChange("subscription", "startDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={formData.subscription.endDate}
              onChange={(e) => handleNestedChange("subscription", "endDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.subscription.isTrial}
                  onChange={(e) => handleNestedChange("subscription", "isTrial", e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#667eea" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#667eea",
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: "#374151", fontSize: "0.9rem" }}>
                  Trial Period
                </Typography>
              }
            />
          </Grid>
        </Grid>
      </SectionBox>

      <SectionBox>
        <SectionTitle>
          <FiSettings size={18} /> Usage Limits
        </SectionTitle>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Max Users"
              type="number"
              value={formData.limits.maxUsers}
              onChange={(e) => handleNestedChange("limits", "maxUsers", parseInt(e.target.value) || 0)}
              sx={inputStyles}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Max Students"
              type="number"
              value={formData.limits.maxStudents}
              onChange={(e) => handleNestedChange("limits", "maxStudents", parseInt(e.target.value) || 0)}
              sx={inputStyles}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Max Teachers"
              type="number"
              value={formData.limits.maxTeachers}
              onChange={(e) => handleNestedChange("limits", "maxTeachers", parseInt(e.target.value) || 0)}
              sx={inputStyles}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
        </Grid>
      </SectionBox>

      <SectionBox>
        <SectionTitle>
          <FiSettings size={18} /> Enabled Modules
        </SectionTitle>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {modulesList.map((module) => (
            <ModuleChip
              key={module.key}
              label={module.label}
              active={formData.modules[module.key] ? 1 : 0}
              onClick={() => handleModuleToggle(module.key)}
              icon={formData.modules[module.key] ? <FiCheck size={14} /> : undefined}
            />
          ))}
        </Box>
      </SectionBox>

      <SectionBox>
        <SectionTitle>
          <FiImage size={18} /> Branding
        </SectionTitle>
        <Grid container spacing={3}>
          {/* Logo Upload Section */}
          <Grid item xs={12} md={6}>
            <Typography sx={{ color: "#6b7280", fontSize: "0.875rem", mb: 1.5 }}>
              Logo
            </Typography>
            <input
              type="file"
              ref={logoInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              style={{ display: "none" }}
              id="logo-upload"
            />
            <LogoUploadBox
              hasImage={!!formData.branding.logoPreview}
              onClick={() => !formData.branding.logoPreview && logoInputRef.current?.click()}
            >
              {formData.branding.logoPreview ? (
                <Box sx={{ position: "relative", width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    <Avatar
                      src={formData.branding.logoPreview}
                      alt="Logo Preview"
                      variant="rounded"
                      sx={{
                        width: 80,
                        height: 80,
                        border: "2px solid rgba(102, 126, 234, 0.3)",
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: "#374151", fontSize: "0.9rem", fontWeight: 500 }}>
                        {formData.branding.logoFile?.name || "Logo uploaded"}
                      </Typography>
                      <Typography sx={{ color: "#6b7280", fontSize: "0.75rem", mt: 0.5 }}>
                        {formData.branding.logoFile
                          ? `${(formData.branding.logoFile.size / 1024).toFixed(1)} KB`
                          : ""}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          logoInputRef.current?.click();
                        }}
                        sx={{
                          color: "#667eea",
                          bgcolor: "rgba(102, 126, 234, 0.1)",
                          "&:hover": { bgcolor: "rgba(102, 126, 234, 0.2)" },
                        }}
                      >
                        <FiUpload size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLogo();
                        }}
                        sx={{
                          color: "#ef4444",
                          bgcolor: "rgba(239, 68, 68, 0.1)",
                          "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" },
                        }}
                      >
                        <FiX size={16} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      bgcolor: "rgba(102, 126, 234, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1.5,
                    }}
                  >
                    <FiUpload size={24} color="#667eea" />
                  </Box>
                  <Typography sx={{ color: "#374151", fontWeight: 500, fontSize: "0.9rem" }}>
                    Click to upload logo
                  </Typography>
                  <Typography sx={{ color: "#6b7280", fontSize: "0.75rem", mt: 0.5 }}>
                    PNG, JPG up to 5MB
                  </Typography>
                </>
              )}
            </LogoUploadBox>
            {errors.logo && (
              <Typography sx={{ color: "#ef4444", fontSize: "0.75rem", mt: 1 }}>
                {errors.logo}
              </Typography>
            )}
          </Grid>

          {/* Theme Color Section */}
          <Grid item xs={12} md={6}>
            <Typography sx={{ color: "#6b7280", fontSize: "0.875rem", mb: 1.5 }}>
              Theme Color
            </Typography>
            <ColorPickerWrapper>
              <Box
                sx={{
                  position: "relative",
                  width: 44,
                  height: 44,
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: formData.branding.themeColor,
                    border: "2px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                />
                <input
                  type="color"
                  value={formData.branding.themeColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.branding.themeColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="#1976d2"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiDroplet size={16} style={{ color: formData.branding.themeColor }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "transparent",
                      color: "#374151",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "transparent" },
                      "&.Mui-focused fieldset": { borderColor: "transparent" },
                    },
                    "& .MuiInputAdornment-root": { color: "#6b7280" },
                  }}
                />
              </Box>
            </ColorPickerWrapper>
            <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
              {["#667eea", "#22c55e", "#ef4444", "#f59e0b", "#22d3ee", "#a855f7", "#ec4899", "#1976d2"].map(
                (color) => (
                  <Box
                    key={color}
                    onClick={() => handleColorChange(color)}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "6px",
                      bgcolor: color,
                      cursor: "pointer",
                      border:
                        formData.branding.themeColor === color
                          ? "2px solid #fff"
                          : "2px solid transparent",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                )
              )}
            </Box>
          </Grid>
        </Grid>
      </SectionBox>

      <SectionBox>
        <SectionTitle>
          <FiFileText size={18} /> Notes
        </SectionTitle>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Additional Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any additional information about this account..."
          sx={inputStyles}
        />
      </SectionBox>
    </>
  );

  const renderAdminSetup = () => (
    <>
      <SectionBox>
        <SectionTitle>
          <FiUser size={18} /> Primary Administrator
        </SectionTitle>
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", mb: 3, display: "flex", alignItems: "center", gap: 1 }}
        >
          {isEditMode ? (
            "Admin credentials can be managed in User Management"
          ) : (
            "Create the first administrator account for this institution. They will have full access to manage the account."
          )}
        </Typography>
        
        {!isEditMode && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Admin Full Name *"
                value={formData.admin.name}
                onChange={(e) => handleNestedChange("admin", "name", e.target.value)}
                error={!!errors["admin.name"]}
                helperText={errors["admin.name"]}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Admin Email *"
                value={formData.admin.email}
                onChange={(e) => handleNestedChange("admin", "email", e.target.value)}
                error={!!errors["admin.email"]}
                helperText={errors["admin.email"]}
                placeholder="admin@institution.com"
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Admin Phone (Optional)"
                value={formData.admin.phone}
                onChange={(e) => handleNestedChange("admin", "phone", e.target.value)}
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
            <Grid item xs={12} md={6}>
              <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ color: "#6b7280", fontStyle: "italic" }}>
                  This admin will have full access to all modules
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="Password Setup" size="small" sx={{ bgcolor: "#f3f4f6", color: "#6b7280" }} />
              </Divider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="password"
                label="Password *"
                value={formData.admin.password}
                onChange={(e) => handleNestedChange("admin", "password", e.target.value)}
                error={!!errors["admin.password"]}
                helperText={errors["admin.password"] || "Minimum 6 characters"}
                placeholder="••••••••"
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="password"
                label="Confirm Password *"
                value={formData.admin.confirmPassword}
                onChange={(e) => handleNestedChange("admin", "confirmPassword", e.target.value)}
                error={!!errors["admin.confirmPassword"]}
                helperText={errors["admin.confirmPassword"]}
                placeholder="••••••••"
                sx={inputStyles}
              />
            </Grid>
          </Grid>
        )}
        
        {isEditMode && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              bgcolor: "#f3f4f6",
              borderRadius: "8px",
              border: "1px dashed #d1d5db",
            }}
          >
            <Typography variant="body1" sx={{ color: "#6b7280" }}>
              Admin users can be managed from the User Management section
            </Typography>
          </Box>
        )}
      </SectionBox>

      {!isEditMode && (
        <SectionBox>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              p: 2,
              bgcolor: "rgba(102, 126, 234, 0.08)",
              borderRadius: "8px",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "rgba(102, 126, 234, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FiMail size={18} color="#667eea" />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#374151", fontWeight: 600, mb: 0.5 }}>
                Login Credentials
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                The admin will receive login credentials at the email address provided above.
                They can use these credentials to access the institution's dashboard.
              </Typography>
            </Box>
          </Box>
        </SectionBox>
      )}
    </>
  );

  const renderReview = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Basic Info Review */}
      <SectionBox>
        <SectionTitle>
          <FiUser size={18} /> Basic Information
        </SectionTitle>
        <Grid container spacing={2}>
          <Grid item xs={6} md={4}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Name
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 500 }}>
              {formData.name || "-"}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Code
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 500 }}>
              {formData.code || "-"}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Type
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 500, textTransform: "capitalize" }}>
              {formData.type}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Status
            </Typography>
            <Chip
              size="small"
              label={formData.status}
              sx={{
                bgcolor:
                  formData.status === "active"
                    ? "rgba(34, 197, 94, 0.2)"
                    : formData.status === "suspended"
                    ? "rgba(245, 158, 11, 0.2)"
                    : "rgba(239, 68, 68, 0.2)",
                color:
                  formData.status === "active"
                    ? "#22c55e"
                    : formData.status === "suspended"
                    ? "#f59e0b"
                    : "#ef4444",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Board
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 500 }}>
              {formData.board || "-"}
            </Typography>
          </Grid>
        </Grid>
      </SectionBox>

      {/* Contact Review */}
      <SectionBox>
        <SectionTitle>
          <FiMail size={18} /> Contact & Address
        </SectionTitle>
        <Grid container spacing={2}>
          <Grid item xs={6} md={4}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Email
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 500 }}>
              {formData.contact.email || "-"}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Phone
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 500 }}>
              {formData.contact.phone || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Address
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 500 }}>
              {[formData.address.city, formData.address.state].filter(Boolean).join(", ") || "-"}
            </Typography>
          </Grid>
        </Grid>
      </SectionBox>

      {/* Subscription Review */}
      <SectionBox>
        <SectionTitle>
          <FiCreditCard size={18} /> Subscription & Limits
        </SectionTitle>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Plan
            </Typography>
            <Chip
              size="small"
              label={formData.subscription.plan}
              sx={{
                bgcolor: "rgba(102, 126, 234, 0.2)",
                color: "#818cf8",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Max Users
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 500 }}>
              {formData.limits.maxUsers}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Max Students
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 500 }}>
              {formData.limits.maxStudents}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Max Teachers
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 500 }}>
              {formData.limits.maxTeachers}
            </Typography>
          </Grid>
        </Grid>
      </SectionBox>

      {/* Modules Review */}
      <SectionBox>
        <SectionTitle>
          <FiSettings size={18} /> Enabled Modules
        </SectionTitle>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {modulesList
            .filter((m) => formData.modules[m.key])
            .map((module) => (
              <Chip
                key={module.key}
                size="small"
                label={module.label}
                icon={<FiCheck size={12} />}
                sx={{
                  bgcolor: "rgba(34, 197, 94, 0.2)",
                  color: "#22c55e",
                  fontWeight: 500,
                  "& .MuiChip-icon": { color: "#22c55e" },
                }}
              />
            ))}
        </Box>
      </SectionBox>

      {/* Branding Review */}
      <SectionBox>
        <SectionTitle>
          <FiImage size={18} /> Branding
        </SectionTitle>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} md={4}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Logo
            </Typography>
            {formData.branding.logoPreview ? (
              <Avatar
                src={formData.branding.logoPreview}
                alt="Logo"
                variant="rounded"
                sx={{
                  width: 60,
                  height: 60,
                  mt: 1,
                  border: "2px solid rgba(102, 126, 234, 0.3)",
                }}
              />
            ) : (
              <Typography sx={{ color: "#6b7280", fontSize: "0.9rem", mt: 0.5 }}>
                No logo uploaded
              </Typography>
            )}
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Theme Color
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "6px",
                  bgcolor: formData.branding.themeColor,
                  border: "2px solid rgba(0, 0, 0, 0.1)",
                }}
              />
              <Typography sx={{ color: "#374151", fontWeight: 500 }}>
                {formData.branding.themeColor}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </SectionBox>

      {/* Admin Review - only for new accounts */}
      {!isEditMode && formData.admin.name && (
        <SectionBox>
          <SectionTitle>
            <FiUser size={18} /> Administrator
          </SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Name
              </Typography>
              <Typography sx={{ color: "#374151", fontWeight: 500 }}>
                {formData.admin.name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Email
              </Typography>
              <Typography sx={{ color: "#374151", fontWeight: 500 }}>
                {formData.admin.email}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Phone
              </Typography>
              <Typography sx={{ color: "#374151", fontWeight: 500 }}>
                {formData.admin.phone || "Not provided"}
              </Typography>
            </Grid>
          </Grid>
        </SectionBox>
      )}
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderContactAddress();
      case 2:
        return renderSettings();
      case 3:
        return renderAdminSetup();
      case 4:
        return renderReview();
      default:
        return null;
    }
  };

  // ========================= RENDER =========================

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Edit Account" : "Create New Account"}
      maxWidth="md"
      actions={
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{
              color: "#374151",
              textTransform: "none",
              visibility: activeStep === 0 ? "hidden" : "visible",
            }}
            startIcon={<FiChevronLeft />}
          >
            Back
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                color: "#374151",
                borderColor: "#d1d5db",
                textTransform: "none",
                "&:hover": { borderColor: "#667eea" },
              }}
            >
              Cancel
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  textTransform: "none",
                  fontWeight: 600,
                }}
                startIcon={<FiCheck />}
              >
                {isEditMode ? "Update Account" : "Create Account"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  textTransform: "none",
                  fontWeight: 600,
                }}
                endIcon={<FiChevronRight />}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      }
    >
      <Box sx={{ mt: 3 }}>
        <StyledStepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>

        <Box
          sx={{
            maxHeight: "55vh",
            overflowY: "auto",
            pr: 1,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { bgcolor: "#ffffff", borderRadius: "3px" },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#667eea",
              borderRadius: "3px",
              "&:hover": { bgcolor: "#818cf8" },
            },
          }}
        >
          {getStepContent(activeStep)}
        </Box>
      </Box>
    </CommonModal>
  );
};

export default CreateAccountModal;
