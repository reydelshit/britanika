import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AddCart from '../components/AddCart';

type Carts = {
  cart_id: number;
  cart_number: string;
  type: string;
  color: string;
  cart_image: string;
  price: number;
  availability_status: string;
};
const Carts = () => {
  const [carts, setCarts] = useState<Carts[]>([]);
  const [showCartForm, setShowCartForm] = useState(false);

  const getALlCarts = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/carts.php`)
      .then((res) => {
        setCarts(res.data);
      });
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/carts.php`, {
        data: {
          dish_id: id,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          getALlCarts();
        }
      });
  };

  useEffect(() => {
    getALlCarts();
  }, []);

  return (
    <div className="w-full">
      {showCartForm && (
        <div className="absolute flex h-full w-full items-center justify-center bg-white bg-opacity-80">
          <AddCart setShowCartForm={setShowCartForm} />
        </div>
      )}
      <div>
        <h1 className="text-[4rem] font-bold">CARTS</h1>

        <div className="grid grid-cols-4 gap-4">
          {carts &&
            carts.map((cart, index) => (
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
                <h1 className="my-2 font-semibold">Price: {cart.price}</h1>
                <div className="flex w-full justify-between gap-2">
                  <Button className="uppercase">
                    SET{' '}
                    {cart.availability_status === 'Available'
                      ? 'Not Available'
                      : 'Available'}
                  </Button>
                  <Button onClick={() => handleDelete(cart.cart_id)}>
                    DELETE
                  </Button>
                </div>
              </div>
            ))}

          <div
            onClick={() => setShowCartForm(true)}
            className="flex w-[20rem] cursor-pointer flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-yellow-50"
          >
            <img
              className="w-full object-cover"
              src="https://cdn-icons-png.freepik.com/512/1828/1828925.png"
              alt="burger"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carts;
