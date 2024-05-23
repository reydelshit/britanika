import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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
              {filteredOrders.reduce((acc, curr) => acc + curr.amount, 0) +
                filteredCarts.reduce((acc, curr) => acc + curr.amount, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="mt-[2rem] rounded-lg border-2 bg-white md:w-[70%] md:p-5">
          <h1 className="mb-5 font-bold uppercase">Monthly Orders Products</h1>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={monthlyOrders}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) => `${value}`}
              />
              <Bar dataKey="total" fill="#41644A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-[2rem] rounded-lg border-2 bg-white md:w-[70%] md:p-5">
          <h1 className="mb-5 font-bold uppercase">Monthly Driving Range</h1>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={monthlyDrivingRange}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) => `${value}`}
              />
              <Bar dataKey="total" fill="#41644A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
