import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Admin from './Admin';
import { RiAdminLine } from 'react-icons/ri';
import { AiOutlineDropbox } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import Carts from './pages/Carts';
import Staff from './pages/Staff';

export default function AdminRoutes() {
  const accountType = localStorage.getItem('type');
  const currentPath = useLocation().pathname;

  return (
    <div className="flex w-full justify-between border-2">
      <div className="flex h-screen w-[15rem] flex-col items-start border-r-2 p-4 pt-[5rem] text-start">
        <Button
          onClick={() => console.log(currentPath)}
          className={`mb-2 flex h-[4rem] w-full gap-2 border-2 p-1 text-2xl font-bold ${
            currentPath == '/admin'
              ? ' rounded-md bg-blue-500 text-start text-white'
              : ''
          }`}
        >
          <Link className="flex" to="/admin">
            {/* <RiAdminLine className="h-[1.5rem] w-[2rem]" /> */}
            RESTO
          </Link>
        </Button>
        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2 p-1 text-2xl font-bold ${
            currentPath == '/admin/carts'
              ? ' rounded-md bg-blue-500 text-start text-white'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/carts">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            CARTS
          </Link>
        </Button>

        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2 p-1 text-2xl font-bold ${
            currentPath == '/admin/staffs'
              ? ' rounded-md bg-blue-500 text-start text-white'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/staffs">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            STAFFS
          </Link>
        </Button>

        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2 p-1 text-2xl font-bold ${
            currentPath == '/admin/accountants'
              ? ' rounded-md bg-blue-500 text-start text-white'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/accountants">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            ACCOUNTS
          </Link>
        </Button>
      </div>
      <div className="w-full justify-center px-4">
        <Routes>
          <Route path="/" index element={<Admin />} />
          <Route path="/carts" index element={<Carts />} />
          <Route path="/accountants" index element={<Staff />} />
        </Routes>
      </div>
    </div>
  );
}
