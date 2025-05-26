import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./components/main-pages/Login";
import Signup from "./components/main-pages/Signup";
import Layout from "./components/Layout";
import useDarkMode from "./hooks/useDarkMode";
import Measure from "./components/main-pages/Measure";
import Dashboard from "./components/main-pages/Dashboard";
import UserInformation from "./components/main-pages/UserInformation";
import Devices from "./components/main-pages/Devices";
import DeviceDetail from "./components/main-pages/DeviceDetail";
import ForgotPassword from "./components/main-pages/ForgotPassword";
import { useDevice } from "./context/DeviceContext";
import HomePage from "./components/main-pages/HomePage";
import { useUser } from "./context/UserContext"

function App() {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const { user } = useUser();
  const { selectedDevice } = useDevice();
  const handleMode = () => setDarkTheme(!darkTheme);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Layout darkTheme={darkTheme} handleMode={handleMode} />}
        >
          <Route
            index
            element={user.token ? <Navigate to="/dashboard" /> : <HomePage darkTheme={darkTheme} />}
          />
          <Route
            path="/login"
            element={user.token ? <Navigate to="/dashboard" /> : <Login darkTheme={darkTheme} />}
          />
          <Route
            path="/signup"
            element={user.token ? <Navigate to="/dashboard" /> : <Signup darkTheme={darkTheme} />}
          />
          <Route
            path="/measure"
            element={selectedDevice ? <Measure darkTheme={darkTheme} /> : <Navigate to="/devices" />}
          />
          <Route path="/dashboard" element={user.token ? <Dashboard darkTheme={darkTheme} />: <Login darkTheme={darkTheme} />} />
          <Route path="/user-information" element={user.token ? <UserInformation darkTheme={darkTheme} /> : <Login darkTheme={darkTheme} />} />
          <Route path="/devices" element={user.token ? <Devices darkTheme={darkTheme} /> : <Login darkTheme={darkTheme} />} />
          <Route path="/devices/:id" element={user.token ? <DeviceDetail darkTheme={darkTheme} /> : <Login darkTheme={darkTheme} />} />
          <Route path="/forgot-password" element={<ForgotPassword darkTheme={darkTheme} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;