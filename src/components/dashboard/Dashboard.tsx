import {Fragment, useEffect, useState} from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  CogIcon,
  HomeIcon,
  InboxIcon,
  MenuAlt2Icon,
  PlusIcon,
  ServerIcon,
  UsersIcon,
  XIcon,
} from "@heroicons/react/outline";
import {ChevronDownIcon, SearchIcon} from "@heroicons/react/solid";
import UniLogo from "../../assets/Uni_Marburg_Logo.svg";
import BSeeger from "../../assets/bseeger.jpeg";
import {configString, DefaultStreamConfig, EventType, IEvent, ip, StreamConfig} from "../../types/types";
import {classNames, configToINI} from "../../utils";
import Modal from "../Modal";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Servers", href: "#", icon: ServerIcon, current: false },
  { name: "Reports", href: "#", icon: InboxIcon, current: false },
  { name: "Users", href: "#", icon: UsersIcon, current: false },
  { name: "Settings", href: "#", icon: CogIcon, current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

const StreamDropdownItems = [
  {name: "Query Time Travel", onClick: () => {}},
  {name: "Insert Ordered", onClick: () => {}},
  {name: "Insert Ordered Array", onClick: () => {}}
]

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [availableStreams, setAvailableStreams] = useState([]);
  const [streamInfoModalOpen, setStreamInfoModalOpen] = useState(false);
  const [streamInfo, setStreamInfo] = useState("");

  useEffect(() => {
    fetchStreams();
  }, [])

  // Question: How should insert_ordered_array be formatted?
  const insertOrdered = (streamId: number, event: IEvent) => {
    fetch(`${ip}/insert_ordered${streamId}`,  {
      method: 'POST',
      body: `Event = ${JSON.stringify(event)}`,
    })
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
  }

  const fetchStreams = () => {
    fetch(`${ip}/show_streams`)
        .then(response => response.json())
        .then(result => setAvailableStreams(result))
        .catch(error => console.log('error', error));
  }

  const fetchStreamInfo = (streamId: number) => {
    setStreamInfoModalOpen(true);
    fetch(`${ip}/stream_info/${streamId}`)
        .then(response => response.text())
        .then(result => setStreamInfo(result))
        .catch(error => console.log('error', error));
  }

  const shutdownStream = (streamId: number) => {
    fetch(`${ip}/shutdown_stream/${streamId}`)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
        .finally(fetchStreams);
  }

  const recoverStreamSnapshot = (streamId: number) => {
    fetch(`${ip}/recover_stream_snapshot/${streamId}`)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
        .finally(fetchStreams);
  }

  const createStream = () => {
    fetch(`${ip}/create_stream`,  {
      method: 'POST',
      body: configToINI(DefaultStreamConfig),
    })
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
        .finally(fetchStreams);
  }

  return (
    <>
      <div>
        <Modal title={"Stream Info"} body={streamInfo} buttonTitle={"Close"} open={streamInfoModalOpen} setOpen={setStreamInfoModalOpen} />
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
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
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
                          item.current
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group rounded-md py-2 px-2 flex items-center text-base font-medium"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
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
            <div className="flex-shrink-0 w-14">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>
        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="border-r border-gray-200 pt-5 flex flex-col flex-grow bg-white overflow-y-auto">
            <div className="flex-shrink-0 px-4 flex justify-center items-center">
              <img
                className="h-16 w-auto"
                src={UniLogo}
                alt="Logo der Philipps Universität Marburg"
              />
            </div>
            <div className="flex-grow mt-5 flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group rounded-md py-2 px-2 flex items-center text-sm font-medium"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500",
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
            <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 flex px-6">
              <button
                type="button"
                className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex-1 flex justify-between px-4 md:px-0">
                <div className="flex-1 flex">
                  <form className="w-full flex md:ml-0" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                      Search
                    </label>
                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                        <SearchIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <input
                        id="search-field"
                        className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                        placeholder="Search"
                        type="search"
                        name="search"
                      />
                    </div>
                  </form>
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-12 w-12 rounded-full"
                          src={BSeeger}
                          alt=""
                        />
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
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
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
                </div>
              </div>
            </div>

            <main className="flex-1">
              <div className="px-6 pt-6">
                <div className="px-4 sm:px-6 md:px-0 flex justify-between">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Stream Dashboard
                  </h1>
                  <button onClick={() => createStream()}
                          className="bg-transparent hover:bg-gray-900 text-black font-semibold hover:text-white py-2 px-4 border border-gray-600 hover:border-transparent rounded flex">
                    Create Stream
                    <PlusIcon className="ml-2 my-auto h-4" />
                  </button>
                </div>
                {/*<div className="px-4 sm:px-6 md:px-0">*/}
                {/*  {availableStreams.map(stream => {*/}
                {/*        let online = stream[1] === "Online";*/}
                {/*        return (<div className={classNames("p-2 shadow-md bg-white rounded-md my-2 border flex", online ? "border-green-500" : "border-red-500")}>*/}
                {/*          <p className="text-gray-700">Stream {stream[0]}: {stream[1]}</p>*/}
                {/*        </div>)*/}
                {/*  }*/}
                {/*  )}*/}
                {/*</div>*/}
              </div>
              {/* Projects table (small breakpoint and up) */}
              <div className="hidden mt-8 sm:block">
                <div className="align-middle inline-block min-w-full border-b border-gray-200">
                  <table className="min-w-full">
                    <thead>
                    <tr className="border-t border-gray-200">
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="lg:pl-2">Streams</span>
                      </th>
                      <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Info
                      </th>
                      <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="lg:pl-2">Actions</span>
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                    {availableStreams.map(stream => (
                        <tr key={stream[0]}>
                          <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center space-x-3 lg:pl-2">
                              <div
                                  className={classNames(stream[1] === "Online" ? "bg-green-500" : "bg-red-500", 'flex-shrink-0 w-2.5 h-2.5 rounded-full')}
                                  aria-hidden="true"
                              />
                              <a href="#" className="truncate hover:text-gray-600">
                              <span>
                                {stream[0]} <span className="text-gray-500 font-normal"> is {stream[1]}</span>
                              </span>
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-normal">
                            <button
                                className={classNames("text-xs font-normal", stream[1] === "Offline" ? "text-gray-500 cursor-not-allowed" : "text-gray-700")} onClick={() => fetchStreamInfo(stream[0])}
                                disabled={stream[1] === "Offline"}
                            >
                              Show Info
                            </button>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-normal">
                            <span className="relative inline-flex shadow-sm rounded-md">
                            <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-normal text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800"
                                onClick={() => stream[1] === "Online" ? shutdownStream(stream[0]) : recoverStreamSnapshot(stream[0])}
                            >
                              {stream[1] === "Online" ? "Shutdown" : "Recover"}
                            </button>
                            <Menu as="span" className="-ml-px relative block">
                              <Menu.Button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800">
                                <span className="sr-only">Open options</span>
                                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                              </Menu.Button>
                              <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                  <div className="py-1 z-50">
                                    {StreamDropdownItems.map((item) => (
                                        <Menu.Item key={item.name}>
                                          {({ active }) => (
                                              <button
                                                  onClick={item.onClick}
                                                  className={classNames(
                                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                      'block px-4 py-2 text-xs font-regular w-full text-left'
                                                  )}
                                              >
                                                {item.name}
                                              </button>
                                          )}
                                        </Menu.Item>
                                    ))}
                                  </div>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </span>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
