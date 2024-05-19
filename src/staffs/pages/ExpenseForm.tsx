import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Orders = {
  order_id: number;
  order_customer_name: string;
  amount: number;
  created_at: string;
  status: string;

  product_name: string;
  product_price: number;
  quantity: number;
};

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

type ProductAdded = {
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

type Product = {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  availability_status: string;
  stocks: number;
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

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

const ExpenseForm = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [drivingRange, setDrivingRange] = useState<DrivingRange[]>([]);

  const [allOrders, setAllOrders] = useState<Orders[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<ProductAdded[]>(
    [],
  );
  const [quantity, setQuantity] = useState(0);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [purchaserName, setPurchaserName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('' as string);
  const [expenseData, setExpenseData] = useState([]);

  const { toast } = useToast();
  const dailyFilter = 'Daily' as
    | string
    | 'Weekly'
    | 'Monthly'
    | 'Yearly'
    | 'All';

  const getALlProducts = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/product.php`)
      .then((res) => {
        setProduct(res.data);
      });
  };

  const getALlOrders = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/expense.php`)
      .then((res) => {
        setAllOrders(res.data);
        console.log(res.data);
      });
  };

  const getALlranges = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/driving_range.php`)
      .then((res) => {
        setDrivingRange(res.data);
      });
  };

  useEffect(() => {
    Promise.all([getALlProducts(), getALlOrders(), getALlranges()]);
  }, []);

  const handleSubmitProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productName || !quantity || !price) return;

    setPurchasedProducts([
      ...purchasedProducts,
      { productName, quantity, price, total: quantity * price },
    ]);

    setTotal(total + quantity * price);
    console.log(purchasedProducts);

    setProductName('');
    setQuantity(0);
    setPrice(0);
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setImage(base64.toString());

        // console.log(base64.toString());
      }
    };
  };

  const handleChangeDepartment = (value: string) => {
    console.log(value);
    setDepartment(value);
  };

  const handleSelectProduct = (value: string) => {
    const productName = value.split('-')[0];
    const productPrice = parseInt(value.split('-')[1].split('/')[1]);

    setProductName(productName);
    setPrice(productPrice);
  };

  const handleSelectRange = (value: string) => {
    const productName = value.split('-')[0];
    const productPrice = parseInt(value.split('-')[1].split('/')[1]);

    setProductName(productName);
    setPrice(productPrice);
  };

  const handleChange = (e: ChangeEvent) => {
    const value = e.target.value;
    const name = e.target.name;
    setExpenseData((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !purchaserName ||
      !image ||
      purchasedProducts.length === 0 ||
      !department
    ) {
      setError('Please fill in all fields');
      return;
    }

    console.log(purchasedProducts);

    axios
      .post(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/expense.php`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...expenseData,
        department: department,
        receipt_image: image,
        purchaser_name: purchaserName,
        purchasedProducts,
        total: purchasedProducts.reduce((acc, ord) => acc + ord.total, 0),
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          window.location.reload();

          toast({
            title: 'Expense: Submitted Successfully',
            description: 'Expense has been added successfully',
          });
        }
      });
  };

  return (
    <div className="flex h-screen w-full flex-col items-center pl-[20rem]">
      <div className="my-4 w-full text-start">
        <h1 className="my-4 text-[4rem] font-bold text-[#41644A]">
          EXPENSE FORM
        </h1>
      </div>
      <div className="w-[40%]">
        <Label>Purchase Date</Label>
        <Input onChange={handleChange} type="date" name="expense_date" />

        <Label>Department</Label>
        <Select onValueChange={handleChangeDepartment}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Resto">Resto</SelectItem>
            <SelectItem value="Driving Range">Driving Range</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <form onSubmit={handleSubmitProduct}>
            {department === 'Resto' ? (
              <>
                <Label>Product Name</Label>

                <Select onValueChange={handleSelectProduct}>
                  <SelectTrigger className="h-fit w-full">
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.map((prod, index) => (
                      <SelectItem
                        key={index}
                        value={
                          prod.product_name +
                          '-' +
                          prod.product_id +
                          '/' +
                          prod.product_price
                        }
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={prod.product_image}
                            alt="img"
                            className="h-[3rem] w-[4rem] object-cover"
                          />
                          <h1 className="font-bold"> {prod.product_name}</h1>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <>
                <Label>Cart Name</Label>

                <Select onValueChange={handleSelectRange}>
                  <SelectTrigger className="h-fit w-full">
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivingRange.map((range, index) => (
                      <SelectItem
                        key={index}
                        value={
                          range.range_number +
                          '-' +
                          range.range_id +
                          '/' +
                          range.price
                        }
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={range.range_image}
                            alt="img"
                            className="h-[3rem] w-[4rem] object-cover"
                          />
                          <h1> {range.range_number}</h1>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            <Label>Price</Label>
            <Input
              value={price}
              type="number"
              onChange={(e) => setPrice(parseInt(e.target.value))}
              name="price"
            />

            <Label>Quantity</Label>
            <Input
              value={quantity}
              type="number"
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              name="quantity"
            />

            <div className="my-4 flex justify-end">
              <Button
                className="bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
                type="submit"
              >
                Add Product
              </Button>
            </div>
          </form>
          <h1>Purchases</h1>

          <div className="flex w-full items-center justify-center">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchasedProducts.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item.quantity}
                    </TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>₱{item.price}</TableCell>
                    <TableCell className="text-right">
                      ₱{item.price * item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() =>
                          setPurchasedProducts(
                            purchasedProducts.filter((_, i) => i !== index),
                          )
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex w-full justify-end">
            <span className="my-4 block rounded-lg bg-[#41644A]  p-2 font-semibold text-white">
              Total: ₱{' '}
              {purchasedProducts.reduce((acc, ord) => acc + ord.total, 0)}
            </span>
          </div>
        </div>

        <Label className="mb-2 text-start">Attach File for Receipt</Label>

        <Input
          type="file"
          accept="image/*"
          onChange={handleChangeImage}
          className="cursor-pointer"
          required
        />

        <Label className="mb-2 text-start">Name of the purchaser</Label>

        <Input
          onChange={(e) => setPurchaserName(e.target.value)}
          type="text"
          name="purchaser_name"
          className="mb-2"
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex w-full justify-end">
          <Button
            className="bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
