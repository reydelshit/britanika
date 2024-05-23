import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Addproduct from './components/AddProduct';

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

type Product = {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  availability_status: string;
  stocks: number;
  stock_limit: number;
};

const Admin = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const [stockLimit, setStockLimit] = useState('');
  const { toast } = useToast();

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

  const handleAddStock = (id: number, type: string) => {
    if (quantity.length === 0) return setError('Please fill in all fields');

    console.log(quantity, id);
    axios
      .put(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/stocks.php`, {
        product_id: id,
        stocks: quantity,
        type: type,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          toast({
            title: 'Stock Added Successfully',
            description: 'Stock has been added successfully',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Failed to Add Stock',
            description: 'Failed to add stock',
          });
        }
        getALlProducts();
      });
  };

  const handleeUpdateLimit = (id: number) => {
    if (stockLimit.length === 0) return setError('Please fill in all fields');

    console.log(stockLimit, id);
    axios
      .put(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/stock-limit.php`, {
        product_id: id,
        stock_limit: stockLimit,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          toast({
            title: 'Stock Limit Updated Successfully',
            description: 'Stock limit has been updated successfully',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Failed to Update Stock Limit',
            description: 'Failed to update stock limit',
          });
        }

        getALlProducts();
      });
  };

  return (
    <div className="h-screen w-full pl-[20rem]">
      {showProductForm && (
        <div className="absolute flex h-full w-full items-center justify-center bg-white bg-opacity-80">
          <Addproduct setShowProductForm={setShowProductForm} />
        </div>
      )}
      <div className="h-full">
        <h1 className="my-4 text-[4rem] font-bold text-[#41644A]">PRODUCTS</h1>

        <div className="grid grid-cols-4 gap-4">
          {product &&
            product.map((prod, index) => (
              <div
                key={index}
                className="flex w-[20rem] flex-col rounded-xl border-2  p-2 text-black"
              >
                <div className="flex w-full justify-between">
                  <Dialog>
                    <DialogTrigger className="my-1 w-[8rem] self-end">
                      {' '}
                      <Button className="bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]">
                        Stock Limit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-opacity-65">
                      <DialogHeader>
                        <DialogTitle>Enter Stock Limit</DialogTitle>
                        <DialogDescription>
                          <h1 className="rounded-md bg-[#41644A] p-2 text-white">
                            Current Stock Limit: {prod.stock_limit}
                          </h1>
                          <Input
                            onChange={(e) =>
                              setStockLimit(String(e.target.value))
                            }
                            className="my-2"
                            type="number"
                            placeholder="Enter Stock Limit"
                          />

                          {error && <p className="text-red-500">{error}</p>}

                          <div className="flex w-full justify-end">
                            <Button
                              disabled={stockLimit.length === 0 ? true : false}
                              type="submit"
                              onClick={() =>
                                handleeUpdateLimit(prod.product_id)
                              }
                              className="my-4 "
                            >
                              Submit
                            </Button>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger className="my-1 w-[8rem] self-end">
                      {' '}
                      <Button className="bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]">
                        Add Stock
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-opacity-65">
                      <DialogHeader>
                        <DialogTitle>Add Stock</DialogTitle>
                        <DialogDescription>
                          <h1 className="rounded-md bg-[#41644A] p-2 text-white">
                            Current Stock: {prod.stocks}
                          </h1>
                          <Input
                            onChange={(e) =>
                              setQuantity(String(e.target.value))
                            }
                            className="my-2"
                            type="number"
                            placeholder="Enter Stock"
                          />

                          {error && <p className="text-red-500">{error}</p>}

                          <div className="flex w-full justify-end">
                            <Button
                              disabled={quantity.length === 0 ? true : false}
                              type="submit"
                              onClick={() =>
                                handleAddStock(prod.product_id, 'In')
                              }
                              className="my-4 "
                            >
                              Submit
                            </Button>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>

                <img
                  className="h-[12rem] w-full object-cover"
                  src={prod.product_image}
                  alt={prod.product_name}
                />
                <div className="my-2 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h1 className="font-semibold">{prod.product_name}</h1>
                    <h1
                      className={`rounded-md p-1 font-semibold ${prod.stock_limit > prod.stocks ? 'border-b-4 border-red-500' : 'border-b-4 border-green-500'}`}
                    >
                      Stock: {prod.stocks}
                    </h1>
                  </div>

                  <span
                    className={`rounded-md text-white ${prod.availability_status === 'Available' ? 'bg-green-500' : 'bg-red-500'}  p-2 font-bold uppercase`}
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
                    className="bg-[#41644A] uppercase text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
                  >
                    SET{' '}
                    {prod.availability_status === 'Available'
                      ? 'Not Available'
                      : 'Available'}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button className="bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]">
                        DELETE
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete and remove the data from the servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(prod.product_id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}

          <div
            onClick={() => setShowProductForm(true)}
            className="border- flex w-[20rem] cursor-pointer flex-col items-center justify-center rounded-md border-2 p-4 text-[5rem] font-bold hover:bg-[#41644A] hover:text-white"
          >
            +
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
