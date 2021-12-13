import React, { useState } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route
} from "react-router-dom";

import Client from './pages/Client/Client';
import Login from './pages/Login/Login';
import RequireAuth from './components/RequireAuth/RequireAuth';

function App() {
	const [title, setTitle] = useState(null);
	const [message, setMessage] = useState(null);

	return (
		<div class="app">
			{/* add header */}
			<Router>
				<Routes>
					<Route path="/" element={<RequireAuth><Client /></RequireAuth>} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
