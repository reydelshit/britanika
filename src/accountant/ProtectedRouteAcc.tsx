import { Navigate } from 'react-router-dom';

export default function ProtectedRouteAcc({ children }: any) {
  if (
    localStorage.getItem('type') === 'staff' ||
    localStorage.getItem('type') === 'admin'
  ) {
    localStorage.removeItem('user_id_britanika');
    localStorage.removeItem('type');
    localStorage.removeItem('britanika_reauth');

    window.location.reload();

    return <Navigate to="/" />;
  }
  return children;
}
