import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { useEffect, useState } from 'react';
// import { URL } from 'url';

type Dishes = {
  dish_id: number;
  dish_name: string;
  dish_image: string;
  dish_price: number;
  availability_status: string;
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

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;
export default function AddCartStaff({
  setShowCartForm,
}: {
  setShowCartForm: (value: boolean) => void;
}) {
  const [cartsInput, setCartsInput] = useState([]);

  const { toast } = useToast();
  const [error, setError] = useState('' as string);
  const [selectedCart, setSelectedCart] = useState('' as string);
  const [selectedCartID, setSelectedCartID] = useState('' as string);
  const [price, setPrice] = useState(0);

  const [change, setChange] = useState(0);

  const [searchCart, setSearchCart] = useState('' as string);
  const [carts, setCarts] = useState<Carts[]>([]);

  const getALlCarts = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/carts.php`)
      .then((res) => {
        setCarts(res.data);
      });
  };

  useEffect(() => {
    getALlCarts();
  }, []);

  const handleCart = (value: string) => {
    // extract the cart id from the value
    // cart.cart_number + '/' + cart.cart_id + ' - ' + cart.price
    const cartId = value.split(' - ')[0].split('/')[1];
    console.log(cartId, 'sss');

    setSelectedCartID(cartId);
    setSelectedCart(value);

    // console.log(dishId);

    // extract price after -
    const cartPrice = value.split(' - ')[1];
    console.log(cartPrice);
    setPrice(parseInt(cartPrice));
  };

  const handleChange = (e: ChangeEvent) => {
    const value = e.target.value;
    const name = e.target.name;
    setCartsInput((values) => ({ ...values, [name]: value }));
  };

  const handleChangeAmount = (e: ChangeEvent) => {
    const value = e.target.value;
    const change = parseInt(value) - price;
    setChange(change);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(carts);

    if (!cartsInput) {
      setError('Please fill up all fields');
    }

    axios
      .post(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/order-cart.php`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...cartsInput,
        cart_id: selectedCartID,
        amount: price,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          setShowCartForm(false);
          toast({
            title: 'Dish: Added Successfully',
            description: 'Dish has been added successfully',
          });
          window.location.reload();
        }
      });
  };

  return (
    <div className="z-50 ml-[-10rem] flex h-fit w-[30%] flex-col items-center justify-center rounded-lg border-2 bg-white text-center">
      <div className="flex w-full flex-col items-center gap-[1rem] p-2">
        <form className="w-full px-4 text-start" onSubmit={handleSubmit}>
          <div className=" w-full text-start">
            <Label className="my-4 block text-2xl font-semibold">
              Carts Form
            </Label>

            <Select required value={selectedCart} onValueChange={handleCart}>
              <SelectTrigger className="h-[5rem]">
                <SelectValue placeholder="Carts.." />
              </SelectTrigger>
              <SelectContent>
                <Input
                  placeholder="search cart"
                  onChange={(e) => setSearchCart(e.target.value)}
                />
                {carts
                  .filter((cart) =>
                    cart.cart_number.toLowerCase().includes(searchCart),
                  )
                  .map((cart, index) => (
                    <SelectItem
                      key={index}
                      value={
                        cart.cart_number +
                        '/' +
                        cart.cart_id +
                        ' - ' +
                        cart.price
                      }
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={cart.cart_image}
                          className="h-[4rem] w-[4rem]"
                          alt="pic"
                        />{' '}
                        <p className="font-bold">
                          {' '}
                          {cart.cart_number} - ₱ {cart.price}
                        </p>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label className="mb-2 text-start">Customer Name</Label>
            <Input
              name="customer_name"
              className="mb-2"
              required
              onChange={handleChange}
            />
          </div>

          <div className="w-full">
            <Label className="mb-2 text-start">Total Price</Label>
            <Input className="mb-2" readOnly value={price > 0 ? price : ''} />
          </div>

          <div className="w-full">
            <Label className="mb-2 text-start">Amount</Label>
            <Input
              name="amount"
              className="mb-2"
              required
              onChange={handleChangeAmount}
            />
          </div>

          <div className="w-full">
            <Label className="mb-2 text-start">Change</Label>
            <Input
              readOnly
              className="mb-2"
              required
              value={change > 0 ? change : ''}
            />
          </div>

          <span className="text-red-500">{error}</span>

          <div className="flex justify-end gap-4">
            <Button
              onClick={() => setShowCartForm(false)}
              className="w-[40%] self-center"
            >
              Cancel
            </Button>
            <Button className="w-[40%] self-center" type="submit">
              Add Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
