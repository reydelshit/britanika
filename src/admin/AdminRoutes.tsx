import { Button } from '@/components/ui/button';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Admin from './Admin';
import Carts from './pages/DrivingRangeAdmin';
import Staff from './pages/Staff';
import Accountants from './pages/Accountants';
import { IoIosNotificationsOutline } from 'react-icons/io';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RiCloseFill } from 'react-icons/ri';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import SalesReport from './pages/SalesReport';
import Stocks from './pages/Stocks';
import Expense from './pages/Expense';

type Notification = {
  notification_id: number;
  notification_message: string;
  created_at: string;
};

export default function AdminRoutes() {
  const currentPath = useLocation().pathname;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  const fetchNotification = async () => {
    await axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/notification.php`)
      .then((res) => {
        setNotifications(res.data);
        console.log(res.data);
      });
  };

  const handleNotification = () => {
    fetchNotification();

    setShowNotification(!showNotification);
  };

  return (
    <div className="relative flex w-full justify-between border-2">
      <span
        onClick={handleNotification}
        className="absolute right-16 top-8 cursor-pointer"
      >
        {showNotification ? (
          <RiCloseFill className="text-[3rem]" />
        ) : (
          <div className="relative w-fit">
            <span className="absolute right-2 top-2 block h-[1rem] w-[1rem] rounded-full bg-red-500 text-red-500"></span>
            <IoIosNotificationsOutline className="text-[3rem]" />
          </div>
        )}
      </span>

      {showNotification && (
        <div className="absolute right-16 top-8 mt-[5rem] min-h-[30rem] w-[30rem] overflow-y-scroll border-2 bg-white p-4">
          {notifications.length > 0 ? (
            notifications.map((not, index) => (
              <div
                key={index}
                className="z-50 flex items-center justify-between gap-2 border-b-2 bg-slate-200 p-2"
              >
                <p className="w-[70%] break-words text-black">
                  {not.notification_message}
                </p>
                <p className="text-black">
                  {moment(not.created_at).format('LL')}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center">No Notification</p>
          )}
        </div>
      )}

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
            currentPath == '/admin/sales-report'
              ? ' rounded-md bg-blue-500 text-start text-white'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/sales-report">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            SALES REPORT
          </Link>
        </Button>

        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2 p-1 text-2xl font-bold ${
            currentPath == '/admin/expense'
              ? ' rounded-md bg-blue-500 text-start text-white'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/expense">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            EXPENSE REPORT
          </Link>
        </Button>
        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2 p-1 text-2xl font-bold ${
            currentPath == '/admin/stocks'
              ? ' rounded-md bg-blue-500 text-start text-white'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/stocks">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            STOCKS
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
            ACCOUNTANTS
          </Link>
        </Button>
      </div>
      <div className="w-full justify-center px-4">
        <Routes>
          <Route path="/" index element={<Admin />} />
          <Route path="/carts" element={<Carts />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/expense" element={<Expense />} />

          <Route path="/staffs" element={<Staff />} />
          <Route path="/accountants" index element={<Accountants />} />
        </Routes>
      </div>
    </div>
  );
}
