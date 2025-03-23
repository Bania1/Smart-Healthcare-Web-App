const express = require('express');
const app = express();

// Importing routers
const usersRoutes = require('./routes/usersRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const medicalRecordsRoutes = require('./routes/medicalRecordsRoutes');
const permissionsRoutes = require('./routes/permissionsRoutes');
const rolePermissionsRoutes = require('./routes/rolePermissionsRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const userRolesRoutes = require('./routes/userRolesRoutes');
const usersDetailsRoutes = require('./routes/usersDetailsRoutes');

// Body parsing middleware
app.use(express.json());

// Mounting routes
app.use('/api/users', usersRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/role-permissions', rolePermissionsRoutes);
app.use('/api/user-roles', userRolesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/users-details', usersDetailsRoutes);

// (Optional) Catch-all for unknown routes (404 Not Found)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
