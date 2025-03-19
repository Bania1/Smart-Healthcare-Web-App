import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
			<h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
			<h2 className="text-2xl font-semibold text-gray-600 mb-6">Page Not Found</h2>
			<p className="text-gray-500 mb-8 text-center max-w-md">
				The page you are looking for might have been removed, had its name changed, or is temporarily
				unavailable.
			</p>
			<Link
				to="/"
				className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300">
				Return to Home
			</Link>
		</div>
	);
};

export default NotFound;
