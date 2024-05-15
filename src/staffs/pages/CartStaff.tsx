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
import AddCartStaff from '../components/AddCartStaff';

type OrderCarts = {
  order_cart_id: string;
  customer_name: string;
  cart_id: string;
  amount: number;
  created_at: Date;
  cart_number: string;
};
type Carts = {
  cart_id: number;
  cart_number: string;
  type: string;
  color: string;
  cart_image: string;
  price: number;
  availability_status: string;
};

export default function CartStaff() {
  const [cartOrders, setCartOrders] = useState<OrderCarts[]>([]);

  const [carts, setCarts] = useState<Carts[]>([]);
  const [showCartForm, setShowCartForm] = useState(false);

  const getALlCarts = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/carts.php`)
      .then((res) => {
        setCarts(res.data);
      });
  };

  const getALlCartOrders = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/order-cart.php`)
      .then((res) => {
        setCartOrders(res.data);
      });
  };

  useEffect(() => {
    getALlCartOrders();
    getALlCarts();
  }, []);

  return (
    <div className="flex w-full justify-between border-2">
      {showCartForm && (
        <div className="absolute flex h-full w-full items-center justify-center  bg-white bg-opacity-80">
          <AddCartStaff setShowCartForm={setShowCartForm} />
        </div>
      )}

      <div>
        <h1 className="text-[4rem] font-bold">ORDER CARTS SECTION</h1>

        <div className="grid grid-cols-4 gap-4">
          {carts &&
            carts
              .map((cart, index) => (
                <div
                  key={index}
                  className="flex  w-[20rem] flex-col rounded-md border-2 p-4"
                >
                  <img
                    className="h-[12rem] w-full object-cover"
                    src={cart.cart_image}
                    alt={cart.cart_number}
                  />
                  <div className="my-2 flex items-center justify-between">
                    <h1 className="my-2 font-semibold">{cart.cart_number}</h1>

                    <span
                      className={`rounded-md ${cart.availability_status === 'Available' ? 'bg-green-500' : 'bg-red-500'}  p-2 font-bold uppercase`}
                    >
                      {cart.availability_status}
                    </span>
                  </div>
                  <h1 className="my-2 font-semibold">Price: ₱ {cart.price}</h1>
                </div>
              ))
              .slice(0, 4)}
        </div>

        <div className="mt-[rem] w-full">
          <div className="flex justify-end">
            <Button
              className="my-[2rem] h-[3.5rem]  text-2xl font-bold text-white"
              onClick={() => setShowCartForm(true)}
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
                  <TableHead className="text-center">Cart No.</TableHead>

                  <TableHead className="text-center">Amount</TableHead>

                  <TableHead className="text-center">Date Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartOrders.length > 0 ? (
                  cartOrders.map((cart, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
