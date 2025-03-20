const express = require('express');
const app = express();

const usersRoutes = require('./routes/usersRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/users', usersRoutes);
app.use('/api/appointments', appointmentsRoutes);

// Manejo de errores (opcional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
