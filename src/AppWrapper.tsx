import { Dialog, Menu,Transition } from "@headlessui/react";
import {
  CalendarIcon,
  CogIcon,
  DatabaseIcon,
  HomeIcon,
  InboxIcon,
  LogoutIcon,
  MenuAlt2Icon,
  SearchIcon,
  SelectorIcon,
  ServerIcon,
  UsersIcon,
  XIcon,
} from "@heroicons/react/outline";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BSeeger from "./assets/bseeger.jpeg";
import UniLogo from "./assets/Uni_Marburg_Logo.svg";
import Modal from "./components/Modal";
import { ip, User } from "./types/types";
import { classNames, fetchSystemInfo } from "./utils";

// Sidebar links
const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Jobs", href:"/scheduler", icon: CalendarIcon},
  { name: "Users", href: "/users", icon: UsersIcon },
  { name: "Java", href: "/java", icon: DatabaseIcon},
  { name: "Sign Out", href: "/logout", icon: LogoutIcon },
];

// Links for the user menu dropdown
const userNavigation = [
  { name: "Sign out", href: "/logout" },
];

// Storage using react context, so that user information can be given to child components.
export const UserContext = React.createContext({
  username: "",
  roles: [] as string[],
  token: "",
} as User);

export const TaskContext = React.createContext([
  {
    name:"",
    date:"",
    period:"",
  }
]);

function AppWrapper(props: any) {
  // The sidebar corresponds to the mobile sidebar, which is hidden on screens larger than the 'sm' breakpoint.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // The information modal is used to display information fetched by the SystemInfo query
  const [infoModal, setInfoModal] = useState({
    open: false,
    title: "Loading...",
    body: "",
  });

  const [user, setUser] = useState({
    username: "Prof. Seeger",
    roles: [] as string[],
    token: "",
  });
  const [tasks, setTasks] = useState([{
    name:"Create Stream",
    date:"second",
    period:"2",
  }])

  // The following hooks are used to emulate browser emulation in our SPA.
  const location = useLocation();
  const navigate = useNavigate();

  const showSystemInfo = async () => {
    setInfoModal({
      open: true,
      title: "System Info",
      body: await fetchSystemInfo(),
    });
  };

  useEffect(() => {
    // Question: Why isn't the useLocalStorage hook used here?
    const savedUser = localStorage.getItem("user");
    const state = savedUser && JSON.parse(savedUser);
    if (!state) {
      navigate("/login");
      return;
    }
    setUser({ username: state.username, roles: state.roles, token: state.token });
  }, []);

  return (
    <UserContext.Provider value={user}>
      <TaskContext.Provider value={tasks}>
      <Modal
        title={infoModal.title}
        body={infoModal.body}
        buttonTitle={"Close"}
        open={infoModal.open}
        setOpen={(openState) =>
          setInfoModal((current) => ({ ...current, open: openState }))
        }
      />
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 flex md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative max-w-xs w-full bg-white pt-5 pb-4 flex-1 flex flex-col">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 px-4 flex justify-center items-center">
                <img
                  className="h-12 w-auto"
                  src={UniLogo}
                  alt="Logo der Philipps Universität Marburg"
                />
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.href === location.pathname
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group rounded-md py-2 px-2 flex items-center text-base font-medium"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.href === location.pathname
                            ? "text-gray-500"
                            : "text-gray-400 group-hover:text-gray-500",
                          "mr-4 flex-shrink-0 h-6 w-6"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" />
        </Dialog>
      </Transition.Root>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="border-r border-gray-200 dark:border-gray-900 pt-5 flex flex-col flex-grow bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="flex-shrink-0 px-4 flex justify-center items-center">
            <img
              className="dark:bg-gray-700 py-2 px-4 rounded-xl"
              src={UniLogo}
              alt="Logo der Philipps Universität Marburg"
            />
          </div>
          <Menu as="div" className="px-3 relative inline-block text-left pt-6">
            <div>
              <Menu.Button className="group w-full bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-800">
                <span className="flex w-full justify-between items-center">
                  <span className="flex min-w-0 items-center justify-between space-x-3">
                    <img
                      className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
                      src={BSeeger}
                      alt=""
                    />
                    <span className="flex-1 flex flex-col min-w-0">
                      <span className="text-gray-900 dark:text-white text-sm font-medium truncate">
                        {user.username}
                      </span>
                      {user.roles.includes("admin") && (
                        <span className="text-gray-500 dark:text-gray-200 text-sm truncate">
                          Administrator
                        </span>
                      )}
                    </span>
                  </span>
                  <SelectorIcon
                    className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </span>
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
              <Menu.Items className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <a
                        href={item.href}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block py-2 px-4 text-sm text-gray-700"
                        )}
                      >
                        {item.name}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
          <div className="text-xs p-3">
            <div className={"flex items-center space-x-3"}>
              <div
                className={classNames(
                  "bg-green-500",
                  "flex-shrink-0 w-2.5 h-2.5 rounded-full"
                )}
                aria-hidden="true"
              />
              <a href="#" className="truncate dark:text-gray-200 dark:hover:text-gray-300 hover:text-gray-600">
                <span>Connected:</span>
              </a>
            </div>
            <div className="flex mt-2 ml-2 text-gray-500 dark:text-gray-400 font-normal">
              <p>{ip}</p>
              <button
                className="bg-gray-200 dark:bg-gray-700 dark:text-white ml-auto rounded-md shadow-lg px-2"
                onClick={showSystemInfo}
              >
                ...
              </button>
            </div>
          </div>

          <div className="flex-grow mt-5 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.href === "/logout"
                      ? "text-red-700"
                      : item.href === location.pathname
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-100",
                    "group rounded-md py-2 px-2 flex items-center text-sm font-medium"
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.href === "/logout"
                        ? "text-red-700"
                        : item.href === location.pathname
                        ? "text-gray-500 dark:text-gray-200"
                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="md:pl-64">
        <div className="mx-auto flex flex-col xl:px-0">
          <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 flex px-6 md:hidden">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-800 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          {props.children}
        </div>
      </div>
      </TaskContext.Provider>
    </UserContext.Provider>
  );
}

export default AppWrapper;
