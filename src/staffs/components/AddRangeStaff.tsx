import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { useEffect, useState } from 'react';
// import { URL } from 'url';

type Dishes = {
  dish_id: number;
  dish_name: string;
  dish_image: string;
  dish_price: number;
  availability_status: string;
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
export default function AddRangeStaff({
  setShowRangeForm,
}: {
  setShowRangeForm: (value: boolean) => void;
}) {
  const [rangeInput, setRangeInput] = useState([]);

  const { toast } = useToast();
  const [error, setError] = useState('' as string);
  const [selectedRange, setSelectedRange] = useState('' as string);
  const [selectedRangeID, setSelectedRangeID] = useState('' as string);
  const [price, setPrice] = useState(0);

  const [change, setChange] = useState(0);

  const [searchRange, setSearchRange] = useState('' as string);
  const [drivingRange, setDrivingRange] = useState<DrivingRange[]>([]);

  const getALlDrivingRange = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/driving_range.php`)
      .then((res) => {
        console.log(res.data);
        setDrivingRange(res.data);
      });
  };

  useEffect(() => {
    getALlDrivingRange();
  }, []);

  const handlerange = (value: string) => {
    // extract the range id from the value
    // range.range_number + '/' + range.range_id + ' - ' + range.price
    const rangeId = value.split(' - ')[0].split('/')[1];
    console.log(rangeId, 'sss');

    setSelectedRangeID(rangeId);
    setSelectedRange(value);

    // console.log(dishId);

    // extract price after -
    const rangePrice = value.split(' - ')[1];
    console.log(rangePrice);
    setPrice(parseInt(rangePrice));
  };

  const handleChange = (e: ChangeEvent) => {
    const value = e.target.value;
    const name = e.target.name;
    setRangeInput((values) => ({ ...values, [name]: value }));
  };

  const handleChangeAmount = (e: ChangeEvent) => {
    const value = e.target.value;
    const change = parseInt(value) - price;
    setChange(change);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log(range);

    if (!rangeInput) {
      setError('Please fill up all fields');
    }

    axios
      .post(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/order-range.php`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...rangeInput,
        range_id: selectedRangeID,
        amount: price,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          setShowRangeForm(false);
          toast({
            title: 'Dish: Added Successfully',
            description: 'Dish has been added successfully',
          });
          window.location.reload();
        }
      });
  };

  return (
    <div className="z-50 ml-[-10rem] flex h-fit w-[30%] flex-col items-center justify-center rounded-lg border-2 bg-white text-center">
      <div className="flex w-full flex-col items-center gap-[1rem] p-2">
        <form className="w-full px-4 text-start" onSubmit={handleSubmit}>
          <div className=" w-full text-start">
            <Label className="my-4 block text-2xl font-semibold">
              Driving Range Form
            </Label>

            <Select required value={selectedRange} onValueChange={handlerange}>
              <SelectTrigger className="h-[5rem]">
                <SelectValue placeholder="ranges.." />
              </SelectTrigger>
              <SelectContent>
                <Input
                  placeholder="search range"
                  onChange={(e) => setSearchRange(e.target.value)}
                />
                {drivingRange
                  .filter((range) =>
                    range.range_number.toLowerCase().includes(searchRange),
                  )
                  .map((range, index) => (
                    <SelectItem
                      key={index}
                      value={
                        range.range_number +
                        '/' +
                        range.range_id +
                        ' - ' +
                        range.price
                      }
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={range.range_image}
                          className="h-[4rem] w-[4rem]"
                          alt="pic"
                        />{' '}
                        <p className="font-bold">
                          {' '}
                          {range.range_number} - ₱ {range.price}
                        </p>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label className="mb-2 text-start">Customer Name</Label>
            <Input
              name="customer_name"
              className="mb-2"
              required
              onChange={handleChange}
            />
          </div>

          <div className="w-full">
            <Label className="mb-2 text-start">Total Price</Label>
            <Input className="mb-2" readOnly value={price > 0 ? price : ''} />
          </div>

          {/* <div className="w-full">
            <Label className="mb-2 text-start">Amount</Label>
            <Input
              name="amount"
              className="mb-2"
              required
              onChange={handleChangeAmount}
            />
          </div>

          <div className="w-full">
            <Label className="mb-2 text-start">Change</Label>
            <Input
              readOnly
              className="mb-2"
              required
              value={change > 0 ? change : ''}
            />
          </div> */}

          <span className="text-red-500">{error}</span>

          <div className="flex justify-end gap-4">
            <Button
              onClick={() => setShowRangeForm(false)}
              className="w-[40%] self-center bg-[#5a685d] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
            >
              Cancel
            </Button>
            <Button
              className="w-[40%] self-center bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
              type="submit"
            >
              Add Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
