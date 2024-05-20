import { Button } from '@/components/ui/button';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import DrivingRange from './pages/DrivingRange';
import ExpenseForm from './pages/ExpenseForm';
import Resto from './pages/Resto';

export default function StaffRoute() {
  const staff_type = localStorage.getItem('staff_type');
  const currentPath = useLocation().pathname;

  return (
    <div className="flex w-full justify-between">
      <div className="fixed left-0 top-0 z-50 flex h-screen w-[20rem] flex-col items-start border-r-2 bg-[#41644A] p-4 pt-[5rem] text-start">
        <Button
          onClick={() => console.log(currentPath)}
          className={`mb-2 flex h-[4rem] w-full gap-2  bg-[#41644A] p-1 text-2xl font-bold hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A] ${
            currentPath == '/staff'
              ? '  rounded-md border-2 border-[#41644A] bg-white text-start text-[#41644A]'
              : ''
          }`}
        >
          <Link className="flex" to="/staff">
            {/* <RistaffLine className="h-[1.5rem] w-[2rem]" /> */}
            DASHBOARD
          </Link>
        </Button>

        {staff_type == 'resto' && (
          <Button
            onClick={() => console.log(currentPath)}
            className={`mb-2 flex h-[4rem] w-full gap-2  bg-[#41644A] p-1 text-2xl font-bold hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A] ${
              currentPath == '/staff/resto'
                ? '  rounded-md border-2 border-[#41644A] bg-white text-start text-[#41644A]'
                : ''
            }`}
          >
            <Link className="flex" to="/staff/resto">
              {/* <RistaffLine className="h-[1.5rem] w-[2rem]" /> */}
              RESTO
            </Link>
          </Button>
        )}

        {staff_type == 'driving-range' && (
          <Button
            className={`mb-2 flex h-[4rem] w-full gap-2  bg-[#41644A] p-1 text-2xl font-bold hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A] ${
              currentPath == '/staff/driving-range'
                ? '  rounded-md border-2 border-[#41644A] bg-white text-start text-[#41644A]'
                : ''
            }`}
          >
            <Link className="flex" to="/staff/driving-range">
              {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
              DRIVING RANGE
            </Link>
          </Button>
        )}
      </div>
      <div className="w-full justify-center px-4">
        <Routes>
          <Route path="/" index element={<Dashboard />} />
          <Route path="/resto" element={<Resto />} />
          <Route path="/resto/expense" element={<ExpenseForm />} />
          <Route path="/driving-range" element={<DrivingRange />} />
        </Routes>
      </div>
    </div>
  );
}
