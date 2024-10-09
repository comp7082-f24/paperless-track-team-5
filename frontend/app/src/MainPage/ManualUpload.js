// src/MainPage/Camera.js
import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select  from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuProps from '@mui/material/MenuItem';

const ManualUpload = () => {



    const [store, setStore] = useState('')
    const [cost, setCost] = useState('')

    const saveReceipt = () => {
        console.log(  category +`store` + store + " cost " + cost)
    }
    const categories = [
        'Groceries',
        'Eating out',
      ];

    const [category, setCategory] = React.useState([]);

  const changeCategory = (event) => {
    const {
      target: { value },
    } = event;
    setCategory(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
    return (
        <div>
           <h2>Enter receipt data</h2>
  
            <FormControl fullWidth>
            
                <InputLabel id="demo-multiple-name-label">Category</InputLabel>
                <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={category}
                onChange={changeCategory}
                input={<OutlinedInput label="Category" />}
                MenuProps={MenuProps}
                >
                    {categories.map((category) => (
                        <MenuItem
                        key={category}
                        value={category}
                        >
                        {category}
                        </MenuItem>
                    ))}
                </Select>

                <input
                    type="text"
                    placeholder="Store"
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    required
                />
 
                <button type="button" onClick={saveReceipt}>
                    Save
                </button>
            </FormControl>
        </div>
    );
};

export default ManualUpload;