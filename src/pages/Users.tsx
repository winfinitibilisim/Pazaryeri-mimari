import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DataTable, { Column } from '../components/common/DataTable';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const Users: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2023-09-15 14:30',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Editor',
      status: 'Active',
      lastLogin: '2023-09-14 09:45',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Viewer',
      status: 'Inactive',
      lastLogin: '2023-08-25 16:20',
    },
    {
      id: '4',
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      role: 'Editor',
      status: 'Active',
      lastLogin: '2023-09-15 11:05',
    },
    {
      id: '5',
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'Viewer',
      status: 'Active',
      lastLogin: '2023-09-12 13:15',
    },
  ]);

  const columns: Column[] = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 170,
      format: (value: string, row: User) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{ mr: 2, bgcolor: stringToColor(value) }}
            alt={value}
          >
            {value.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2">{value}</Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { id: 'role', label: 'Role', minWidth: 100 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (value: string) => (
        <Chip
          label={value}
          size="small"
          color={value === 'Active' ? 'success' : 'default'}
        />
      ),
    },
    { id: 'lastLogin', label: 'Last Login', minWidth: 170 },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'right',
      format: (_: any, row: User) => (
        <Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEditUser(row);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(row.id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Function to convert string to color
  const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const handleAddUser = () => {
    setEditUser(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditUser(null);
  };

  const handleSaveUser = () => {
    // Implement save logic here
    handleCloseDialog();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <DataTable
        title="User Management"
        columns={columns}
        data={users}
        onRowClick={(row) => console.log('User clicked:', row)}
        onAddClick={handleAddUser}
      />

      {/* Add/Edit User Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                defaultValue={editUser?.name || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                defaultValue={editUser?.email || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  defaultValue={editUser?.role || 'Viewer'}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Editor">Editor</MenuItem>
                  <MenuItem value="Viewer">Viewer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue={editUser?.status || 'Active'}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!editUser && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users; 