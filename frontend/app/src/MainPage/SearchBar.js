import React, { useState } from 'react';
import { 
    TextField, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Select, 
    Box, 
    InputAdornment, 
    IconButton, 
    Drawer, 
    Button, 
    Typography, 
    Chip 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const SearchBar = ({ onSearch, onFilterApply, categories = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [category, setCategory] = useState([]);
    const [status, setStatus] = useState('');
    const [sortOrder, setSortOrder] = useState('descending');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        onSearch(query); 
    };

    const toggleDrawer = (open) => {
        setDrawerOpen(open);
    };

    const handleApplyFilters = () => {
        onFilterApply({
            category,
            status,
            sortOrder,
            startDate,
            endDate,
        });
        toggleDrawer(false);
    };

    return (
        <Box display="flex" justifyContent="center" width="100%">
            <TextField
                variant="outlined"
                placeholder="Search Receipts..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => toggleDrawer(true)} edge="end">
                                <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                                    <Box sx={{ width: '30px', height: '6px', backgroundColor: '#2c2c4d', borderRadius: '3px' }} />
                                    <Box sx={{ width: '60px', height: '6px', backgroundColor: '#2c2c4d', borderRadius: '3px' }} />
                                    <Box sx={{ width: '45px', height: '6px', backgroundColor: '#2c2c4d', borderRadius: '3px' }} />
                                </Box>
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    minWidth: '300px',
                    maxWidth: '500px',
                    flexGrow: 1,
                }}
            />

            {/* Filter Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => toggleDrawer(false)}
                PaperProps={{
                    style: {
                        marginTop: '80px', // Pushes drawer down
                        height: 'calc(100% - 80px)', // Limits height, leaving some space at the top
                        paddingTop: '20px', // Adds internal padding at the top for better visual spacing
                    },
                }}
            >
                <Box
                    role="presentation"
                    sx={{ width: 300, padding: 2 }}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                >
                    <Typography variant="h6" fontWeight="bold">Filter & Sort Options</Typography>

                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            multiple
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxHeight: '80px', overflowY: 'auto' }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Sort by Date</InputLabel>
                        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <MenuItem value="ascending">Ascending</MenuItem>
                            <MenuItem value="descending">Descending</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Date Pickers for Start and End Dates */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newDate) => setStartDate(newDate)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newDate) => setEndDate(newDate)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>

                    <Button onClick={handleApplyFilters} variant="contained" color="primary" sx={{ marginTop: 2 }}>
                        Apply Filters
                    </Button>
                    <Button
                        onClick={() => {
                            setCategory([]);
                            setStatus('');
                            setSortOrder('descending');
                            setStartDate(null);
                            setEndDate(null);
                            toggleDrawer(false);
                        }}
                        sx={{
                            background: 'linear-gradient(90deg, #00C6FB 0%, #005BEA 100%)',
                            color: '#fff',
                            marginTop: 1,
                            '&:hover': {
                                background: 'linear-gradient(90deg, #00A6DB 0%, #004BBE 100%)',
                            },
                        }}
                    >
                        Reset Filters
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
};

export default SearchBar;
