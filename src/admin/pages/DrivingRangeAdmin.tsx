import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AddCart from '../components/AddDrivingRange';
import AddDrivingRange from '../components/AddDrivingRange';

type OrderDriving = {
  order_range_id: string;
  customer_name: string;
  range_id: string;
  amount: number;
  created_at: Date;
  range_number: string;
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

const DrivingRangeAdmin = () => {
  const [showCartForm, setShowCartForm] = useState(false);

  const [drivingOrder, setDrivingOrders] = useState<OrderDriving[]>([]);

  const [drivingRange, setDrivingRange] = useState<DrivingRange[]>([]);
  const [showRangeForm, setShowRangeForm] = useState(false);

  const getALlranges = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/driving_range.php`)
      .then((res) => {
        setDrivingRange(res.data);
      });
  };

  useEffect(() => {
    getALlranges();
  }, []);

  const handleDelete = (id: number) => {
    axios
      .delete(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/carts.php`, {
        data: {
          cart_id: id,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          getALlranges();
        }
      });
  };

  const handleChangeStatus = (id: number, availability: string) => {
    axios
      .put(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/carts.php`, {
        cart_id: id,
        availability_status:
          availability === 'Available' ? 'Not Available' : 'Available',
      })
      .then((res) => {
        console.log(res.data);
        getALlranges();
      });
  };

  useEffect(() => {
    getALlranges();
  }, []);

  return (
    <div className="w-full">
      {showRangeForm && (
        <div className="absolute flex h-full w-full items-center justify-center bg-white bg-opacity-80">
          <AddDrivingRange setShowRangeForm={setShowRangeForm} />
        </div>
      )}
      <div>
        <h1 className="text-[4rem] font-bold">CARTS</h1>

        <div className="grid grid-cols-4 gap-4">
          {drivingRange &&
            drivingRange.map((range, index) => (
              <div
                key={index}
                className="flex  w-[20rem] flex-col rounded-md border-2 p-4"
              >
                <img
                  className="h-[12rem] w-full object-cover"
                  src={range.range_image}
                  alt={range.range_number}
                />
                <div className="my-2 flex items-center justify-between">
                  <h1 className="my-2 font-semibold">{range.range_number}</h1>

                  <span
                    className={`rounded-md ${range.availability_status === 'Available' ? 'bg-green-500' : 'bg-red-500'}  p-2 font-bold uppercase`}
                  >
                    {range.availability_status}
                  </span>
                </div>
                <h1 className="my-2 font-semibold">Price: ₱{range.price}</h1>
                <div className="flex w-full justify-between gap-2">
                  <Button
                    onClick={() =>
                      handleChangeStatus(
                        range.range_id,
                        range.availability_status,
                      )
                    }
                    className="uppercase"
                  >
                    SET{' '}
                    {range.availability_status === 'Available'
                      ? 'Not Available'
                      : 'Available'}
                  </Button>
                  <Button onClick={() => handleDelete(range.range_id)}>
                    DELETE
                  </Button>
                </div>
              </div>
            ))}

          <div
            onClick={() => setShowRangeForm(true)}
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

export default DrivingRangeAdmin;
