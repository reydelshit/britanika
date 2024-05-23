import React, { useEffect, useState } from 'react';
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import axios from 'axios';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

type Stock = {
  stock_id: number;
  stock_type: string;
  product_id: number;
  product_name: string;
  quantity: number;
  created_at: string;
  stocks: number;
  product_image: string;
};

type Product = {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  availability_status: string;
  stocks: number;
};

const Stocks = () => {
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStockFilter, setSelectedStockFilter] = useState('All');
  const [product, setProduct] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const getALlProducts = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/product.php`)
      .then((res) => {
        setProduct(res.data);
      });
  };

  const getALlStocks = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/stocks.php`)
      .then((res) => {
        setStocks(res.data);
      });
  };

  useEffect(() => {
    getALlStocks();
    getALlProducts();
  }, []);

  const handleFilterStocks = (value: string) => {
    setSelectedStockFilter(value);
  };

  const handleSelectProduct = (value: string) => {
    // extract the product id from the value and set it to selected product
    const productId = value.split('-')[1];
    setSelectedProduct(productId);
  };

  const handleStock = (type: string) => {
    if (quantity === 0) return setError('Please fill in all fields');

    console.log(quantity);
    axios
      .put(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/stocks.php`, {
        product_id: selectedProduct,
        stocks: quantity,
        type: type,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          toast({
            title: `Stock  ${type} Successfully`,
            description: `Stock ${type} has been added successfully`,
          });
        } else {
          toast({
            variant: 'destructive',
            title: `Failed Stock  ${type} Successfully`,
            description: `Failed Stock ${type} has been added successfully`,
          });
        }
        setOpen(false);
        getALlStocks();
        getALlProducts();
      });
  };
  return (
    <div className="h-screen pl-[20rem]">
      <h1 className="my-4 text-[4rem] font-bold text-[#41644A]">
        STOCKS HISTORY
      </h1>

      <div className="mt-[1rem] w-full">
        <div className="my-4 flex justify-between gap-4 px-4">
          <div className="my-4 flex ">
            <Dialog>
              <DialogTrigger className="w-[8rem] self-end">
                {' '}
                <Button className="bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]">
                  Stock In
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-opacity-65">
                <DialogHeader>
                  <DialogTitle className="my-4">Stock In</DialogTitle>
                  <DialogDescription>
                    <Select onValueChange={handleSelectProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Products" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.map((prod, index) => (
                          <SelectItem
                            key={index}
                            value={prod.product_name + '-' + prod.product_id}
                          >
                            {prod.product_name} - {prod.stocks}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="my-2"
                      type="number"
                      placeholder="Enter Stock"
                    />

                    {error && <p className="text-red-500">{error}</p>}

                    <DialogTrigger>
                      <div className="flex w-full justify-end">
                        <Button
                          disabled={quantity === 0}
                          type="submit"
                          onClick={() => handleStock('In')}
                          className="my-4 "
                        >
                          Submit
                        </Button>
                      </div>
                    </DialogTrigger>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger className="w-[8rem] self-end">
                {' '}
                <Button className="bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]">
                  Stock Out
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-opacity-65">
                <DialogHeader>
                  <DialogTitle className="my-4">Stock Out</DialogTitle>
                  <DialogDescription>
                    <Select onValueChange={handleSelectProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Products" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.map((prod, index) => (
                          <SelectItem
                            key={index}
                            value={prod.product_name + '-' + prod.product_id}
                          >
                            {prod.product_name} - {prod.stocks}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="my-2"
                      type="number"
                      placeholder="Enter Stock"
                    />

                    {error && <p className="text-red-500">{error}</p>}

                    <DialogTrigger>
                      <div className="flex w-full justify-end">
                        <Button
                          disabled={quantity === 0}
                          type="submit"
                          onClick={() => handleStock('Out')}
                          className="my-4 "
                        >
                          Submit
                        </Button>
                      </div>
                    </DialogTrigger>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <Select onValueChange={handleFilterStocks}>
            <SelectTrigger className=" w-[15rem] ">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Stock In">Stock In</SelectItem>
              <SelectItem value="Stock Out">Stock Out</SelectItem>
              <SelectItem value="Initial Stock">Initial Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table className="mx-auto w-[100%] border-2 bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center"></TableHead>
              <TableHead className="text-center">Product</TableHead>
              {/* <TableHead className="text-center">Type</TableHead> */}

              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Current Stocks</TableHead>

              <TableHead className="text-center">Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.length > 0 ? (
              stocks
                .filter(
                  (sto) =>
                    sto.stock_type
                      .toLowerCase()
                      .includes(selectedStockFilter.toLowerCase()) ||
                    selectedStockFilter === 'All',
                )
                .map((sto, index) => (
                  <TableRow key={index}>
                    <TableCell className="flex items-center justify-center text-center">
                      <img
                        className="h-[4rem] w-[4rem] rounded-lg"
                        src={sto.product_image}
                        alt="image"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {sto.product_name}
                    </TableCell>

                    {/* <TableCell className="text-center">
                    {sto.stock_type}
                  </TableCell> */}
                    <TableCell className="text-center">
                      {sto.stock_type} - {sto.quantity}
                    </TableCell>

                    <TableCell className="text-center">{sto.stocks}</TableCell>

                    <TableCell className="text-center">
                      {moment(sto.created_at).format('LL')}
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
  );
};

export default Stocks;
