import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Product = {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  availability_status: string;
  stocks: number;
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

type Order = {
  order_id: string;
  order_customer_name: string;
  amount: number;
  created_at: Date;
  status: string;
  dish_id: string;
  quantity: number;
};

type OrderDriving = {
  order_range_id: string;
  customer_name: string;
  range_id: string;
  amount: number;
  created_at: Date;
  range_number: string;
};

type MonthlyType = {
  name: string;
  total: number;
};

const Dashboard = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [drivingRange, setDrivingRange] = useState<DrivingRange[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [drivingOrder, setDrivingOrders] = useState<OrderDriving[]>([]);
  const [monthlyOrders, setMonthlyOrders] = useState<MonthlyType[]>([]);
  const [monthlyDrivingRange, setMonthlyDrivingRange] = useState<MonthlyType[]>(
    [],
  );

  const staff_type = localStorage.getItem('staff_type');

  const [selectedDateFilter, setSelectedDateFilter] = useState(
    'Daily' as string,
  );

  const getALlProducts = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/product.php`)
      .then((res) => {
        setProduct(res.data);
      });
  };

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

  const getALlOrders = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/order.php`)
      .then((res) => {
        setAllOrders(res.data);
        console.log(res.data);
      });
  };

  const getALlMonthlyOrders = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/monthly-orders.php`)
      .then((res) => {
        setMonthlyOrders(res.data);
        console.log(res.data);
      });
  };

  const getALlMonthlyOrdersDrivingRange = () => {
    axios
      .get(
        `${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/monthly-orders-driving.php`,
      )
      .then((res) => {
        setMonthlyDrivingRange(res.data);
        console.log(res.data);
      });
  };

  useEffect(() => {
    Promise.all([
      getALlProducts(),
      getALlranges(),

      getALlOrders(),
      getALlrangeOrders(),
      getALlMonthlyOrdersDrivingRange(),
      getALlMonthlyOrders(),
    ]);
  }, []);

  const filteredOrders = allOrders.filter((ord) => {
    const orderDate = moment(ord.created_at);
    const currentDate = moment();

    switch (selectedDateFilter) {
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

  const filteredCarts = drivingOrder.filter((ord) => {
    const orderDate = moment(ord.created_at);
    const currentDate = moment();

    switch (selectedDateFilter) {
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
    <div className="h-screen w-full pl-[20rem]">
      <h1 className="my-4 text-[4rem] font-bold text-[#41644A]">DASHBOARD</h1>
      <div>
        <div className="flex gap-4">
          <div className="relative h-[10rem] w-full rounded-xl border-2 bg-[#41644A] p-4 text-white">
            <h1 className="text-2xl font-semibold ">
              Total Number of Products
            </h1>
            <p className="absolute bottom-4 right-4 text-end text-6xl font-bold">
              {product.length}
            </p>
          </div>

          <div className="relative h-[10rem] w-full rounded-xl border-2 bg-[#41644A] p-4 text-white">
            <h1 className="text-2xl font-semibold  ">Total Number of Cart</h1>
            <p className="absolute bottom-4 right-4 text-end text-6xl font-bold">
              {drivingRange.length}
            </p>
          </div>

          <div className="relative h-[10rem] w-full rounded-xl border-2 bg-[#41644A] p-4 text-white">
            <h1 className="ld text-2xl font-semibold ">Total No. of Orders</h1>
            <p className="absolute bottom-4 right-4 text-end text-6xl font-bold">
              {allOrders.length + drivingOrder.length}
            </p>
          </div>

          <div className="relative h-[10rem] w-full rounded-xl border-2 bg-[#41644A] p-4 text-white">
            <h1 className="text-2xl font-semibold  ">Total Daily Sales</h1>
            <p className="absolute bottom-4 right-4 text-end text-6xl font-bold">
              ₱{' '}
              {staff_type == 'resto'
                ? filteredOrders
                    .filter((ord) =>
                      ord.status.toLowerCase().includes('served'),
                    )
                    .reduce((acc, curr) => acc + curr.amount, 0)
                : filteredCarts.reduce(
                    (acc, curr) => acc + curr.amount,
                    0,
                  )}{' '}
            </p>
          </div>
        </div>
      </div>

      {staff_type == 'resto' ? (
        <Table className="mx-auto mt-[2rem] w-[100%] border-2 bg-white">
          <TableHeader>
            <TableRow>
              {/* <TableHead className="text-center">ID</TableHead> */}
              <TableHead className="text-center">Customer Name</TableHead>
              <TableHead className="text-center">Amount</TableHead>

              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders
                .sort((a, b) => {
                  const orderA = Number(a.order_id);
                  const orderB = Number(b.order_id);
                  if (
                    a.status.toLowerCase().includes('pending') &&
                    !b.status.toLowerCase().includes('pending')
                  ) {
                    return -1;
                  }
                  if (
                    !a.status.toLowerCase().includes('pending') &&
                    b.status.toLowerCase().includes('pending')
                  ) {
                    return 1;
                  }
                  return orderA - orderB;
                })
                .filter((ord) => ord.status.toLowerCase().includes('served'))
                .map((ord, index) => (
                  <TableRow className="h-[3rem]" key={index}>
                    {/* <TableCell className="text-center">
                      {ord.order_id}
                    </TableCell> */}
                    <TableCell className="text-center">
                      {ord.order_customer_name}
                    </TableCell>

                    <TableCell className="text-center">₱{ord.amount}</TableCell>

                    <TableCell className="text-center">
                      {moment(ord.created_at).format('LL')}
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`rounded-md p-2 text-white ${
                          ord.status.toLowerCase().includes('pending')
                            ? 'bg-yellow-500'
                            : ord.status.toLowerCase().includes('served')
                              ? 'bg-green-500'
                              : 'bg-red-500'
                        }`}
                      >
                        {ord.status}
                      </span>
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
      ) : (
        <Table className="mx-auto mt-[2rem] w-[100%] border-2 bg-white">
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
            {filteredCarts.length > 0 ? (
              filteredCarts.map((range, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    {range.customer_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {range.range_number}
                  </TableCell>

                  <TableCell className="text-center">₱{range.amount}</TableCell>

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
      )}
    </div>
  );
};

export default Dashboard;
