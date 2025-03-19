import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import Header from "./components/Layout/Header";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Auth components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
	/**
	 * TODO: Implementați componenta ProtectedRoute.
	 * Aceasta ar trebui să:
	 * 1. Verifice dacă utilizatorul este autentificat prin existența unui token în localStorage.
	 * 2. Dacă token-ul NU există, să redirecționeze utilizatorul către pagina de login.
	 * 3. Dacă token-ul există, să permită accesul la ruta protejată, afișând conținutul `children`.
	 */
	return children;
};

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="App">
					<Header />
					<main className="container mx-auto px-4 py-6 min-h-screen">
						<Routes>
							{/* Public routes */}
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />

							{/* Protected routes */}
							<Route
								path="/dashboard"
								element={
									<ProtectedRoute>
										<Dashboard />
									</ProtectedRoute>
								}
							/>

							{/* 404 - Not Found */}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</main>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
