import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';

import moment from 'moment';
import AddOrder from '../components/AddOrder';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AiOutlineDelete } from 'react-icons/ai';

type Product = {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  availability_status: string;
  stocks: string;
};

type Orders = {
  order_id: number;
  order_customer_name: string;
  amount: number;
  created_at: string;
  status: string;
};

type Cart = {
  cart_id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  qty: number;
};

export default function Resto() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productOrdersInCart, setProductOrdersInCart] = useState<Cart[]>([]);
  const [allOrders, setAllOrders] = useState<Orders[]>([]);
  const [quantityIndex, setQuantityIndex] = useState(0);
  const [showOrders, setShowOrders] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const user_id = localStorage.getItem('user_id_britanika');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Daily');

  const handleFetchCart = () => {
    console.log(user_id);
    if (user_id === null) {
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/cart.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        setProductOrdersInCart(res.data);
        // console.log(res.data)
        console.log(res.data, 'cart');
      });
  };

  const { toast } = useToast();

  const getALlProducts = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/product.php`)
      .then((res) => {
        setProducts(res.data);
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
    getALlProducts();
    getALlOrders();
    handleFetchCart();
  }, []);

  const handleDeleteCartProduct = (cart_id: number) => {
    console.log(cart_id);
    axios
      .delete(
        `${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/cart.php/${cart_id}`,
      )
      .then((res) => {
        console.log(res);
        toast({
          title: 'Cart: Deleted Successfully',
          description: moment().format('LLLL'),
        });

        handleFetchCart();
      });
  };

  const navigate = useNavigate();

  const handleAddToCart = (id: number) => {
    if (user_id === null) {
      navigate('/login');
    }
    const data = {
      user_id: user_id,
      product_id: id,
      qty: quantity,
    };

    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/cart.php`, {
        params: {
          product_id: id,
          user_id: user_id,
        },
      })
      .then((res) => {
        console.log(res.data, 'res');
        if (res.data.length > 0) {
          axios
            .put(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/cart.php`, {
              cart_id: res.data[0].cart_id,
              qty: res.data[0].qty + quantity,
            })
            .then((res) => {
              console.log(res);
              toast({
                title: 'Added to cart Successfully',
                description: moment().format('LLLL'),
              });
              handleFetchCart();
            });
        } else {
          axios
            .post(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/cart.php`, {
              ...data,
            })
            .then((res) => {
              console.log(res.data);
              toast({
                title: 'Added to cart Successfully',
                description: moment().format('LLLL'),
              });
              handleFetchCart();
            });
        }
      });
  };

  const handleQuantity = (
    index: number,
    qty: number,
    cart_id: number,
    type: string,
  ) => {
    setQuantityIndex(index);

    if (type === 'substract') {
      setQuantity(qty - 1);
    } else {
      setQuantity(qty + 1);
    }

    console.log(index, qty);
    axios
      .put(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/cart.php`, {
        cart_id: cart_id,
        qty: type === 'add' ? qty + 1 : qty - 1,
      })
      .then((res) => {
        console.log(res);
        handleFetchCart();
      });
  };

  const handleCheckout = () => {
    if (productOrdersInCart.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Cart is empty',
        description: moment().format('LLLL'),
      });
      return;
    }

    if (customerName === '') {
      toast({
        variant: 'destructive',
        title: 'Customer name is required',
        description: moment().format('LLLL'),
      });
      return;
    }

    const data = {
      user_id: user_id,
      amount: productOrdersInCart.reduce(
        (total, prod) => total + prod.product_price * prod.qty,
        0,
      ),
      products: productOrdersInCart.map((prod) => ({
        product_id: prod.product_id,
        quantity: prod.qty,
        cart_id: prod.cart_id,
      })),

      order_customer_name: customerName,
    };

    axios
      .post(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/order.php`, {
        ...data,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          toast({
            title: 'Order: Added Successfully',
            description: moment().format('LLLL'),
          });
          setCustomerName('');
        } else {
          toast({
            variant: 'destructive',
            title: 'Order: Failed to add',
            description: moment().format('LLLL'),
          });
        }

        handleFetchCart();
      });
  };

  const handleStatus = (value: string) => {
    const status = value.split(' ')[0];
    const order_id = value.split(' ')[1];

    axios
      .put(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/order.php`, {
        order_id: order_id,
        status: status,
      })
      .then((res) => {
        console.log(res.data);
        getALlOrders();
      });
  };

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

  return (
    <div className="relative flex h-screen w-full justify-between border-2">
      <div className="relative w-full">
        <h1 className="text-[4rem] font-bold">RESTO SECTION</h1>

        <Button className="my-4" onClick={() => setShowOrders(true)}>
          SHOW ORDERS
        </Button>
        <div className="flex h-full w-full justify-between gap-2">
          <div className="grid h-fit grid-cols-3 gap-2">
            {products &&
              products.map((prod, index) => (
                <div
                  key={index}
                  className="flex h-[20rem] w-[20rem] flex-col rounded-md border-2 p-4"
                >
                  <img
                    className="h-[12rem] w-full object-cover"
                    src={prod.product_image}
                    alt={prod.product_name}
                  />
                  <div className="my-2 flex items-center justify-between">
                    <div>
                      <h1 className="font-semibold">{prod.product_name}</h1>
                      <span className="font-semibold">
                        Stocks: {prod.stocks}
                      </span>
                    </div>

                    <span
                      className={`rounded-md ${prod.availability_status === 'Available' ? 'bg-green-500' : 'bg-red-500'}  p-2 font-bold uppercase`}
                    >
                      {prod.availability_status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <h1 className="my-2 font-semibold">
                      Price: ₱ {prod.product_price}
                    </h1>

                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button>Add to cart</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ORDER DETAILS</AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="my-2 flex items-center gap-2">
                              <img
                                className="h-[8rem] w-[8rem] rounded-lg object-cover"
                                src={prod.product_image}
                                alt=""
                              />
                              <div>
                                <h1 className="text-2xl font-bold text-black">
                                  {prod.product_name}
                                </h1>

                                <p> stocks: {prod.stocks}</p>
                                <span
                                  className={`my-2 block rounded-md text-black ${prod.availability_status === 'Available' ? 'bg-green-500' : 'bg-red-500'}  p-2 font-bold uppercase`}
                                >
                                  {prod.availability_status}
                                </span>
                              </div>
                            </div>
                            <Input
                              onChange={(e) =>
                                setQuantity(parseInt(e.target.value))
                              }
                              type="number"
                              placeholder="enter quantity"
                            />
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleAddToCart(prod.product_id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex h-[80%] w-[30%] flex-col justify-between border-2 p-4">
            <div className="h-fit">
              <h1 className="my-2 text-2xl font-bold">ORDER DETAILS</h1>
              <Label className="text-md mt-2 block font-semibold">
                {' '}
                Customer name
              </Label>
              <Input onChange={(e) => setCustomerName(e.target.value)} />

              <Label className="mt-4 block text-xl font-semibold">Cart</Label>
              {productOrdersInCart.length > 0 ? (
                productOrdersInCart.map((ca, index) => (
                  <div
                    className="mb-2 flex h-[6rem] items-center justify-between border-b-2"
                    key={index}
                  >
                    <div className="flex w-full gap-2">
                      <img
                        className="h-[4rem] w-[4rem] rounded-md bg-gray-100 object-cover"
                        src={ca.product_image}
                        alt={ca.product_name}
                      />
                      <div>
                        <h1 className="font-bold">{ca.product_name}</h1>
                        <p>Qty: {ca.qty}</p>

                        <div className="flex gap-2">
                          <span
                            onClick={() =>
                              handleQuantity(
                                index,
                                ca.qty,
                                ca.cart_id,
                                'substract',
                              )
                            }
                            className="cursor-pointer text-2xl font-bold"
                          >
                            -
                          </span>

                          <Input
                            onChange={(e) =>
                              setQuantity(parseInt(e.target.value))
                            }
                            value={
                              index + 1 === quantityIndex ? quantity : ca.qty
                            }
                            className="w-[70%] border-2 bg-white text-center"
                            type="number"
                          />

                          <span
                            onClick={() =>
                              handleQuantity(index, ca.qty, ca.cart_id, 'add')
                            }
                            className="cursor-pointer text-2xl font-bold"
                          >
                            +
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex h-full flex-col items-center justify-around">
                      <span
                        onClick={() => handleDeleteCartProduct(ca.cart_id)}
                        className="cursor-pointer"
                      >
                        <AiOutlineDelete className="text-3xl text-[#38bdf8]" />
                      </span>
                      <span className="block font-bold">
                        ₱{ca.product_price * ca.qty}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-[9rem] items-center justify-center">
                  <h1 className="text-1xl font-bold">Cart is empty</h1>
                </div>
              )}
            </div>

            <div>
              <div className="flex w-full justify-between rounded-md bg-black p-4 font-bold text-white">
                <h1>Total</h1>
                <span>
                  ₱
                  {productOrdersInCart.reduce(
                    (total, prod) => total + prod.product_price * prod.qty,
                    0,
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger>
                  {' '}
                  <Button className="my-2 h-[3.5rem] text-2xl font-bold text-white">
                    Checkout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Checkout Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Confirm Products
                      <h1 className="my-2 font-semibold">
                        Customer: {customerName}
                      </h1>
                      {productOrdersInCart.length > 0 ? (
                        productOrdersInCart.map((ca, index) => (
                          <div
                            className="mb-2 flex h-[6rem] items-center justify-between border-b-2"
                            key={index}
                          >
                            <div className="flex w-full gap-2">
                              <img
                                className="h-[4rem] w-[4rem] rounded-md bg-gray-100 object-cover"
                                src={ca.product_image}
                                alt={ca.product_name}
                              />
                              <div>
                                <h1 className="font-bold">{ca.product_name}</h1>
                                <p>Qty: {ca.qty}</p>
                              </div>
                            </div>

                            <div className="flex h-full flex-col items-center justify-around">
                              <span
                                onClick={() =>
                                  handleDeleteCartProduct(ca.cart_id)
                                }
                                className="cursor-pointer"
                              >
                                <AiOutlineDelete className="text-3xl text-[#38bdf8]" />
                              </span>
                              <span className="block font-bold">
                                ₱{ca.product_price * ca.qty}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex h-[9rem] items-center justify-center">
                          <h1 className="text-1xl font-bold">Cart is empty</h1>
                        </div>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>
                      {' '}
                      <Button onClick={() => handleCheckout()}>Checkout</Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {showOrders && (
          <div className="absolute top-0 mt-[rem] flex h-full w-full flex-col items-center justify-center bg-white bg-opacity-80">
            <div className="mt-[1rem] flex w-[70%] flex-col border-2 bg-white p-4">
              <div className="my-4 flex w-full items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="my-2 font-semibold">
                    ORDERS (only display todays order)
                  </h1>

                  <Select onValueChange={handleFilterDate}>
                    <SelectTrigger className=" w-[15rem] ">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="All">All</SelectItem> */}
                      <SelectItem value="Daily">Daily</SelectItem>
                      {/* <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setShowOrders(false)}>Close</Button>
              </div>
              <Table className="mx-auto w-[100%] border-2 bg-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">ID</TableHead>
                    <TableHead className="text-center">Customer Name</TableHead>
                    <TableHead className="text-center">Amount</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>

                    <TableHead className="text-center">Date Created</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders
                      .sort((a, b) => {
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
                        return a.order_id - b.order_id;
                      })
                      .map((ord, index) => (
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
                          <TableCell className="text-center">
                            <Select onValueChange={handleStatus}>
                              <SelectTrigger className="h-[3rem]">
                                <SelectValue placeholder="Update status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={`Pending ${ord.order_id}`}>
                                  Pending
                                </SelectItem>
                                <SelectItem value={`Served ${ord.order_id}`}>
                                  Served
                                </SelectItem>
                                <SelectItem value={`Cancelled ${ord.order_id}`}>
                                  Cancel
                                </SelectItem>
                              </SelectContent>
                            </Select>
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

              <div className="my-[1rem] flex w-[95%] items-center justify-between">
                <Button>
                  <Link to="/staff/resto/expense">Create Expense</Link>
                </Button>
                <span className="block rounded-lg bg-green-500 p-4 font-semibold text-white">
                  RESTO TODAY SALES: ₱{' '}
                  {filteredOrders
                    .filter((ord) =>
                      ord.status.toLowerCase().includes('served'),
                    )
                    .reduce((acc, ord) => acc + ord.amount, 0)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
