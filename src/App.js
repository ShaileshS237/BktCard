import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import { ConfigProvider, theme } from "antd";

function App() {
	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
				token: {
					colorBgBase: "#0f0f0f",
					colorTextBase: "#e6e6e6",
				},
			}}
		>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</BrowserRouter>
		</ConfigProvider>
	);
}

export default App;
