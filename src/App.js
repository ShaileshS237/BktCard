import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import { ConfigProvider, theme } from "antd";

import { useTheme } from "./context/ThemeContext";

function App() {
	const { theme: currentTheme } = useTheme();

	return (
		<ConfigProvider
			theme={{
				algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
				token: {
					colorBgBase: currentTheme === 'dark' ? "#0f0f0f" : "#f0f2f5",
					colorTextBase: currentTheme === 'dark' ? "#e6e6e6" : "#000000",
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
