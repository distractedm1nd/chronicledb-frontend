/* eslint-disable jsx-a11y/anchor-is-valid */
import { Menu, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment, useContext, useEffect, useState } from "react";

import {
  classNames,
  fetchStreamAttribute,
  fetchStreams,
  recoverStreamSnapshot,
  shutdownStream,
} from "../../utils";
import CreateStreamModal from "./CreateStreamModal";
import Modal from "../Modal";
import InsertEventModal from "./InsertEventModal";
import QueryTimeTravelModal from "./QueryTimeTravelModal";
import { TaskContext, UserContext } from "../../AppWrapper";
import InsertArrayModal from "./InsertArrayModal";

export default function Dashboard() {
  // The userContext is passed by the parent AppWrapper
  const user = useContext(UserContext);

  const tasks = useContext(TaskContext)
  const [currentStream, setCurrentStream] = useState<number>(0);
  const [availableStreams, setAvailableStreams] = useState<any[]>([]);
  const [extraStreamInfo, setExtraStreamInfo] = useState<{
    [key in number]: any;
  }>({});

  // TODO: These four useStates can be merged into an object
  const [createStreamModalOpen, setCreateStreamModalOpen] = useState(false);
  const [insertEventModalOpen, setInsertEventModalOpen] = useState(false);
  const [insertArrayModalOpen, setInsertArrayModalOpen] = useState(false);
  const [queryTimeTravelModalOpen, setQueryTimeTravelModalOpen] =
    useState(false);

  // The modal belonging to this component is responsible for showing right flank and stream info.
  const [modal, setModal] = useState({
    open: false,
    title: "Loading...",
    body: "",
  });

  const StreamDropdownItems = [
    {
      name: "Show Right Flank",
      onClick: (streamId: number) => {
        showRightFlank(streamId);
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
    {
      name: "Insert Array Ordered",
      onClick: (streamId: number) => {
        setCurrentStream(streamId);
        setInsertArrayModalOpen(true);
      },
    },
  ];

  // Every time the user or modalOpen loads/changes, updateStreams is called.
  useEffect(() => {
    updateStreams();
  }, [user, modal]);

  // Fetch information and populate Dashboard table view.
  const updateStreams = async () => {
    const streams = await fetchStreams(user);
    setAvailableStreams(streams);
    await fetchExtraStreamInfo(streams);
  };

  const showStreamInfo = async (streamId: number) => {
    setModal({
      open: true,
      title: "Stream Info: " + streamId,
      body: await fetchStreamAttribute(streamId, "stream_info"),
    });
  };

  const showRightFlank = async (streamId: number) => {
    setModal({
      open: true,
      title: "Right Flank: " + streamId,
      body: await fetchStreamAttribute(streamId, "show_right_flank"),
    });
  };

  // Extra data is retrieved from the server to display more information in the Dashboard table.
  const fetchExtraStreamInfo = async (streams: any[]) => {
    const extraInfo: { [key in number]: object } = {};
    for (const stream of streams) {
      const streamId = stream[0];
      const min_key = await fetchStreamAttribute(streamId, "min_key");
      const max_key = await fetchStreamAttribute(streamId, "max_key");
      const tree_height = await fetchStreamAttribute(streamId, "tree_height");

      extraInfo[streamId] = {
        max_key: max_key,
        min_key: min_key,
        tree_height: tree_height,
      };
    }

    setExtraStreamInfo(extraInfo);
  };

  return (
    <>
      <CreateStreamModal
        open={createStreamModalOpen}
        setOpen={setCreateStreamModalOpen}
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
        title={modal.title}
        body={modal.body}
        buttonTitle={"Close"}
        open={modal.open}
        setOpen={(openState) =>
          setModal((current) => ({ ...current, open: openState }))
        }
      />
      <main className="flex-1">
        <div className="p-6">
          <div className="px-4 sm:px-6 md:px-0 flex justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 my-auto">
              Stream Dashboard
            </h1>
            {(user.roles.includes("admin") || user.roles.includes("write")) && (
              <button
                onClick={() => {
                  setCreateStreamModalOpen(true);
                }}
                className="flex px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800 dark:bg-blue-500 dark:text-white dark:border-gray-500 dark:hover:bg-blue-400"
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
                        onClick={() => showStreamInfo(stream[0])}
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
                              ? shutdownStream(stream[0], updateStreams)
                              : recoverStreamSnapshot(stream[0], updateStreams)
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
