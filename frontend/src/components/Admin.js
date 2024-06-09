import React, { useState } from 'react';
import { Tab, Tabs, Typography, Box } from '@mui/material';
import UsersTable from './UsersTable';
import RecipesTable from './RecipesTable';

const Admin = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper', padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="Users" />
                <Tab label="Recipes" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                <UsersTable />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <RecipesTable />
            </TabPanel>
        </Box>
    );
};

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export default Admin;
