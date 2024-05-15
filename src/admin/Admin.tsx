import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AddDish from './components/AddDish';

type Dishes = {
  dish_id: number;
  dish_name: string;
  dish_image: string;
  dish_price: number;
  availability_status: string;
};

const Admin = () => {
  const [dishes, setDishes] = useState<Dishes[]>([]);
  const [showDishForm, setShowDishForm] = useState(false);

  const getALlDishes = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/dish.php`)
      .then((res) => {
        setDishes(res.data);
      });
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/dish.php`, {
        data: {
          dish_id: id,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          getALlDishes();
        }
      });
  };

  const handleChangeStatus = (id: number, availability: string) => {
    axios
      .put(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/dish.php`, {
        dish_id: id,
        availability_status:
          availability === 'Available' ? 'Not Available' : 'Available',
      })
      .then((res) => {
        console.log(res.data);
        getALlDishes();
      });
  };

  useEffect(() => {
    getALlDishes();
  }, []);

  return (
    <div className="w-full">
      {showDishForm && (
        <div className="absolute flex h-full w-full items-center justify-center bg-white bg-opacity-80">
          <AddDish setShowDishForm={setShowDishForm} />
        </div>
      )}
      <div>
        <h1 className="text-[4rem] font-bold">AVAILABLE DISHES</h1>

        <div className="grid grid-cols-4 gap-4">
          {dishes &&
            dishes.map((dish, index) => (
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
                  Price: ₱{dish.dish_price}
                </h1>
                <div className="flex w-full justify-between gap-2">
                  <Button
                    onClick={() =>
                      handleChangeStatus(dish.dish_id, dish.availability_status)
                    }
                    className="uppercase"
                  >
                    SET{' '}
                    {dish.availability_status === 'Available'
                      ? 'Not Available'
                      : 'Available'}
                  </Button>
                  <Button onClick={() => handleDelete(dish.dish_id)}>
                    DELETE
                  </Button>
                </div>
              </div>
            ))}

          <div
            onClick={() => setShowDishForm(true)}
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

export default Admin;
