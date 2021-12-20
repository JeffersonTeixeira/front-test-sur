import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route
} from "react-router-dom";

import ClientIndex from './pages/Client/Index';
import Client from './pages/Client/Client';
import LoginIndex from './pages/Login/Index';
import RequireAuth from './components/RequireAuth/RequireAuth';

function App() {
	return (
		<div className="app">			
			<Router>
				<Routes>
					<Route path="/" element={<RequireAuth><ClientIndex /></RequireAuth>} />
					<Route path="/client" element={<RequireAuth><Client /></RequireAuth>} >
						<Route path=":id" element={<Client />} />
					</Route>
					<Route path="/login" element={<LoginIndex />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
