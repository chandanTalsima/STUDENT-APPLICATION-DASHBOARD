import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import DashboardPage from "./components/DashboardPage/DashboardPage";
import DashboardPage_new from "./components/DashboardPage_new/DashboardPage";
function DashboardWrapper() {
  const { studentId } = useParams();
  return <DashboardPage studentId={studentId} />;
}
function Dashboard_new() {
  const { studentId } = useParams();
  return <DashboardPage_new studentId={studentId} />;
}
function App() {
  return (
    <BrowserRouter basename="/studentportal">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/:studentId" element={<DashboardWrapper />} />
        <Route path="/dashboard_new/:studentId" element={<Dashboard_new />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
