import { Button } from '@/components/ui/button';
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
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useReactToPrint } from 'react-to-print';

type ExpenseType = {
  expense_id: number;
  department: string;
  expense_date: string;
  receipt_image: string;
  purchaser_name: string;

  total: number;
};

interface ExpensesProducts extends ExpenseType {
  order_products_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  order_id: number;
  product_name: string;
  unit_price: number;
}
const ExpenseView = () => {
  const [expenses, setExpenses] = useState<ExpenseType>({} as ExpenseType);

  const [expensesProducts, setExpensesProducts] = useState<ExpensesProducts[]>(
    [],
  );

  const [search, setSearch] = useState('');

  const { id } = useParams<{ id: string }>();

  const getAllExpensesProduct = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/expense.php`, {
        params: {
          expense_with_products: true,
          expense_id: id,
        },
      })
      .then((res) => {
        console.log(res.data, 'sss');
        setExpensesProducts(res.data);
      });
  };
  const getAllExpense = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/expense.php`, {
        params: {
          expense_single: true,
          expense_id: id,
        },
      })
      .then((res) => {
        console.log(res.data, 'ddd');
        setExpenses(res.data[0]);
      });
  };

  useEffect(() => {
    getAllExpense();
    getAllExpensesProduct();
  }, []);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current || null,
  });

  return (
    <div ref={componentRef} className="no-margin h-screen pl-[20rem]">
      <h1 className="my-4 text-[4rem] font-bold text-[#41644A]">
        EXPENSE REPORT
      </h1>

      <div className="flex h-fit w-full items-center justify-between gap-4 text-start">
        <div className="w-[20rem]">
          <div>
            <Label className="text-[#41644A text-xl font-semibold">
              Department
            </Label>
            <Input value={expenses.department} readOnly />
          </div>

          <div>
            <Label className="text-[#41644A text-xl font-semibold">
              Customer{' '}
            </Label>
            <Input value={expenses.purchaser_name} readOnly />
          </div>

          <div>
            <Label className="text-[#41644A text-xl font-semibold">Date</Label>
            <Input
              value={moment(expenses.expense_date).format('LL')}
              readOnly
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between">
            <Label className="text-[#41644A text-xl font-semibold">
              Products
            </Label>

            <Dialog>
              <DialogTrigger>
                <Button className="no-print my-2 bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]">
                  show receipt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Receipt</DialogTitle>
                  <DialogDescription>
                    <img
                      src={expenses.receipt_image}
                      className="h-[20rem] w-full object-cover"
                      alt="img"
                    />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <Table className="mx-auto w-[100%] border-2 bg-white">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Product Name</TableHead>
                <TableHead className="text-center">Unit Price</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Total Amount</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expensesProducts.length > 0 ? (
                expensesProducts.map((sto, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      {sto.product_name}
                    </TableCell>

                    <TableCell className="text-center">
                      ₱{sto.unit_price}
                    </TableCell>

                    <TableCell className="text-center">
                      {sto.quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      ₱{sto.unit_price * sto.quantity}
                    </TableCell>

                    <TableCell className="text-center">
                      {moment(sto.expense_date).format('LL')}
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
      <div className="mx-[4rem] mt-[2rem] flex items-center justify-end gap-4">
        <div>
          <Label className="bg-[#41644A] p-4 text-xl font-semibold text-white">
            Total Amount: ₱ {expenses.total}
          </Label>
        </div>

        <Button
          onClick={handlePrint}
          className="no-print h-[3.6rem] w-[8rem] bg-[#41644A] text-xl font-semibold text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
        >
          Export
        </Button>
      </div>
    </div>
  );
};

export default ExpenseView;
