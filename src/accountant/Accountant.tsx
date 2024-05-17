import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReactToPrint } from 'react-to-print';

type OrderCarts = {
  order_cart_id: string;
  customer_name: string;
  cart_id: string;
  amount: number;
  created_at: Date;
  cart_number: string;
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

const AccountantMain = () => {
  const [cartOrders, setCartOrders] = useState<OrderCarts[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState(
    'Daily' as string,
  );

  const componentRef = useRef<HTMLTableElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current || null,
  });
  const componentRef2 = useRef<HTMLTableElement>(null);
  const handlePrint2 = useReactToPrint({
    content: () => componentRef2.current || null,
  });

  const getALlCartOrders = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/order-cart.php`)
      .then((res) => {
        setCartOrders(res.data);
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

  useEffect(() => {
    getALlOrders();
    getALlCartOrders();
  }, []);

  const handleFilterDate = (value: string) => {
    console.log(value);
    setSelectedDateFilter(value);

    console.log(value);
  };

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

  const filteredCarts = cartOrders.filter((ord) => {
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
    <div>
      <h1 className="text-[4rem] font-bold">REPORTS</h1>

      <div className="flex justify-end gap-4 px-4">
        <Select onValueChange={handleFilterDate}>
          <SelectTrigger className="h-[3rem] w-[15rem]  text-2xl font-bold">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div ref={componentRef2} className="mt-[1rem] w-full">
        <div className="my-2 flex justify-between">
          <h1 className="text-[2rem] font-bold">RESTO ORDERS</h1>

          <Button
            onClick={handlePrint2}
            className="no-print h-[3rem] w-[15rem] text-xl font-semibold"
          >
            Export Resto
          </Button>
        </div>

        <Table className="mx-auto w-[100%] border-2 bg-white">
          <TableHeader>
            <TableRow>
              {/* <TableHead className="text-center">ID</TableHead> */}
              <TableHead className="text-center">Customer Name</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Quantity</TableHead>

              <TableHead className="text-center">Date Created</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((ord, index) => (
                <TableRow key={index}>
                  {/* <TableCell className="text-center">{ord.order_id}</TableCell> */}
                  <TableCell className="text-center">
                    {ord.order_customer_name}
                  </TableCell>

                  <TableCell className="text-center">₱{ord.amount}</TableCell>

                  <TableCell className="text-center">{ord.quantity}</TableCell>
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

        <div className="my-[1rem] flex w-[95%] justify-end">
          <span className="block rounded-lg bg-green-500 p-4 font-semibold text-white">
            RESTO SALES: ₱{' '}
            {filteredOrders
              .filter((ord) => ord.status.toLowerCase().includes('served'))
              .reduce((acc, ord) => acc + ord.amount, 0)}
          </span>
        </div>
      </div>

      <div ref={componentRef} className="mt-[2rem] w-full">
        <div className="my-2 flex justify-between">
          <h1 className="text-[2rem] font-bold">CARTS CUSTOMERS</h1>

          <Button
            onClick={handlePrint}
            className="no-print h-[3rem] w-[15rem] text-xl font-semibold"
          >
            Export Carts
          </Button>
        </div>

        <div className="mt-[1rem] w-full ">
          <Table className="mx-auto w-[100%] border-2 bg-white">
            <TableHeader>
              <TableRow>
                {/* <TableHead className="text-center">ID</TableHead> */}
                <TableHead className="text-center">Customer Name</TableHead>
                <TableHead className="text-center">Cart No.</TableHead>

                <TableHead className="text-center">Amount</TableHead>

                <TableHead className="text-center">Date Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarts.length > 0 ? (
                filteredCarts.map((cart, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      {cart.customer_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {cart.cart_number}
                    </TableCell>

                    <TableCell className="text-center">
                      ₱{cart.amount}
                    </TableCell>

                    <TableCell className="text-center">
                      {moment(cart.created_at).format('LL')}
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

          <div className="my-[1rem] flex w-[95%] justify-end">
            <span className="block rounded-lg bg-green-500 p-4 font-semibold text-white">
              CART SALES: ₱{' '}
              {filteredCarts.reduce((acc, ord) => acc + ord.amount, 0)}
            </span>
          </div>
        </div>

        <div className="my-[1rem] flex w-[95%] justify-end">
          <span className="block rounded-lg bg-yellow-500 p-4 font-semibold text-white">
            TOTAL SALES: ₱{' '}
            {filteredCarts.reduce((acc, ord) => acc + ord.amount, 0) +
              filteredOrders
                .filter((ord) => ord.status.toLowerCase().includes('served'))
                .reduce((acc, ord) => acc + ord.amount, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountantMain;
