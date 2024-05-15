import { Button } from '@/components/ui/button';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import AccountantMain from './Accountant';

export default function AccountantRoute() {
  const currentPath = useLocation().pathname;

  return (
    <div className="flex w-full justify-between border-2">
      <div className="flex h-screen w-[15rem] flex-col items-start border-r-2 p-4 pt-[5rem] text-start">
        <Button
          onClick={() => console.log(currentPath)}
          className={`mb-2 flex h-[4rem] w-full gap-2 border-2 p-1 text-2xl font-bold ${
            currentPath == '/accountant'
              ? ' rounded-md bg-blue-500 text-start text-white'
              : ''
          }`}
        >
          <Link className="flex" to="/accountant">
            {/* <RiAdminLine className="h-[1.5rem] w-[2rem]" /> */}
            REPORTS
          </Link>
        </Button>
      </div>
      <div className="w-full justify-center px-4">
        <Routes>
          <Route path="/" index element={<AccountantMain />} />
        </Routes>
      </div>
    </div>
  );
}
