import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import DashboardPage from "./components/DashboardPage/DashboardPage";

function DashboardWrapper() {
  const { studentId } = useParams();
  return <DashboardPage studentId={studentId} />;
}

function App() {
  return (
    <BrowserRouter basename="/studentportal">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/:studentId" element={<DashboardWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
