import { Button } from '@/components/ui/button';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import CartStaff from './pages/CartStaff';
import Resto from './pages/Resto';
import StaffMain from './StaffMain';

export default function StaffRoute() {
  const accountType = localStorage.getItem('type');
  const currentPath = useLocation().pathname;

  return (
    <div className="flex w-full justify-between border-2">
      <div className="flex h-screen w-[15rem] flex-col items-start border-r-2 p-4 pt-[5rem] text-start">
        <Button
          onClick={() => console.log(currentPath)}
          className={`mb-2 flex h-[4rem] w-full gap-2 border-2 p-1 text-2xl font-bold ${
            currentPath == '/staff'
              ? ' rounded-md bg-blue-500 text-start text-white'
              : ''
          }`}
        >
          <Link className="flex" to="/staff">
            {/* <RistaffLine className="h-[1.5rem] w-[2rem]" /> */}
            RESTO
          </Link>
        </Button>
        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2 p-1 text-2xl font-bold ${
            currentPath == '/staff/carts'
              ? ' rounded-md bg-blue-500 text-start text-white'
              : ''
          }`}
        >
          <Link className="flex" to="/staff/carts">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            CARTS
          </Link>
        </Button>
      </div>
      <div className="w-full justify-center px-4">
        <Routes>
          <Route path="/" index element={<StaffMain />} />
          <Route path="/resto" element={<Resto />} />
          <Route path="/carts" element={<CartStaff />} />
        </Routes>
      </div>
    </div>
  );
}