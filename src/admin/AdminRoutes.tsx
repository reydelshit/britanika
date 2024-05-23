import { Button } from '@/components/ui/button';
import axios from 'axios';
import moment from 'moment';
import { useState } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { RiCloseFill } from 'react-icons/ri';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Admin from './Admin';
import Carts from './pages/DrivingRangeAdmin';
import Expense from './pages/Expense';
import ExpenseView from './pages/ExpenseView';
import SalesReport from './pages/SalesReport';
import Staff from './pages/Staff';
import Stocks from './pages/Stocks';
import Dashboard from './pages/Dashboard';

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
        <div className="no-print absolute right-16 top-8 z-50 mt-[5rem] min-h-[30rem] w-[30rem] overflow-y-scroll border-2 bg-white p-4">
          {notifications.length > 0 ? (
            notifications.map((not, index) => (
              <div
                key={index}
                className="z-50 flex items-center justify-between gap-2 rounded-xl border-b-2 bg-[#41644A] p-2 text-sm  text-white"
              >
                <p className="w-[70%] break-words ">
                  {not.notification_message}
                </p>
                <p>{moment(not.created_at).format('LL')}</p>
              </div>
            ))
          ) : (
            <p className="text-center">No Notification</p>
          )}
        </div>
      )}

      <div className="fixed left-0 top-0 flex h-screen w-[20rem] flex-col items-start border-r-2 bg-[#41644A] p-4 pt-[5rem] text-start">
        <Button
          onClick={() => console.log(currentPath)}
          className={`mb-2 flex h-[4rem] w-full gap-2 bg-[#41644A] p-1 text-2xl font-bold hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A] ${
            currentPath == '/admin/dashboard'
              ? ' rounded-md border-2 border-[#41644A] bg-white text-start text-[#41644A]'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/dashboard">
            {/* <RiAdminLine className="h-[1.5rem] w-[2rem]" /> */}
            DASHBOARD
          </Link>
        </Button>
        <Button
          onClick={() => console.log(currentPath)}
          className={`mb-2 flex h-[4rem] w-full gap-2 bg-[#41644A] p-1 text-2xl font-bold hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A] ${
            currentPath == '/admin'
              ? ' rounded-md border-2 border-[#41644A] bg-white text-start text-[#41644A]'
              : ''
          }`}
        >
          <Link className="flex" to="/admin">
            {/* <RiAdminLine className="h-[1.5rem] w-[2rem]" /> */}
            RESTO
          </Link>
        </Button>
        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2  bg-[#41644A] p-1 text-2xl font-bold hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A] ${
            currentPath == '/admin/carts'
              ? ' rounded-md border-2 border-[#41644A] bg-white text-start text-[#41644A]'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/carts">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            DRIVING RANGE
          </Link>
        </Button>

        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2  bg-[#41644A] p-1 text-2xl font-bold hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A] ${
            currentPath == '/admin/sales-report'
              ? ' rounded-md border-2 border-[#41644A] bg-white text-start text-[#41644A]'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/sales-report">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            SALES REPORT
          </Link>
        </Button>

        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2  bg-[#41644A] p-1 text-2xl font-bold hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A] ${
            currentPath == '/admin/expense'
              ? ' rounded-md border-2 border-[#41644A] bg-white text-start text-[#41644A]'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/expense">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            EXPENSE REPORT
          </Link>
        </Button>
        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2  bg-[#41644A] p-1 text-2xl font-bold hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A] ${
            currentPath == '/admin/stocks'
              ? ' rounded-md border-2 border-[#41644A] bg-white text-start text-[#41644A]'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/stocks">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            STOCK HISTORY
          </Link>
        </Button>

        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2  bg-[#41644A] p-1 text-2xl font-bold hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A] ${
            currentPath == '/admin/staffs'
              ? ' rounded-md border-2 border-[#41644A] bg-white text-start text-[#41644A]'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/staffs">
            {/* <AiOutlineDropbox className="h-[1.5rem] w-[2rem]" /> */}
            STAFFS
          </Link>
        </Button>
        {/* 
        <Button
          className={`mb-2 flex h-[4rem] w-full gap-2 border-2 bg-[#41644A] p-1 text-2xl font-bold hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A] ${
            currentPath == '/admin/accountants'
              ? ' rounded-md border-2 border-[#41644A] bg-white text-start text-[#41644A]'
              : ''
          }`}
        >
          <Link className="flex" to="/admin/accountants">
            ACCOUNTANTS
          </Link>
        </Button> */}
      </div>
      <div className="w-full justify-center px-4">
        <Routes>
          <Route path="/" index element={<Admin />} />
          <Route path="/dashboard" index element={<Dashboard />} />
          <Route path="/carts" element={<Carts />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/expense/:id" element={<ExpenseView />} />

          <Route path="/staffs" element={<Staff />} />

          {/* <Route path="/accountants" index element={<Accountants />} /> */}
        </Routes>
      </div>
    </div>
  );
}
