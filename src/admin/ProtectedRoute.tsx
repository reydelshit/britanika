import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: any) {
  if (
    localStorage.getItem('type') === 'staff' ||
    localStorage.getItem('type') === 'accountant'
  ) {
    return <Navigate to="/" />;
  }
  return children;
}
