import { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import AccountManagement from "./AccountManagement";
import UserManagement from "./UserManagement";

export default function User() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
          <Tab label="Accounts" sx={{ color: "text.secondary" }} />
          <Tab label="User" sx={{ color: "text.secondary" }} />
        </Tabs>
      </Box>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && <AccountManagement />}
        {activeTab === 1 && <UserManagement />}
      </Box>
    </Box>
  );
}
