import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Box, TextField, Button, Grid } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';

type TaxPayer = {
  tid: string;
  firstName: string;
  lastName: string;
  address: string;
};

const columns = [
  { name: 'TID', selector: (row: TaxPayer) => row.tid, sortable: true },
  { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
  { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
  { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
];

function App() {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [searchTID, setSearchTID] = useState('');
  const [searchResult, setSearchResult] = useState<TaxPayer | null>(null);
  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    const result = await backend.getAllTaxPayers();
    setTaxPayers(result);
  };

  const onSubmit = async (data: TaxPayer) => {
    try {
      const result = await backend.addTaxPayer(data.tid, data.firstName, data.lastName, data.address);
      if ('ok' in result) {
        alert('TaxPayer added successfully');
        reset();
        fetchTaxPayers();
      } else {
        alert(`Error: ${result.err}`);
      }
    } catch (error) {
      console.error('Error adding TaxPayer:', error);
      alert('An error occurred while adding the TaxPayer');
    }
  };

  const handleSearch = async () => {
    if (searchTID) {
      const result = await backend.searchTaxPayerByTID(searchTID);
      setSearchResult(result[0] || null);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        TaxPayer Records Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataTable
              columns={columns}
              data={taxPayers}
              pagination
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom>
              Add New TaxPayer
            </Typography>
            <Controller
              name="tid"
              control={control}
              defaultValue=""
              rules={{ required: 'TID is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="tid"
                  label="TID"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: 'First Name is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{ required: 'Last Name is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: 'Address is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add TaxPayer
            </Button>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Search TaxPayer
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="searchTID"
              label="Search by TID"
              value={searchTID}
              onChange={(e) => setSearchTID(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              sx={{ mt: 1 }}
            >
              Search
            </Button>
            {searchResult && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Search Result:</Typography>
                <Typography>TID: {searchResult.tid}</Typography>
                <Typography>Name: {searchResult.firstName} {searchResult.lastName}</Typography>
                <Typography>Address: {searchResult.address}</Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
