import Lgo from '@/assets/react.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import { URL } from 'url';

type Dishes = {
  dish_id: number;
  dish_name: string;
  dish_image: string;
  dish_price: number;
  availability_status: string;
};

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;
export default function AddOrder({
  setShowOrderForm,
}: {
  setShowOrderForm: (value: boolean) => void;
}) {
  const [orders, setOrders] = useState([]);
  const { toast } = useToast();
  const [error, setError] = useState('' as string);
  const [selectedDish, setSelectedDish] = useState('' as string);
  const [selectedDishID, setSelectedDishID] = useState('' as string);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [change, setChange] = useState(0);

  const [searchDish, setSearchDish] = useState('' as string);
  const [dishes, setDishes] = useState<Dishes[]>([]);

  const getALlDishes = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/dish.php`)
      .then((res) => {
        setDishes(res.data);
      });
  };

  useEffect(() => {
    getALlDishes();
  }, []);

  const handleDish = (value: string) => {
    // extract number from string
    const dishId = value.match(/\d+/g);
    console.log(dishId ? dishId[0] : '');
    setSelectedDishID(dishId ? dishId[0] : '');
    setSelectedDish(value);

    // extract price after -
    const dishPrice = value.split(' - ')[1];
    console.log(dishPrice);
    setPrice(parseInt(dishPrice));
  };

  const handleChange = (e: ChangeEvent) => {
    const value = e.target.value;
    const name = e.target.name;
    setOrders((values) => ({ ...values, [name]: value }));
  };

  const handleChangeQuanity = (e: ChangeEvent) => {
    const value = e.target.value;
    setQuantity(parseInt(value));

    console.log(price);

    console.log(parseInt(price.toString()) * parseInt(value));

    setTotalPrice(price * parseInt(value));
  };

  const handleChangeAmount = (e: ChangeEvent) => {
    const value = e.target.value;
    const change = parseInt(value) - totalPrice;
    setChange(change);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(orders);

    axios
      .post(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/orders.php`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...orders,
        dish_id: selectedDishID,
        amount: price * quantity,
        quantity: quantity,
        status: 'Pending',
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          window.location.reload();
          setShowOrderForm(false);
          toast({
            title: 'Dish: Added Successfully',
            description: 'Dish has been added successfully',
          });
        }
      });
  };

  return (
    <div className="z-50 ml-[-10rem] flex h-fit w-[30%] flex-col items-center justify-center border-2 bg-white text-center">
      <div className="flex w-full flex-col items-center gap-[1rem] p-2">
        <form className="w-full px-4 text-start" onSubmit={handleSubmit}>
          <div className=" w-full text-start">
            <Label className="mb-2">Dishes</Label>

            <Select required value={selectedDish} onValueChange={handleDish}>
              <SelectTrigger className="h-[5rem]">
                <SelectValue placeholder="Dishes" />
              </SelectTrigger>
              <SelectContent>
                <Input
                  placeholder="search dish"
                  onChange={(e) => setSearchDish(e.target.value)}
                />
                {dishes
                  .filter((dish) => dish.dish_name.includes(searchDish))
                  .map((dish, index) => (
                    <SelectItem
                      key={index}
                      value={
                        dish.dish_name + dish.dish_id + ' - ' + dish.dish_price
                      }
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={dish.dish_image}
                          className="h-[4rem] w-[4rem]"
                          alt="pic"
                        />{' '}
                        <p className="font-bold">
                          {' '}
                          {dish.dish_name} - ₱ {dish.dish_price}
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
              name="order_customer_name"
              className="mb-2"
              required
              onChange={handleChange}
            />
          </div>

          <div className="w-full">
            <Label className="mb-2 text-start">Quanity</Label>
            <Input
              type="number"
              name="quantity"
              className="mb-2"
              required
              onChange={handleChangeQuanity}
            />
          </div>
          <div className="w-full">
            <Label className="mb-2 text-start">Total Price</Label>
            <Input
              className="mb-2"
              readOnly
              value={totalPrice > 0 ? totalPrice : ''}
            />
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
              onClick={() => setShowOrderForm(false)}
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
