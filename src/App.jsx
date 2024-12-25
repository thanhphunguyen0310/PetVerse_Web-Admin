import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./routes/PrivateRoute";
import AdminDashboard from "./pages/AdminPage/AdminDashboard";
import LayoutDefault from "./components/Layout";
import ManageAccount from "./pages/AdminPage/ManageAccount";
import ManagerDashboard from "./pages/ManagerPage/ManagerDashboard";
import ManagePetCenter from "./pages/ManagerPage/ManagePetCenter";
import ManagePet from "./pages/ManagerPage/ManagePet";
import CreatePet from "./pages/ManagerPage/ManagePet/CreatePet";
import PetCenterApplication from "./pages/ManagerPage/ManagePetCenter/PetCenterApplication";
import ChatUserReport from "./pages/ManagerPage/ManageUserReport/ChatUserReport";
import ManageBreeding from "./pages/ManagerPage/ManageBreeding";
import ProcessedBreedingApplication from "./pages/ManagerPage/ManageBreeding/ProcessedBreedingApplication";
import ManageReport from "./pages/ManagerPage/ManageUserReport";
import ProcessedReport from "./pages/ManagerPage/ManageUserReport/ProcessedReport";
import TransactionSuccessful from "./pages/TransactionSuccessful";
import TransactionFail from "./pages/TransactionFail";
import ManageAppointment from "./pages/ManagerPage/ManageAppointment";
import ManageTransaction from "./pages/AdminPage/ManageTransaction";
import ProcessedPetCenterApplication from "./pages/ManagerPage/ManagePetCenter/ProcessedPetCenterApplication";
import ManageVaccineRecommendation from "./pages/AdminPage/ManageVaccine";
import AddNewVaccine from "./pages/AdminPage/ManageVaccine/AddNewVaccine";
import ManagePlaceRecommendation from "./pages/AdminPage/ManagePlace";
import CreateNewPlace from "./pages/AdminPage/ManagePlace/AddNewPlace";
function App() {
  const { accessToken, role: roleName } = useSelector((state) => state.auth);
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/"
          element={
            accessToken ? (
              <Navigate to={`${roleName?.toLowerCase()}`} />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/success-transaction" element={<TransactionSuccessful />} />
        <Route path="/fail-transaction" element={<TransactionFail />} />
        {/* Private Routes for Admin */}
        <Route element={<PrivateRoute role="admin" />}>
          <Route element={<LayoutDefault />}>
            <Route path="/admin">
              <Route index element={<AdminDashboard />} />
              <Route path="user-accounts" element={<ManageAccount />} />
              <Route path="transactions" element={<ManageTransaction />} />
              <Route path="vaccine-list" element={<ManageVaccineRecommendation />} />
              <Route path="add-new-vaccine" element={<AddNewVaccine />} />
              <Route path="place-list" element={<ManagePlaceRecommendation />} />
              <Route path="add-new-place" element={<CreateNewPlace />} />
            </Route>
          </Route>
        </Route>

        {/* Private Routes for Manager */}
        <Route element={<PrivateRoute role="manager" />}>
          <Route element={<LayoutDefault />}>
            <Route path="/manager">
              <Route index element={<ManagerDashboard />} />
              <Route path="petcenter-accounts" element={<ManagePetCenter />} />
              <Route path="list-petcenter-application" element={<PetCenterApplication />} />
              <Route path="history-pet-center-application" element={<ProcessedPetCenterApplication />} />
              <Route path="pet-accounts" element={<ManagePet />} />
              <Route path="create-pet" element={<CreatePet />} />
              <Route path="pet-breeding" element={<ManageBreeding />} />
              <Route path="history-breeding-application" element={<ProcessedBreedingApplication />} />
              <Route path="manage-report" element={<ManageReport />} />
              <Route path="appointments" element={<ManageAppointment />} />
              <Route path="history-user-report" element={<ProcessedReport />} />
              <Route path="chat-reports" element={<ChatUserReport />} />
            </Route>
          </Route>
        </Route>

        {/* Default redirect for unknown routes */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
