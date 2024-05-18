import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Addproduct from './components/AddProduct';

type productes = {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  availability_status: string;
};

const Admin = () => {
  const [product, setProduct] = useState<productes[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);

  const getALlProducts = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/product.php`)
      .then((res) => {
        setProduct(res.data);
      });
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/product.php`, {
        data: {
          product_id: id,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          getALlProducts();
        }
      });
  };

  const handleChangeStatus = (id: number, availability: string) => {
    axios
      .put(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/product.php`, {
        product_id: id,
        availability_status:
          availability === 'Available' ? 'Not Available' : 'Available',
      })
      .then((res) => {
        console.log(res.data);
        getALlProducts();
      });
  };

  useEffect(() => {
    getALlProducts();
  }, []);

  return (
    <div className="w-full">
      {showProductForm && (
        <div className="absolute flex h-full w-full items-center justify-center bg-white bg-opacity-80">
          <Addproduct setShowProductForm={setShowProductForm} />
        </div>
      )}
      <div>
        <h1 className="text-[4rem] font-bold">AVAILABLE productES</h1>

        <div className="grid grid-cols-4 gap-4">
          {product &&
            product.map((prod, index) => (
              <div
                key={index}
                className="flex  w-[20rem] flex-col rounded-md border-2 p-4"
              >
                <img
                  className="h-[12rem] w-full object-cover"
                  src={prod.product_image}
                  alt={prod.product_name}
                />
                <div className="my-2 flex items-center justify-between">
                  <h1 className="my-2 font-semibold">{prod.product_name}</h1>

                  <span
                    className={`rounded-md ${prod.availability_status === 'Available' ? 'bg-green-500' : 'bg-red-500'}  p-2 font-bold uppercase`}
                  >
                    {prod.availability_status}
                  </span>
                </div>
                <h1 className="my-2 font-semibold">
                  Price: ₱{prod.product_price}
                </h1>
                <div className="flex w-full justify-between gap-2">
                  <Button
                    onClick={() =>
                      handleChangeStatus(
                        prod.product_id,
                        prod.availability_status,
                      )
                    }
                    className="uppercase"
                  >
                    SET{' '}
                    {prod.availability_status === 'Available'
                      ? 'Not Available'
                      : 'Available'}
                  </Button>
                  <Button onClick={() => handleDelete(prod.product_id)}>
                    DELETE
                  </Button>
                </div>
              </div>
            ))}

          <div
            onClick={() => setShowProductForm(true)}
            className="border- flex w-[20rem] cursor-pointer flex-col items-center justify-center rounded-md border-2 p-4 text-[5rem] font-bold hover:bg-yellow-50"
          >
            +
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
