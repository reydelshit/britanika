import React, { useEffect, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import moment from 'moment';

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

const Stocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  const getALlStocks = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/stocks.php`)
      .then((res) => {
        setStocks(res.data);
      });
  };

  useEffect(() => {
    getALlStocks();
  }, []);

  return (
    <div className="h-screen pl-[20rem]">
      <h1 className="my-4 text-[4rem] font-bold text-[#41644A]">STOCKS</h1>

      <div className="mt-[1rem] w-full">
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
              stocks.map((sto, index) => (
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
