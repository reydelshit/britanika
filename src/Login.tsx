import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function Login() {
  const navigation = useNavigate();

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    await axios
      .get(`${import.meta.env.VITE_BRITANIKA_LOCAL_HOST}/login.php`, {
        params: {
          username: username,
          password: password,
        },
      })
      .then((res) => {
        if (res.data.length > 0) {
          console.log('success');
          console.log(res.data);
          localStorage.setItem('user_id_britanika', res.data[0].user_id);
          localStorage.setItem('type', res.data[0].account_type);
          localStorage.setItem('britanika_reauth', '0');

          const isAdmin = res.data[0].account_type === 'admin' ? true : false;
          const isStaff = res.data[0].account_type === 'staff' ? true : false;
          const isAccountant =
            res.data[0].account_type === 'accountants' ? true : false;

          // console.log(res.data[0].account_type);

          if (isAdmin) {
            navigation('/admin');
            window.location.reload();
          } else if (isStaff) {
            navigation('/staff');
            window.location.reload();
          } else if (isAccountant) {
            navigation('/accountant');
            window.location.reload();
          } else {
            navigation('/');
            window.location.reload();
          }

          console.log(localStorage.getItem('type'), 'type');
        } else {
          setError('Invalid email or password');
        }
      });
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center">
      <div>
        {/* <img src={Cake} alt="logo" className="w-[20rem]" /> */}
        <h1 className="my-4 text-4xl font-bold ">LOGIN NOW!</h1>

        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center justify-center "
        >
          <Input
            // type="email"
            placeholder="Email"
            className="mb-2"
            name="email"
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative w-full">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="mb-2"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="absolute right-2 top-2 block"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <Button className="my-4 w-[80%] " type="submit">
            Login
          </Button>
        </form>

        <span className="text-red-500">{error}</span>
      </div>
    </div>
  );
}