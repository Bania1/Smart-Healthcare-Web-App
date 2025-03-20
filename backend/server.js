const express = require('express');
const app = express();
const usersRoutes = require('./routes/usersRoutes');

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/users', usersRoutes);

// Manejo de errores genéricos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
