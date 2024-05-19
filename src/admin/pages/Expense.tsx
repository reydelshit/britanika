import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
}
const Expense = () => {
  const [expenses, setExpenses] = useState<ExpensesProducts[]>([]);
  const [search, setSearch] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const getALlStocks = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/expense.php`, {
        params: {
          expenses: true,
        },
      })
      .then((res) => {
        setExpenses(res.data);
      });
  };

  useEffect(() => {
    getALlStocks();
  }, []);

  return (
    <div className="h-screen pl-[20rem]">
      <h1 className="my-4 text-[4rem] font-bold text-[#41644A]">
        EXPENSE REPORT
      </h1>

      <div className="mt-[1rem] w-full">
        <div className="my-4 flex justify-between gap-4">
          <Input
            className="w-[20rem]"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />
        </div>
        <Table className="mx-auto w-[100%] border-2 bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Department</TableHead>
              <TableHead className="text-center">Purchaser Name</TableHead>
              <TableHead className="text-center">Total Amount</TableHead>
              <TableHead className="text-center">Receipts</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length > 0 ? (
              expenses
                .filter((sto) =>
                  sto.purchaser_name
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                )
                .map((sto, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      {sto.department}
                    </TableCell>

                    <TableCell className="text-center">
                      {sto.purchaser_name}
                    </TableCell>

                    <TableCell className="text-center">{sto.total}</TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger>
                          <span className="cursor-pointer text-blue-500 underline">
                            show receipt
                          </span>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Receipt</DialogTitle>
                            <DialogDescription>
                              <img
                                src={sto.receipt_image}
                                className="h-[20rem] w-full object-cover"
                                alt="img"
                              />
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>

                    <TableCell className="text-center">
                      {moment(sto.expense_date).format('LL')}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button>
                        <Link to={`/admin/expense/${sto.expense_id}`}>
                          View Details
                        </Link>
                      </Button>
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

export default Expense;
