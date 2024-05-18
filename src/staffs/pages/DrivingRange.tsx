import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
      });
  };

  useEffect(() => {
    getALlrangeOrders();
    getALlranges();
  }, []);

  return (
    <div className="flex w-full justify-between border-2">
      {showRangeForm && (
        <div className="absolute flex h-full w-full items-center justify-center  bg-white bg-opacity-80">
          <AddRangeStaff setShowRangeForm={setShowRangeForm} />
        </div>
      )}

      <div>
        <h1 className="text-[4rem] font-bold">ORDER rangeS SECTION</h1>

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
                      className={`rounded-md ${range.availability_status === 'Available' ? 'bg-green-500' : 'bg-red-500'}  p-2 font-bold uppercase`}
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
          <div className="flex justify-end">
            <Button
              className="my-[2rem] h-[3.5rem]  text-2xl font-bold text-white"
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
                {drivingOrder.length > 0 ? (
                  drivingOrder.map((range, index) => (
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
