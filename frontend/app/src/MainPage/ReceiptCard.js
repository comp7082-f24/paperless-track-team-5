import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
} from '@mui/material';
import { getFirestore, doc, deleteDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import dayjs from 'dayjs';
import { Theme } from '../themes/Theme'

const db = getFirestore();

const ReceiptCard = ({ vendor, total, category, date, user, id, fetchReceipts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editVendor, setEditVendor] = useState(vendor);
  const [editTotal, setEditTotal] = useState(total);
  const [editDate, setEditDate] = useState(date || dayjs().format('YYYY-MM-DD'));
  const [editCategory, setEditCategory] = useState(category);
  const [categoryColor, setCategoryColor] = useState('#FFFFFF');
  const [categories, setCategories] = useState([]);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchCategories = async () => {
        const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
        const querySnapshot = await getDocs(categoriesCollectionRef);
        const fetchedCategories = querySnapshot.docs.map(doc => ({
          name: doc.data().name,
          color: doc.data().color,
        }));
        setCategories(fetchedCategories);
      };

      fetchCategories();
    }
  }, [isEditing, user.uid]);

  useEffect(() => {
    const fetchCategoryColor = async () => {
      const categoriesCollectionRef = collection(db, 'users', user.uid, 'categories');
      const querySnapshot = await getDocs(categoriesCollectionRef);
      const selectedCategory = querySnapshot.docs.find(doc => doc.data().name === category);
      if (selectedCategory) {
        setCategoryColor(selectedCategory.data().color);
      }
    };

    fetchCategoryColor();
  }, [category, user.uid]);

  useEffect(() => {
    // Known domain mapping (this can be expanded as needed)
    const knownDomains = {
      'Walmart': 'walmart.com',
      'Winners': 'winners.ca', // Adding specific domain for Winners
    };

    const normalizedVendor = vendor.toLowerCase();
    const domain = knownDomains[vendor] || `${normalizedVendor}.com`; // Use known domain if available, else default to .com

    const primaryLogoUrl = `https://logo.clearbit.com/${domain}`;
    const alternateLogoUrl = `https://logo.clearbit.com/${normalizedVendor}.ca`; // Check .ca as a secondary fallback

    const checkLogoUrl = async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          setLogoUrl(url);
        } else {
          setLogoUrl('https://via.placeholder.com/80x40?text=No+Logo');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
        setLogoUrl('https://via.placeholder.com/80x40?text=No+Logo');
      }
    };

    // First, try the primary logo URL based on the domain, then fallback if it fails
    checkLogoUrl(primaryLogoUrl).catch(() => checkLogoUrl(alternateLogoUrl));
  }, [vendor]);

  const handleSave = async () => {
    const updatedReceipt = {
      vendor: editVendor,
      total: editTotal,
      date: editDate,
      category: editCategory,
    };

    try {
      const receiptDocRef = doc(db, 'users', user.uid, 'receipts', id);
      await updateDoc(receiptDocRef, updatedReceipt);
      setIsEditing(false);
      fetchReceipts();
    } catch (error) {
      console.error('Error updating receipt:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'receipts', id));
      fetchReceipts();
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: { xs: '80%', sm: '60%', md: '50%', lg: '40%' },
        margin: '24px auto',
        padding: { xs: '15px', sm: '20px', md: '25px' },
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.03)',
        },
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          backgroundColor: Theme.palette.primary.main,  // Purple color header
          height: '50px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          color: Theme.palette.background.paper,
          fontWeight: 'bold',
          fontSize: '1.1rem',
          zIndex: 1,
        }}
      >
        Receipt Details
      </Box>
      <CardHeader
        title={vendor}
        subheader={date}
        sx={{
          paddingTop: '70px',  // Offset to account for the header strip
          paddingBottom: '8px',
          textAlign: 'left',
          color: Theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',  // Space for logo on the right
        }}
        action={
          logoUrl && (
            <img src={logoUrl} alt={`${vendor} logo`} style={{ width: '60px', height: 'auto', objectFit: 'contain' }} />
          )
        }
      />
      <CardContent sx={{ paddingBottom: '8px' }}>
        {isEditing ? (
          <>
            <TextField
              label="Vendor"
              fullWidth
              margin="dense"
              value={editVendor}
              onChange={(e) => setEditVendor(e.target.value)}
            />
            <TextField
              label="Total"
              type="number"
              fullWidth
              margin="dense"
              value={editTotal}
              onChange={(e) => setEditTotal(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Date"
              type="date"
              fullWidth
              margin="dense"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </>
        ) : (
          <>
            <Typography variant="body1" color= {Theme.palette.text.secondrary} >
              <strong>Total:</strong> ${total}
            </Typography>
            <Typography variant="body1" color= {Theme.palette.text.secondary}>
              <strong>Category:</strong> {category}
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        {isEditing ? (
          <>
            <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Button variant="outlined" color="secondary" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default ReceiptCard;
