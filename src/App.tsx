import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login';
import AdminRoutes from './admin/AdminRoutes';
import ProtectedRoute from './admin/ProtectedRoute';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/toaster';
import ProtectedStaff from './staffs/ProtectedStaff';
import StaffRoute from './staffs/StaffRoute';

function App() {
  if (!localStorage.getItem('user_id_britanika')) {
    return <Login />;
  }

  const accountType = localStorage.getItem('type') as undefined | string;
  const navigate = useNavigate();
  const logout = () => {
    console.log('logout');
    localStorage.removeItem('user_id_britanika');
    localStorage.removeItem('type');
    localStorage.removeItem('britanika_reauth');
    navigate('/', { replace: true });
  };

  return (
    <div className="flex h-dvh w-dvw  flex-col items-center justify-center">
      <Routes>
        <Route index element={<Login />} />
        <Route
          path="/staff/*"
          element={
            <ProtectedStaff>
              <StaffRoute />
            </ProtectedStaff>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* catch error  */}

        <Route
          path="*"
          element={
            <div
              className="
        flex h-full w-full items-center justify-center"
            >
              404
            </div>
          }
        />
      </Routes>
      <Toaster />

      <div className="fixed bottom-10 left-4 z-50 flex h-[10rem] w-[15rem] flex-col items-center text-2xl  font-bold text-white">
        {accountType === 'admin' ? (
          <span className="w-full border-b-4 border-white text-center text-2xl font-bold">
            ADMIN
          </span>
        ) : accountType === 'staff' ? (
          <span className="w-full border-b-4 border-white text-center text-2xl font-bold">
            STAFF
          </span>
        ) : null}

        <Button
          onClick={logout}
          className="absolute bottom-0 left-4 h-[4rem] w-[14rem] border-4 bg-[#41644A] text-2xl font-bold text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
        >
          LOGOUT
        </Button>
      </div>
    </div>
  );
}

export default App;
