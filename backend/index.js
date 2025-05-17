// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

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

// 1) Configure CORS **before** body parsers and routes
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,            // if you ever set cookies
  optionsSuccessStatus: 204,    // response code for preflight
};
app.use(cors(corsOptions));
// also handle preflight across-the-board
app.options('*', cors(corsOptions));

// 2) Parse JSON bodies
app.use(express.json());

// 3) Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hello from the Smart Healthcare App by Fran and Angel!');
});

// 4) Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 5) Mount REST routers
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/role-permissions', rolePermissionsRoutes);
app.use('/api/user-roles', userRolesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/users-details', usersDetailsRoutes);

// 6) Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 7) Error handler
app.use(errorMiddleware);

// 8) Start server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
