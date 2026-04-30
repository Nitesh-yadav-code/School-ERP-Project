import React, { useCallback, useState } from 'react';
import { FiFilter, FiPlus } from "react-icons/fi";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import Heading from '../../commonComponents/Heading';
import LoadingComponent from '../../commonComponents/Loader';
import { exportData } from '../../utils/exportUtils';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import FeeStructureTab from './FeeStructure';
import FeeAssignments from './FeeAssignments';
import FeeCollection from './FeeCollection';

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

// Button arrays for Fee Structure tab
const feeStructureButtonArray = [
    { name: null, key: "excel", icon: <FaFileExcel /> },
    { name: null, key: "csv", icon: <FaFileCsv /> },
    { name: null, key: "pdf", icon: <FaFilePdf /> },
    { name: "Add Fee", key: "create_fee", icon: <FiPlus /> },
    { name: "Filter", key: "filter", icon: <FiFilter /> },
];

// Fee Structure columns for export
const feeStructureColumns = [
    { header: "Fee Name", accessor: "name" },
    { header: "Class", accessor: "className" },
    { header: "Amount", accessor: "amount" },
    { header: "Academic Year", accessor: "academicYear" },
    { header: "Type", accessor: "isMandatory" },
];

const Fees = () => {
    // Tab state
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    // Fee Structure Tab state (lifted from child)
    const [feeStructureData, setFeeStructureData] = useState([]);
    const [filteredFeeStructureData, setFilteredFeeStructureData] = useState([]);

    // Modal states
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setSearchTerm("");
    };

    // Handle button actions based on active tab
    const handleButtonAction = (action) => {
        if (activeTab === 0) {
            switch (action) {
                case "create_fee":
                    setCreateModalOpen(true);
                    break;
                case "filter":
                    setShowFilter(true);
                    break;
                case "excel":
                    exportData('excel', filteredFeeStructureData, feeStructureColumns, 'fee_structure', 'Fee Structure Data');
                    break;
                case "pdf":
                    exportData('pdf', filteredFeeStructureData, feeStructureColumns, 'fee_structure', 'Fee Structure Data');
                    break;
                case "csv":
                    exportData('csv', filteredFeeStructureData, feeStructureColumns, 'fee_structure');
                    break;
                default:
                    break;
            }
        }
    };

    // Search handler
    const handleSearch = useCallback((debouncedValue) => {
        if (activeTab === 0) {
            if (debouncedValue) {
                const filtered = feeStructureData.filter(item =>
                    item.name?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
                    item.className?.toLowerCase().includes(debouncedValue.toLowerCase())
                );
                setFilteredFeeStructureData(filtered);
            } else {
                setFilteredFeeStructureData(feeStructureData);
            }
        }
    }, [activeTab, feeStructureData]);

    // Callbacks for FeeStructureTab
    const handleFeeStructureDataChange = (data) => {
        setFeeStructureData(data);
        setFilteredFeeStructureData(data);
    };

    return (
        <>
            <LoadingComponent isLoading={isLoading} />
            <Heading
                title={"Fee Management"}
                showSearch={true}
                buttonArray={activeTab === 0 ? feeStructureButtonArray : []}
                handleButtonAction={handleButtonAction}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
            />

            {/* Tab Navigation */}
            <StyledTabs value={activeTab} onChange={handleTabChange}>
                <StyledTab label="Fee Structure" />
                <StyledTab label="Fee Assignments" />
                <StyledTab label="Fee Collection" />
            </StyledTabs>

            {/* Tab Content */}
            {activeTab === 0 && (
                <FeeStructureTab
                    showFilter={showFilter}
                    onCloseFilter={() => setShowFilter(false)}
                    onDataChange={handleFeeStructureDataChange}
                    filteredData={filteredFeeStructureData}
                    setFilteredData={setFilteredFeeStructureData}
                    createModalOpen={createModalOpen}
                    setCreateModalOpen={setCreateModalOpen}
                />
            )}

            {activeTab === 1 && <FeeAssignments />}
            {activeTab === 2 && <FeeCollection />}
        </>
    );
};

export default Fees;
