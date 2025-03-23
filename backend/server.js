const express = require('express');
const app = express();

// Import routers
const usersRoutes = require('./routes/usersRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const medicalRecordsRoutes = require('./routes/medicalRecordsRoutes');
const permissionsRoutes = require('./routes/permissionsRoutes');
const rolePermissionsRoutes = require('./routes/rolePermissionsRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const userRolesRoutes = require('./routes/userRolesRoutes');
const usersDetailsRoutes = require('./routes/usersDetailsRoutes');

// Import the error middleware
const errorMiddleware = require('./middleware/errorMiddleware');

// Parse JSON bodies (do this once)
app.use(express.json());

// Mount routes
app.use('/api/users', usersRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/role-permissions', rolePermissionsRoutes);
app.use('/api/user-roles', userRolesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/users-details', usersDetailsRoutes);

// (Optional) Catch-all for unknown routes (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error-handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
