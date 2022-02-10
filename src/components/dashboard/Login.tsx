import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UniLogo from "../../assets/Uni_Marburg_Logo.svg";
import { api } from "../../types/types";
import { Menu, Transition } from '@headlessui/react'
import {
  MoonIcon,
  SunIcon,
  DesktopComputerIcon,
  DotsVerticalIcon,
} from '@heroicons/react/solid';
import { useLocalStorage } from "../../useLocalStorage";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Login() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [theme, setTheme] = useLocalStorage("theme","light");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    if (location.pathname === "/logout") {
      localStorage.setItem("user", JSON.stringify(null));
      navigate("/login");
    }
  }, []);

  const loginUser = async (e: any) => {
    e.preventDefault();
    const response = await fetch(api + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        password: user.password,
      }),
    });
    let res = await response.json();

    console.log(res);
    if (response.status === 200) {
      localStorage.setItem("user", JSON.stringify(res));
      navigate("/");
    }
  };

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Menu as="div" className="relative block h-10 text-right">
          <div>
            <Menu.Button className="absolute inset-y-0 right-0 h-5 bg-gray-100 rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
              <span className="sr-only">Open options</span>
              <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
          </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
        <Menu.Items className="origin-top-right absolute right-0 mt-6 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 dark:bg-gray-500 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                  onClick={active ? setTheme("light"):""}
                >
                  <SunIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Light
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 dark:bg-gray-500 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                  onClick={active ? setTheme("dark"):""}
                >
                  <MoonIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-100" aria-hidden="true" />
                  Dark
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 dark:bg-gray-500 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                  onClick={active ? setTheme("system"):""}
                >
                  <DesktopComputerIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  System
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img className="mx-auto h-20 w-auto" src={UniLogo} alt="Workflow" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            ChronicleDB Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Sign in to your account
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={user.username}
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                    required
                    className="appearance-none dark:bg-gray-600 block w-full px-3 py-2 border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-800 focus:border-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={user.password}
                    autoComplete="current-password"
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    required
                    className="appearance-none dark:bg-gray-600 block w-full px-3 py-2 border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-800 focus:border-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 dark:bg-gray-500 focus:ring-indigo-500 border-gray-300 dark:border-gray-500 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900 dark:text-gray-200"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-800 dark:text-blue-600 hover:text-indigo-600 dark:hover:text-blue-400"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-800 dark:bg-blue-500 hover:bg-indigo-900 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                  onClick={loginUser}
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
