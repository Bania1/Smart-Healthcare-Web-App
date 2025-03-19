import axios from "../utils/axiosConfig";

/**
 * TODO: Implementați serviciul de autentificare.
 * Acesta ar trebui să includă:
 * 1. Înregistrarea unui utilizator nou printr-un request POST către "/auth/register".
 * 2. Autentificarea unui utilizator printr-un request POST către "/auth/login".
 * 3. Obținerea profilului utilizatorului autentificat printr-un request GET către "/auth/profile".
 * 4. Returnarea datelor primite de la server pentru fiecare operațiune.
 */

const register = async (userData) => {};

const login = async (credentials) => {};

const getProfile = async () => {};

const authService = {
	register,
	login,
	getProfile,
};

export default authService;
