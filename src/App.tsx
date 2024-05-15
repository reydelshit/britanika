import { Route, Routes } from 'react-router-dom';
import AdminRoutes from './admin/AdminRoutes';
import ProtectedRoute from './admin/ProtectedRoute';
import { Toaster } from './components/ui/toaster';
import { Button } from './components/ui/button';

function App() {
  const logout = () => {
    console.log('logout');
  };

  return (
    <div className="flex h-dvh w-dvw  flex-col items-center justify-center">
      <Routes>
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
      </Routes>
      <Toaster />

      <Button
        className="absolute bottom-4 left-4 h-[4rem] w-[10rem] text-2xl font-bold"
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  );
}

export default App;
