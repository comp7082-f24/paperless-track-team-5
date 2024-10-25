// MonthYearPicker.js
import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { MonthCalendar, YearCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const MonthYearPicker = ({ selectedDate, setSelectedDate }) => {
    const [openMonthPicker, setOpenMonthPicker] = useState(false);
    const [openYearPicker, setOpenYearPicker] = useState(false);

    const handleMonthChange = (newMonth) => {
        setSelectedDate(dayjs(selectedDate).month(newMonth));
        setOpenMonthPicker(false);
    };

    const handleYearChange = (newYear) => {
        setSelectedDate(dayjs(selectedDate).year(newYear));
        setOpenYearPicker(false);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" alignItems="center" gap={1}>
                {/* Month Button with Label */}
                <Box position="relative">
                    <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{
                            position: 'absolute',
                            top: '-8px',
                            left: '10px',
                            backgroundColor: 'white',
                            padding: '0 4px',
                        }}
                    >
                        Month
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => setOpenMonthPicker(true)}>
                        {dayjs(selectedDate).format('MMMM')}
                    </Button>
                </Box>

                {/* Year Button with Label */}
                <Box position="relative">
                    <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{
                            position: 'absolute',
                            top: '-8px',
                            left: '10px',
                            backgroundColor: 'white',
                            padding: '0 4px',
                        }}
                    >
                        Year
                    </Typography>
                    <Button variant="outlined" color="secondary" onClick={() => setOpenYearPicker(true)}>
                        {dayjs(selectedDate).format('YYYY')}
                    </Button>
                </Box>
            </Box>

            {/* Dialog for Month Picker */}
            <Dialog open={openMonthPicker} onClose={() => setOpenMonthPicker(false)}>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>Select Month</Typography>
                    <MonthCalendar
                        date={selectedDate}
                        onChange={(newDate) => handleMonthChange(newDate.month())}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMonthPicker(false)} variant="outlined" color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Year Picker */}
            <Dialog open={openYearPicker} onClose={() => setOpenYearPicker(false)}>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>Select Year</Typography>
                    <YearCalendar
                        date={selectedDate}
                        onChange={(newDate) => handleYearChange(newDate.year())}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenYearPicker(false)} variant="outlined" color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default MonthYearPicker;
