import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import moment from 'moment';
import AddRangeStaff from '../components/AddRangeStaff';

type OrderDriving = {
  order_range_id: string;
  customer_name: string;
  range_id: string;
  amount: number;
  created_at: Date;
  range_number: string;
};
type DrivingRange = {
  range_id: number;
  range_number: string;
  type: string;
  color: string;
  range_image: string;
  price: number;
  availability_status: string;
};

export default function DrivingRange() {
  const [drivingOrder, setDrivingOrders] = useState<OrderDriving[]>([]);

  const [drivingRange, setDrivingRange] = useState<DrivingRange[]>([]);
  const [showRangeForm, setShowRangeForm] = useState(false);
  const dailyFilter = 'Daily' as
    | string
    | 'Weekly'
    | 'Monthly'
    | 'Yearly'
    | 'All';

  const getALlranges = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/driving_range.php`)
      .then((res) => {
        setDrivingRange(res.data);
      });
  };

  const getALlrangeOrders = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/order-range.php`)
      .then((res) => {
        setDrivingOrders(res.data);
        console.log(res.data);
      });
  };

  useEffect(() => {
    getALlrangeOrders();
    getALlranges();
  }, []);

  const filteredOrders = drivingOrder.filter((ord) => {
    const orderDate = moment(ord.created_at);
    const currentDate = moment();

    switch (dailyFilter) {
      case 'Daily':
        return orderDate.isSame(currentDate, 'day');
      case 'Weekly':
        const startOfWeek = currentDate.clone().startOf('week');
        const endOfWeek = currentDate.clone().endOf('week');
        return orderDate.isBetween(startOfWeek, endOfWeek, 'day', '[]');
      case 'Monthly':
        return orderDate.isSame(currentDate, 'month');
      case 'Yearly':
        return orderDate.isSame(currentDate, 'year');
      default:
        return true;
    }
  });

  return (
    <div className=" flex h-screen w-full flex-col justify-between border-2 pl-[20rem]">
      {showRangeForm && (
        <div className="absolute flex h-full w-full items-center justify-center  bg-white bg-opacity-80">
          <AddRangeStaff setShowRangeForm={setShowRangeForm} />
        </div>
      )}

      <div className="h-full">
        <h1 className="my-4 text-[4rem] font-bold text-[#41644A]">
          ORDER RANGE SECTION
        </h1>

        <div className="grid grid-cols-4 gap-4">
          {drivingRange &&
            drivingRange
              .map((range, index) => (
                <div
                  key={index}
                  className="flex  w-[20rem] flex-col rounded-md border-2 p-4"
                >
                  <img
                    className="h-[12rem] w-full object-cover"
                    src={range.range_image}
                    alt={range.range_number}
                  />
                  <div className="my-2 flex items-center justify-between">
                    <h1 className="my-2 font-semibold">{range.range_number}</h1>

                    <span
                      className={`rounded-md text-white ${range.availability_status === 'Available' ? 'bg-green-500' : 'bg-red-500'}  p-2 font-bold uppercase`}
                    >
                      {range.availability_status}
                    </span>
                  </div>
                  <h1 className="my-2 font-semibold">Price: ₱ {range.price}</h1>
                </div>
              ))
              .slice(0, 4)}
        </div>

        <div className="mt-[rem] w-full">
          <div className="flex items-center justify-between">
            <Button className="bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]">
              <Link to="/staff/resto/expense">Create Expense</Link>
            </Button>

            <Button
              className="my-[2rem] bg-[#41644A] font-semibold text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
              onClick={() => setShowRangeForm(true)}
            >
              Add Customer
            </Button>
          </div>

          <div className="mt-[1rem] w-full">
            <Table className="mx-auto w-[100%] border-2 bg-white">
              <TableHeader>
                <TableRow>
                  {/* <TableHead className="text-center">ID</TableHead> */}
                  <TableHead className="text-center">Customer Name</TableHead>
                  <TableHead className="text-center">range No.</TableHead>

                  <TableHead className="text-center">Amount</TableHead>

                  <TableHead className="text-center">Date Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((range, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        {range.customer_name}
                      </TableCell>
                      <TableCell className="text-center">
                        {range.range_number}
                      </TableCell>

                      <TableCell className="text-center">
                        ₱{range.amount}
                      </TableCell>

                      <TableCell className="text-center">
                        {moment(range.created_at).format('LL')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No orders available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
