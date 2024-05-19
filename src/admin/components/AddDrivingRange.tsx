import Lgo from '@/assets/prod.jpg';
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
import { useState } from 'react';
// import { URL } from 'url';

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;
export default function AddDrivingRange({
  setShowRangeForm,
}: {
  setShowRangeForm: (value: boolean) => void;
}) {
  const [range, setRange] = useState([]);
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState('' as string);
  const [price, setPrice] = useState(0);
  const [selectedAvailability, setSelectedAvailability] = useState(
    '' as string,
  );

  const handleAvailability = (value: string) => {
    setSelectedAvailability(value);
  };

  const handleChange = (e: ChangeEvent) => {
    const value = e.target.value;
    const name = e.target.name;
    setRange((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      setError('Please fill in all fields');
      return;
    }

    console.log(range);

    axios
      .post(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/driving_range.php`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...range,
        range_image: image,
        availability_status: selectedAvailability,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          window.location.reload();
          setShowRangeForm(false);
          toast({
            title: 'Dish: Added Successfully',
            description: 'Dish has been added successfully',
          });
        }
      });
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

  return (
    <div className="ml-[-15rem] flex h-fit w-[30%] flex-col items-center justify-center border-2 bg-white text-center">
      <div className="flex w-full flex-col items-center gap-[1rem] p-2">
        <div className="flex w-full flex-col px-4">
          <img
            className="mb-4  h-[20rem] w-full rounded-lg object-cover"
            src={image! ? image! : Lgo}
          />
          <Label className="mb-2 text-start">Range image</Label>

          <Input
            type="file"
            accept="image/*"
            onChange={handleChangeImage}
            className="cursor-pointer"
            required
          />
        </div>

        <form className="w-full px-4 text-start" onSubmit={handleSubmit}>
          <div className="w-full">
            <Label className="mb-2 text-start">Range Number</Label>
            <Input
              name="range_number"
              className="mb-2"
              required
              onChange={handleChange}
            />
          </div>
          <div className="item-start flex flex-col ">
            <Label className="mb-2 text-start">Color</Label>
            <Input
              type="text"
              name="color"
              className="mb-2"
              onChange={handleChange}
            />
          </div>

          <div className="item-start flex flex-col ">
            <Label className="mb-2 text-start">Type</Label>
            <Input
              type="text"
              name="type"
              className="mb-2"
              onChange={handleChange}
            />
          </div>

          <div className="item-start flex flex-col ">
            <Label className="mb-2 text-start">Price</Label>
            <Input
              type="number"
              name="price"
              className="mb-2"
              onChange={handleChange}
            />
          </div>

          <div className="mb-[2rem] w-full text-start">
            <Label className="mb-2">Availability</Label>

            <Select
              required
              value={selectedAvailability}
              onValueChange={handleAvailability}
            >
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Not Available">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-red-500">{error}</span>

          <div className="flex justify-end gap-4">
            <Button
              onClick={() => setShowRangeForm(false)}
              className="w-[40%] self-center bg-[#636660] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
            >
              Cancel
            </Button>
            <Button
              className="w-[40%] self-center bg-[#41644A] text-white hover:border-2 hover:border-[#41644A] hover:bg-white hover:text-[#41644A]"
              type="submit"
            >
              Add Range
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
