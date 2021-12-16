import { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  CogIcon,
  HomeIcon,
  InboxIcon,
  MenuAlt2Icon,
  PlusIcon,
  ServerIcon,
  UsersIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  ChevronDownIcon,
  SearchIcon,
  SelectorIcon,
} from "@heroicons/react/solid";
import UniLogo from "../../assets/Uni_Marburg_Logo.svg";
import BSeeger from "../../assets/bseeger.jpeg";
import { ip } from "../../types/types";
import { classNames, recoverStreamSnapshot, shutdownStream } from "../../utils";
import CreateStreamModal from "./CreateStreamModal";
import Modal from "../Modal";
import InsertEventModal from "./InsertEventModal";

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


export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStream, setCurrentStream] = useState<number>(0);
  const [modalOpen, setModalState] = useState(false);
  const [availableStreams, setAvailableStreams] = useState([]);
  const [extraStreamInfo, setExtraStreamInfo] = useState<{[key in number]: any}>({});
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [insertEventModalOpen, setInsertEventModalOpen] = useState(false);
  const [modalBody, setModalBody] = useState("");
  const [modalTitle, setModalTitle] = useState("Loading...");

  const StreamDropdownItems = [
    { name: "Query Time Travel", onClick: (streamId: number) => {} },
    { name: "Insert Ordered", onClick: (streamId: number) => {setCurrentStream(streamId); setInsertEventModalOpen(true);}},
    { name: "Insert Ordered Array", onClick: (streamId: number) => {} },
  ];

  useEffect(() => {
    fetchStreams();
  }, [modalOpen]);

  useEffect(() => {
    fetchExtraStreamInfo(availableStreams);
  }, [availableStreams])

  const fetchStreams = () => {
    fetch(`${ip}/show_streams`)
      .then((response) => response.json())
      .then((result) => setAvailableStreams(result))
      .catch((error) => console.log("error", error));
  };

  const fetchStreamInfo = (streamId: number) => {
    setModalTitle("Stream Info: " + streamId);
    setInfoModalOpen(true);
    fetch(`${ip}/stream_info/${streamId}`)
      .then((response) => response.text())
      .then((result) => setModalBody(result))
      .catch((error) => console.log("error", error));
  };

  const fetchExtraStreamInfo = async (streams: any[]) => {
    let extraInfo: {[key in number]: object} = {};
    for (const stream of streams) {
      const streamId = stream[0];
      let min_key, max_key;
      min_key = await fetchStreamAttribute(streamId, "min_key");
      max_key = await fetchStreamAttribute(streamId, "max_key");

      extraInfo[streamId] = {
        "max_key": max_key,
        "min_key": min_key
      }
    }

    setExtraStreamInfo(extraInfo);
  }

  const fetchStreamAttribute = async (streamId: number, attribute: string) => {
    return await fetch(`${ip}/${attribute}/${streamId}`).then(res => res.text());
  };

  const fetchSystemInfo = () => {
    setModalTitle("System Info");
    setInfoModalOpen(true);
    fetch(`${ip}/system_info`)
      .then((response) => response.text())
      .then((result) => setModalBody(result))
      .catch((error) => console.log("error", error));
  };

  return (
    <>
      <div>
        <CreateStreamModal
          open={modalOpen}
          setOpen={(val) => setModalState(val)}
        />
        <InsertEventModal open={insertEventModalOpen} setOpen={setInsertEventModalOpen} currentStream={currentStream}/>
        <Modal
          title={modalTitle}
          body={modalBody}
          buttonTitle={"Close"}
          open={infoModalOpen}
          setOpen={setInfoModalOpen}
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
            <Menu
              as="div"
              className="px-3 relative inline-block text-left pt-6"
            >
              <div>
                <Menu.Button className="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-800">
                  <span className="flex w-full justify-between items-center">
                    <span className="flex min-w-0 items-center justify-between space-x-3">
                      <img
                        className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
                        src={BSeeger}
                        alt=""
                      />
                      <span className="flex-1 flex flex-col min-w-0">
                        <span className="text-gray-900 text-sm font-medium truncate">
                          Prof. Seeger
                        </span>
                        <span className="text-gray-500 text-sm truncate">
                          Administrator
                        </span>
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
                <a href="#" className="truncate hover:text-gray-600">
                  <span>Connected:</span>
                </a>
              </div>
              <div className="flex mt-2 ml-2 text-gray-500 font-normal">
                <p>{ip}</p>
                <button
                  className="bg-gray-200 ml-auto rounded-md shadow-lg px-2"
                  onClick={() => fetchSystemInfo()}
                >
                  ...
                </button>
              </div>
            </div>
            {/* Sidebar Search */}
            <div className="px-3">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  aria-hidden="true"
                >
                  <SearchIcon
                    className="mr-3 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-indigo-800 focus:border-indigo-800 block w-full pl-9 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search"
                />
              </div>
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

            <main className="flex-1">
              <div className="p-6">
                <div className="px-4 sm:px-6 md:px-0 flex justify-between">
                  <h1 className="text-2xl font-semibold text-gray-900 my-auto">
                    Stream Dashboard
                  </h1>
                  <button
                    onClick={() => {
                      setModalState(true);
                    }}
                    className="flex px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800"
                  >
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
              <div className="hidden sm:block">
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
                        <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Min Key
                        </th>
                        <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Max Key
                        </th>
                        <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <span className="lg:pl-2">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {availableStreams.map((stream) => (
                        <tr key={stream[0]}>
                          <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center space-x-3 lg:pl-2">
                              <div
                                className={classNames(
                                  stream[1] === "Online"
                                    ? "bg-green-500"
                                    : "bg-red-500",
                                  "flex-shrink-0 w-2.5 h-2.5 rounded-full"
                                )}
                                aria-hidden="true"
                              />
                              <a
                                href="#"
                                className="truncate hover:text-gray-600"
                              >
                                <span>
                                  {stream[0]}{" "}
                                  <span className="text-gray-500 font-normal">
                                    {" "}
                                    is {stream[1]}
                                  </span>
                                </span>
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-normal">
                            <button
                              className={classNames(
                                "text-xs font-normal",
                                stream[1] === "Offline"
                                  ? "text-gray-500 cursor-not-allowed"
                                  : "text-gray-700"
                              )}
                              onClick={() => fetchStreamInfo(stream[0])}
                              disabled={stream[1] === "Offline"}
                            >
                              Show Info
                            </button>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-right text-gray-700 text-xs font-normal">
                            {extraStreamInfo[stream[0]] && "min_key" in extraStreamInfo[stream[0]] && extraStreamInfo[stream[0]]["min_key"] || "Undefined"}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-right text-gray-700 text-xs font-normal">
                            {extraStreamInfo[stream[0]] && "max_key" in extraStreamInfo[stream[0]] && extraStreamInfo[stream[0]]["max_key"] || "Undefined"}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-normal">
                            <span className="relative inline-flex shadow-sm rounded-md">
                              <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-normal text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800"
                                onClick={() =>
                                  stream[1] === "Online"
                                    ? shutdownStream(stream[0], fetchStreams)
                                    : recoverStreamSnapshot(
                                        stream[0],
                                        fetchStreams
                                      )
                                }
                              >
                                {stream[1] === "Online"
                                  ? "Shutdown"
                                  : "Recover"}
                              </button>
                              <Menu as="span" className="-ml-px relative block">
                                <Menu.Button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800">
                                  <span className="sr-only">Open options</span>
                                  <ChevronDownIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
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
                                              onClick={() => item.onClick(stream[0])}
                                              className={classNames(
                                                active
                                                  ? "bg-gray-100 text-gray-900"
                                                  : "text-gray-700",
                                                "block px-4 py-2 text-xs font-regular w-full text-left"
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
