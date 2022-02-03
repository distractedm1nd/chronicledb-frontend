import { Fragment, useContext, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  CogIcon,
  HomeIcon,
  InboxIcon,
  MenuAlt2Icon,
  PlusIcon,
  ServerIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { ip } from "../../types/types";
import { classNames, recoverStreamSnapshot, shutdownStream } from "../../utils";
import CreateStreamModal from "./CreateStreamModal";
import Modal from "../Modal";
import InsertEventModal from "./InsertEventModal";
import QueryTimeTravelModal from "./QueryTimeTravelModal";
import { UserContext } from "../../App";
import InsertArrayModal from "./InsertArrayModal";

export default function Dashboard() {
  const user = useContext(UserContext);
  const [currentStream, setCurrentStream] = useState<number>(0);
  const [modalOpen, setModalState] = useState(false);
  const [availableStreams, setAvailableStreams] = useState([]);
  const [extraStreamInfo, setExtraStreamInfo] = useState<{
    [key in number]: any;
  }>({});
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [insertEventModalOpen, setInsertEventModalOpen] = useState(false);
  const [insertArrayModalOpen, setInsertArrayModalOpen] = useState(false);
  const [queryTimeTravelModalOpen, setQueryTimeTravelModalOpen] =
    useState(false);
  const [modalBody, setModalBody] = useState("");
  const [modalTitle, setModalTitle] = useState("Loading...");

  const StreamDropdownItems = [
    {
      name: "Show Right Flank",
      onClick: (streamId: number) => {
        fetchRightFlank(streamId);
      },
    },
    {
      name: "Query Time Travel",
      onClick: (streamId: number) => {
        setCurrentStream(streamId);
        setQueryTimeTravelModalOpen(true);
      },
    },
    {
      name: "Insert Ordered",
      onClick: (streamId: number) => {
        setCurrentStream(streamId);
        setInsertEventModalOpen(true);
      },
    },
    { name: "Insert Array Ordered", 
    onClick: (streamId: number) => {
      setCurrentStream(streamId);
      setInsertArrayModalOpen(true);
    } },
  ];

  useEffect(() => {
    fetchStreams();
  }, [user, modalOpen]);

  useEffect(() => {
    fetchExtraStreamInfo(availableStreams);
  }, [availableStreams]);

  const fetchStreams = () => {
    console.log(user);
    if (user.roles.includes("admin") || user.roles.includes("read")) {
      fetch(`${ip}/show_streams`)
        .then((response) => response.json())
        .then((result) => setAvailableStreams(result))
        .catch((error) => console.log("error", error));
    }
  };

  const fetchStreamInfo = (streamId: number) => {
    setModalTitle("Stream Info: " + streamId);
    setInfoModalOpen(true);
    fetch(`${ip}/stream_info/${streamId}`)
      .then((response) => response.text())
      .then((result) => setModalBody(result))
      .catch((error) => console.log("error", error));
  };

  const fetchQueryTimeTravel = (streamId: number) => {
    setModalTitle("Query Time Travel: " + streamId);
    setQueryTimeTravelModalOpen(true);
    fetch(`${ip}/query_time_travel/${streamId}`)
      .then((response) => response.text())
      .then((result) => setModalBody(result))
      .catch((error) => console.log("error", error));
  };

  const fetchExtraStreamInfo = async (streams: any[]) => {
    let extraInfo: { [key in number]: object } = {};
    for (const stream of streams) {
      const streamId = stream[0];
      let min_key, max_key, tree_height;
      min_key = await fetchStreamAttribute(streamId, "min_key");
      max_key = await fetchStreamAttribute(streamId, "max_key");
      tree_height = await fetchTreeHeight(streamId);

      extraInfo[streamId] = {
        max_key: max_key,
        min_key: min_key,
        tree_height: tree_height,
      };
    }

    setExtraStreamInfo(extraInfo);
  };

  const fetchStreamAttribute = async (streamId: number, attribute: string) => {
    return await fetch(`${ip}/${attribute}/${streamId}`).then((res) =>
      res.text()
    );
  };

  const fetchTreeHeight = async (streamId: number) => {
    return await fetch(`${ip}/tree_height/${streamId}`).then((res) =>
      res.text()
    );
  };

  const fetchRightFlank = async (streamId: number) => {
    setModalTitle("Right Flank: " + streamId);
    setInfoModalOpen(true);
    fetch(`${ip}/show_right_flank/${streamId}`)
      .then((response) => response.text())
      .then((result) => setModalBody(result))
      .catch((error) => console.log("error", error));
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
      <CreateStreamModal
        open={modalOpen}
        setOpen={(val) => setModalState(val)}
      />
      <InsertEventModal
        open={insertEventModalOpen}
        setOpen={setInsertEventModalOpen}
        currentStream={currentStream}
      />
      <InsertArrayModal
        open={insertArrayModalOpen}
        setOpen={setInsertArrayModalOpen}
        currentStream={currentStream}
      />
      <QueryTimeTravelModal
        open={queryTimeTravelModalOpen}
        setOpen={setQueryTimeTravelModalOpen}
        currentStream={currentStream}
      />
      <Modal
        title={modalTitle}
        body={modalBody}
        buttonTitle={"Close"}
        open={infoModalOpen}
        setOpen={setInfoModalOpen}
      />
      <main className="flex-1">
        <div className="p-6">
          <div className="px-4 sm:px-6 md:px-0 flex justify-between">
<<<<<<< HEAD
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 my-auto">
=======
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 my-auto">
>>>>>>> origin/mahdi
              Stream Dashboard
            </h1>
            {(user.roles.includes("admin") || user.roles.includes("write")) && (
              <button
                onClick={() => {
                  setModalState(true);
                }}
                className="flex px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500"
              >
                Create Stream
                <PlusIcon className="ml-2 my-auto h-4" />
              </button>
            )}
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
          <div className="align-middle inline-block min-w-full border-b border-gray-200 dark:border-gray-500">
            <table className="min-w-full">
              <thead>
                <tr className="border-t border-gray-200 dark:border-gray-500">
                  <th className="px-6 py-3 bg-gray-50 dark:bg-gray-600 dark:text-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="lg:pl-2">Streams</span>
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 bg-gray-50 dark:bg-gray-600 dark:text-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Info
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 bg-gray-50 dark:bg-gray-600 dark:text-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tree Height
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 bg-gray-50 dark:bg-gray-600 dark:text-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Key
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 bg-gray-50 dark:bg-gray-600 dark:text-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Key
                  </th>
                  <th className="pr-6 py-3 bg-gray-50 dark:bg-gray-600 dark:text-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="lg:pl-2">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-600">
                {availableStreams.map((stream) => (
                  <tr key={stream[0]}>
                    <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium dark:bg-gray-500 text-gray-900 dark:text-gray-200">
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
                        <a href="#" className="truncate hover:text-gray-600">
                          <span>
                            {stream[0]}{" "}
                            <span className="text-gray-500 font-normal dark:text-gray-300">
                              {" "}
                              is {stream[1]}
                            </span>
                          </span>
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-normal dark:bg-gray-500 dark:text-gray-200">
                      <button
                        className={classNames(
                          "text-xs font-normal",
                          stream[1] === "Offline"
                            ? "text-gray-500 dark:text-gray-300 cursor-not-allowed"
                            : "text-gray-700 dark:text-gray-200"
                        )}
                        onClick={() => fetchStreamInfo(stream[0])}
                        disabled={stream[1] === "Offline"}
                      >
                        Show Info
                      </button>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-gray-700 text-xs font-normal dark:bg-gray-500 dark:text-gray-200">
                      {(extraStreamInfo[stream[0]] &&
                        "tree_height" in extraStreamInfo[stream[0]] &&
                        extraStreamInfo[stream[0]]["tree_height"]) ||
                        "Undefined"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-gray-700 text-xs font-normal dark:bg-gray-500 dark:text-gray-200">
                      {(extraStreamInfo[stream[0]] &&
                        "min_key" in extraStreamInfo[stream[0]] &&
                        extraStreamInfo[stream[0]]["min_key"]) ||
                        "Undefined"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-gray-700 text-xs font-normal dark:bg-gray-500 dark:text-gray-200">
                      {(extraStreamInfo[stream[0]] &&
                        "max_key" in extraStreamInfo[stream[0]] &&
                        extraStreamInfo[stream[0]]["max_key"]) ||
                        "Undefined"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-normal dark:bg-gray-500 dark:text-gray-200">
                      <span className="relative inline-flex shadow-sm rounded-md">
                        <button
                          type="button"
                          className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-normal text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800 dark:bg-gray-600 dark:text-white dark:border-gray-700 dark:hover:bg-gray-500"
                          onClick={() =>
                            stream[1] === "Online"
                              ? shutdownStream(stream[0], fetchStreams)
                              : recoverStreamSnapshot(stream[0], fetchStreams)
                          }
                        >
                          {stream[1] === "Online" ? "Shutdown" : "Recover"}
                        </button>
                        <Menu as="span" className="-ml-px relative block">
                          <Menu.Button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800 dark:bg-gray-600 dark:text-white dark:border-gray-700 dark:hover:bg-gray-500">
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
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-gray-600 dark:text-white">
                              <div className="py-1 z-50">
                                {StreamDropdownItems.map((item) => (
                                  <Menu.Item key={item.name}>
                                    {({ active }) => (
                                      <button
                                        onClick={() => item.onClick(stream[0])}
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900 dark:bg-gray-500 dark:text-gray-100"
                                            : "text-gray-700 dark:text-gray-200",
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
    </>
  );
}
