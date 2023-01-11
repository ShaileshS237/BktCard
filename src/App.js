import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Buckets from "./Componets/Buckets";
import History from "./Pages/History";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/history" element={<History />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
