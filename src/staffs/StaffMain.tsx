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
import AddOrder from './components/AddOrder';

type Dishes = {
  dish_id: number;
  dish_name: string;
  dish_image: string;
  dish_price: number;
  availability_status: string;
};

type Orders = {
  order_id: number;
  order_customer_name: string;
  amount: number;
  created_at: string;
  status: string;
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

export default function StaffMain() {
  const accountType = localStorage.getItem('type');
  const currentPath = useLocation().pathname;

  const [dishes, setDishes] = useState<Dishes[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  const getALlDishes = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/dish.php`)
      .then((res) => {
        setDishes(res.data);
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
    getALlDishes();
    getALlOrders();
  }, []);

  return (
    <div className="flex w-full justify-between border-2">
      {showOrderForm && (
        <div className="absolute flex h-full w-full items-center justify-center bg-white bg-opacity-80">
          <AddOrder setShowOrderForm={setShowOrderForm} />
        </div>
      )}

      <div>
        <h1 className="text-[4rem] font-bold">ORDER DISHES SECTION</h1>

        <div className="grid grid-cols-4 gap-4">
          {dishes &&
            dishes
              .map((dish, index) => (
                <div
                  key={index}
                  className="flex  w-[20rem] flex-col rounded-md border-2 p-4"
                >
                  <img
                    className="h-[12rem] w-full object-cover"
                    src={dish.dish_image}
                    alt={dish.dish_name}
                  />
                  <div className="my-2 flex items-center justify-between">
                    <h1 className="my-2 font-semibold">{dish.dish_name}</h1>

                    <span
                      className={`rounded-md ${dish.availability_status === 'Available' ? 'bg-green-500' : 'bg-red-500'}  p-2 font-bold uppercase`}
                    >
                      {dish.availability_status}
                    </span>
                  </div>
                  <h1 className="my-2 font-semibold">
                    Price: ₱ {dish.dish_price}
                  </h1>
                </div>
              ))
              .slice(0, 4)}
        </div>

        <div className="mt-[rem] w-full">
          <Button className="my-[2rem]" onClick={() => setShowOrderForm(true)}>
            Add Order
          </Button>

          <div className="mt-[1rem] w-full">
            <Table className="mx-auto w-[100%] border-2 bg-white">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">ID</TableHead>
                  <TableHead className="text-center">Customer Name</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>

                  <TableHead className="text-center">Date Created</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allOrders.length > 0 ? (
                  allOrders.map((ord, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">
                        {ord.order_id}
                      </TableCell>
                      <TableCell className="text-center">
                        {ord.order_customer_name}
                      </TableCell>

                      <TableCell className="text-center">
                        ₱{ord.amount}
                      </TableCell>

                      <TableCell className="text-center">
                        {ord.quantity}
                      </TableCell>
                      <TableCell className="text-center">
                        {moment(ord.created_at).format('LL')}
                      </TableCell>

                      <TableCell className="text-center">
                        {ord.status}
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
