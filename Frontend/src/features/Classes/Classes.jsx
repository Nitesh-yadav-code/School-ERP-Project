import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { FiPlus, FiBook, FiLayers, FiCalendar, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import AddClassModal from "./AddClassModal";
import AddSectionModal from "./AddSectionModal";
import classService from "../../services/classService";
import sectionService from "../../services/sectionService";

// Styled Components
const PageHeader = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
});

const FilterBox = styled(Box)({
    display: "flex",
    gap: "12px",
    alignItems: "center",
});

const ClassCard = styled(Card)({
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    transition: "transform 0.2s, box-shadow 0.2s",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.15)",
    },
});

const ClassHeader = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
});

const ClassIcon = styled(Box)({
    width: 48,
    height: 48,
    borderRadius: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
});

const SectionChip = styled(Chip)({
    margin: "4px",
    backgroundColor: "#667eea15",
    color: "#667eea",
    fontWeight: 500,
    border: "1px solid #667eea30",
    "&:hover": {
        backgroundColor: "#667eea25",
    },
});

const AddButton = styled(Button)({
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    textTransform: "none",
    borderRadius: "10px",
    fontWeight: 600,
    padding: "10px 20px",
    boxShadow: "0 4px 14px rgba(102, 126, 234, 0.35)",
    "&:hover": {
        background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
    },
});

const AddSectionButton = styled(Button)({
    textTransform: "none",
    color: "#667eea",
    fontWeight: 500,
    "&:hover": {
        backgroundColor: "#667eea10",
    },
});

const EmptyState = styled(Box)({
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280",
});

const inputStyles = {
    minWidth: 150,
    "& .MuiOutlinedInput-root": {
        bgcolor: "#ffffff",
        borderRadius: "8px",
        "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
        "&:hover fieldset": { borderColor: "#667eea" },
    },
};

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAddClass, setOpenAddClass] = useState(false);
    const [openAddSection, setOpenAddSection] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [sectionsMap, setSectionsMap] = useState({});
    const [academicYearFilter, setAcademicYearFilter] = useState("");

    // Get unique academic years from classes
    const academicYears = [...new Set(classes.map(c => c.academicYear).filter(Boolean))];

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const res = await classService.getClasses();
            const classesData = res.data.classes || [];
            setClasses(classesData);

            // Fetch sections for each class
            classesData.forEach(cls => {
                fetchSections(cls._id);
            });
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast.error("Failed to load classes");
        } finally {
            setLoading(false);
        }
    };

    const fetchSections = async (classId) => {
        try {
            const res = await sectionService.getSectionsByClass(classId);
            setSectionsMap(prev => ({
                ...prev,
                [classId]: res.data.sections || []
            }));
        } catch (error) {
            console.error(`Error fetching sections for class ${classId}:`, error);
        }
    };

    const handleAddSection = (cls) => {
        setSelectedClass(cls);
        setOpenAddSection(true);
    };

    const handleSectionAdded = () => {
        if (selectedClass) {
            fetchSections(selectedClass._id);
        }
    };

    // Filter classes by academic year
    const filteredClasses = academicYearFilter
        ? classes.filter(c => c.academicYear === academicYearFilter)
        : classes;

    return (
        <Box sx={{ p: 3 }}>
            {/* Page Header */}
            <PageHeader>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#1f2937", mb: 0.5 }}>
                        Classes & Sections
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#6b7280" }}>
                        Manage your classes and sections for each academic year
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <FilterBox>
                        <TextField
                            select
                            label="Academic Year"
                            value={academicYearFilter}
                            onChange={(e) => setAcademicYearFilter(e.target.value)}
                            size="small"
                            sx={inputStyles}
                        >
                            <MenuItem value=""><em>All Years</em></MenuItem>
                            {academicYears.map(year => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </TextField>
                    </FilterBox>
                    <AddButton
                        startIcon={<FiPlus size={18} />}
                        onClick={() => setOpenAddClass(true)}
                    >
                        Add Class
                    </AddButton>
                </Box>
            </PageHeader>

            {/* Content */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress sx={{ color: "#667eea" }} />
                </Box>
            ) : filteredClasses.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredClasses.map((cls) => (
                        <Grid item xs={12} sm={6} md={4} key={cls._id}>
                            <ClassCard>
                                <CardContent sx={{ flex: 1, p: 3 }}>
                                    {/* Class Header */}
                                    <ClassHeader>
                                        <ClassIcon>
                                            <FiBook size={22} />
                                        </ClassIcon>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>
                                                {cls.name}
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#6b7280" }}>
                                                <FiCalendar size={14} />
                                                <Typography variant="body2">
                                                    {cls.academicYear}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box>
                                            <IconButton size="small" title="Edit Class">
                                                <FiEdit size={16} style={{ color: "#3b82f6" }} />
                                            </IconButton>
                                            <IconButton size="small" title="Delete Class">
                                                <FiTrash2 size={16} style={{ color: "#ef4444" }} />
                                            </IconButton>
                                        </Box>
                                    </ClassHeader>

                                    {/* Notes */}
                                    {cls.notes && (
                                        <Typography variant="body2" sx={{ color: "#6b7280", mb: 2, fontStyle: "italic" }}>
                                            {cls.notes}
                                        </Typography>
                                    )}

                                    {/* Sections */}
                                    <Typography variant="subtitle2" sx={{ color: "#374151", fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <FiLayers size={14} /> Sections
                                    </Typography>

                                    <Box sx={{ minHeight: 40, mb: 2 }}>
                                        {sectionsMap[cls._id]?.length > 0 ? (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {sectionsMap[cls._id].map((sec) => (
                                                    <SectionChip
                                                        key={sec._id}
                                                        label={sec.name}
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" sx={{ color: "#9ca3af", fontStyle: "italic" }}>
                                                No sections added yet
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Add Section Button */}
                                    <AddSectionButton
                                        startIcon={<FiPlus size={16} />}
                                        onClick={() => handleAddSection(cls)}
                                        fullWidth
                                    >
                                        Add Section
                                    </AddSectionButton>
                                </CardContent>
                            </ClassCard>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <EmptyState>
                    <FiBook size={48} style={{ opacity: 0.5, marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ mb: 1, color: "#374151" }}>
                        No Classes Found
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        {academicYearFilter
                            ? `No classes for academic year ${academicYearFilter}`
                            : "Get started by adding your first class"
                        }
                    </Typography>
                    <AddButton
                        startIcon={<FiPlus size={18} />}
                        onClick={() => setOpenAddClass(true)}
                    >
                        Add Your First Class
                    </AddButton>
                </EmptyState>
            )}

            {/* Modals */}
            <AddClassModal
                open={openAddClass}
                onClose={() => setOpenAddClass(false)}
                onSuccess={fetchClasses}
            />

            <AddSectionModal
                open={openAddSection}
                onClose={() => setOpenAddSection(false)}
                onSuccess={handleSectionAdded}
                classData={selectedClass}
            />
        </Box>
    );
};

export default Classes;