import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
type LocationType = {
  barangay_name: string;
  created_at: string;
  location_id: number;
};

type accountantType = {
  user_id: number;
  account_type: string;
  username: string;
  password: string;
  created_at: string;
};

const Accountants = () => {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [barangay, setBarangay] = useState('');
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const user_id = localStorage.getItem('ordering-token');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('' as string);
  const { toast } = useToast();
  const [accountant, setaccountant] = useState<accountantType[]>([]);
  const [showReauth, setShowReauth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [showPasswordIndex, setShowPasswordIndex] = useState(-1);
  const reauthToken = localStorage.getItem('ordering_reauth') as string;
  const getPasswordDisplay = (
    stringText: string,
    index: number,
    show: boolean,
  ) => {
    return show ? stringText : '*'.repeat(stringText.length);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    console.log(name, value);

    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(user);
    console.log(barangay);
    if (user.username.length == 0 || user.password.length == 0) {
      setError('Please fill in all fields');
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/accountant.php`, {
        ...user,
        account_type: 'accountants',
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          toast({
            title: 'Accountant: Registered Successfully',
            description: 'You can now login to your account',
          });

          getUserData();

          setUser({
            username: '',
            password: '',
          });
        }
      });
  };

  const getUserData = () => {
    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/accountant.php`, {
        params: { accountants: true },
      })
      .then((response) => {
        console.log(response.data, 'accountant');
        setaccountant(response.data);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const reAuthenticate = () => {
    if (reauthToken === '0') {
      setShowReauth(true);
    } else {
      setShowPassword(true);
    }
  };

  const handleReauth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(user_id, password);

    axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/reauth.php`, {
        params: { user_id: user_id, password: password },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.length > 0) {
          localStorage.setItem('ordering_reauth', '1');

          window.location.reload();

          setShowReauth(false);
        } else {
          setShowPassword(false);
          setErrors('Invalid password');
        }
      });
  };

  const handleDelete = (id: number) => {
    console.log(id);
    axios
      .delete(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/accountant.php`, {
        data: { user_id: id },
      })
      .then((res) => {
        console.log(res.data);
        getUserData();
      });
  };

  return (
    <div className="h-screen ">
      <h1 className="text-[4rem] font-bold">ACCOUNTANTS</h1>

      {showReauth && (
        <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <div className="w-[30rem] rounded-lg bg-white p-4">
            <form onSubmit={handleReauth} className="w-full">
              <h1 className="mb-4 text-center text-2xl font-bold">
                Re-Authenticate
              </h1>
              <Input
                type="password"
                placeholder="Enter password"
                className="mb-2"
                onChange={(e) => setPassword(e.target.value)}
              />

              {errors.length > 0 && (
                <div className="text-red-500">{errors}</div>
              )}
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => setShowReauth(false)}
                  className="bg-red-500 "
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#38bdf8]">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-[2rem] flex h-screen items-center gap-4">
        <div className="h-full w-[20rem] rounded-lg border-2 bg-white p-2">
          <h1 className="my-2 text-2xl font-bold ">
            CREATE ACCOUNTANT ACCOUNT
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col justify-center"
          >
            <Input
              placeholder="Email or username"
              name="username"
              className="mb-2"
              value={user.username}
              onChange={handleChange}
            />
            <Input
              type="password"
              placeholder="Enter password"
              name="password"
              value={user.password}
              className="mb-2"
              onChange={handleChange}
            />

            {/* <div className="mb-4 flex justify-start">
              <div className="flex">
                <Input
                  type="radio"
                  name="gender"
                  value="male"
                  className="h-[1.2rem] w-[2rem] cursor-pointer"
                  onChange={handleChange}
                />
                <Label className="mr-2 text-start text-sm">Male</Label>
              </div>
              <div className="flex">
                <Input
                  type="radio"
                  name="gender"
                  value="female"
                  className="h-[1.2rem] w-[2rem] cursor-pointer"
                  onChange={handleChange}
                />
                <Label className="mr-2 text-start text-sm">Female</Label>
              </div>
            </div> */}

            {error && <p className="text-red-500">{error}</p>}

            <Button className="mt-[3rem] w-[80%] self-center" type="submit">
              Register
            </Button>
          </form>
        </div>

        <div className="h-screen  w-full">
          <Table className="mx-auto w-[80%] border-2 bg-white">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">username</TableHead>
                <TableHead className="text-center">Password</TableHead>
                <TableHead className="text-center">Date Created</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountant.length > 0 ? (
                accountant.map((account, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      {account.user_id}
                    </TableCell>
                    <TableCell className="text-center">
                      {account.username}
                    </TableCell>

                    <TableCell className="text-center">
                      {getPasswordDisplay(
                        account.password,
                        index,
                        showPasswordIndex === index,
                      )}{' '}
                      <Button
                        onClick={
                          parseInt(reauthToken) === 0
                            ? reAuthenticate
                            : () =>
                                setShowPasswordIndex(
                                  index === showPasswordIndex ? -1 : index,
                                )
                        }
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      {moment(account.created_at).format('LL')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => handleDelete(account.user_id)}
                        className="bg-red-600"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No Accountants
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Accountants;
