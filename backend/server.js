const express = require('express');
const app = express();

// Import swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); 
// Import routers
const authRoutes = require('./routes/authRoutes');
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

// Parse JSON bodies
app.use(express.json());

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/role-permissions', rolePermissionsRoutes);
app.use('/api/user-roles', userRolesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/users-details', usersDetailsRoutes);

//Catch-all for unknown routes (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error-handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
