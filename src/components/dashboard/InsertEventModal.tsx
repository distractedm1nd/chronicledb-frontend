import { Dialog, Transition } from "@headlessui/react";
import { CogIcon } from "@heroicons/react/outline";
import { PlusIcon, XCircleIcon } from "@heroicons/react/solid";
import React, { Fragment, useEffect, useRef, useState } from "react";

import StreamModalConfig from "./StreamModalConfig";
import { DefaultStreamConfig, EventNames, IEvent } from "../../types/types";
import { createStream, insertOrdered } from "../../utils";

type InsertEventModalProps = {
  open: boolean;
  setOpen: (state: boolean) => void;
  currentStream: any;
};

const InsertEventModal = ({
  open,
  setOpen,
  currentStream,
}: InsertEventModalProps) => {
  const cancelButtonRef = useRef(null);
  const [timestamp, setTimestamp] = useState<number>(0);
  const [eventType, setEventType] = useState<string>("Raw");
  const [dataType, setDataType] = useState<string>("Integer");
  const [storage, setStorage] = useState<string>("8");
  const [data, setData] = useState<any>("");
  const [dataList, setDataList] = useState<number[]>([]);
  const [rawData, setRawData] = useState<number>(360);
  const [currentEvent, setCurrentEvent] = useState<IEvent>();
  const [compoundEvents, setCompoundEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    // @ts-ignore
    const dataOptions = EventNames[eventType];
    const storageOptions = dataOptions[dataType];
    if (dataType in dataOptions && storage in storageOptions) {
      if (
        (eventType === "Var" || eventType === "Const") &&
        dataType != "String"
      ) {
        setCurrentEvent({ [storageOptions[storage]]: dataList });
      } else if (eventType === "Raw") {
        setCurrentEvent({ [storageOptions[storage]]: rawData });
      } else if (dataType === "String") {
        setCurrentEvent({ [storageOptions[storage]]: data });
      }
    } else if (dataType in dataOptions) {
      setStorage(Object.keys(storageOptions)[0]);
    } else {
      setDataType(Object.keys(dataOptions)[0]);
    }
  }, [eventType, dataType, storage, data]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-2 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg px-2 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="flex items-center justify-start mb-4">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900 dark:text-gray-100"
                  >
                    Insert Event in Stream {currentStream}
                  </Dialog.Title>
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="eventType"
                  className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                >
                  Timestamp
                </label>
                <div className={"flex w-full"}>
                  <input
                    type="text"
                    name="timestamp"
                    id="timestamp"
                    title="timestamp"
                    value={timestamp}
                    onChange={(e) =>
                      setTimestamp(parseInt(e.target.value) || 0)
                    }
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 rounded-md"
                  />
                </div>
                <form className="mt-2 space-y-8 divide-y divide-gray-200">
                  <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                      <div className="sm:grid sm:grid-cols-8 sm:gap-4 sm:items-start sm:border-gray-200">
                        <div className="sm:mt-0 sm:col-span-1">
                          <label
                            htmlFor="eventType"
                            className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                          >
                            Event Type
                          </label>
                          <select
                            id="eventType"
                            name="eventType"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 sm:text-sm rounded-md"
                            value={eventType}
                            onChange={(event) =>
                              setEventType(event.target.value)
                            }
                          >
                            {Object.keys(EventNames).map((name) => (
                              <option>{name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="translation"
                            className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                          >
                            Datatype
                          </label>
                          <select
                            id="dataType"
                            name="dataType"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={dataType}
                            onChange={(event) =>
                              setDataType(event.target.value)
                            }
                          >
                            {
                              // @ts-ignore
                              Object.keys(EventNames[eventType]).map((name) => (
                                <option>{name}</option>
                              ))
                            }
                          </select>
                        </div>
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="translation"
                            className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                          >
                            Storage
                          </label>
                          <select
                            id="dataType"
                            name="dataType"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={storage}
                            onChange={(event) => setStorage(event.target.value)}
                          >
                            {
                              // @ts-ignore
                              dataType in EventNames[eventType] &&
                                Object.keys(
                                  // @ts-ignore
                                  EventNames[eventType][dataType]
                                ).map((name) => <option>{name}</option>)
                            }
                          </select>
                        </div>
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="multiple-disk-max-queue-number"
                            className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                          >
                            Data
                          </label>
                          <div className={"flex w-full"}>
                            <input
                              type="text"
                              name="data"
                              id="data"
                              value={data.toString()}
                              onChange={(event) => {
                                setData(event.target.value);
                                const y: number = parseFloat(event.target.value);
                                if (!Number.isNaN(y)) {
                                  setRawData(y);
                                }
                                const dataArray: number[] = [];
                                const keys = event.target.value.split(",");

                                for (let i = 0; i < keys.length; i++) {
                                  dataArray.push(parseFloat(keys[i]));
                                }

                                setDataList(dataArray);
                              }}
                              className="mt-1 block w-full shadow-sm dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                            />
                            <button
                              type="button"
                              className="mt-1 ml-4 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-white font-medium hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              onClick={() =>
                                currentEvent &&
                                setCompoundEvents([
                                  ...compoundEvents,
                                  currentEvent,
                                ])
                              }
                            >
                              <PlusIcon className={"h-4 my-auto"} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={"flex flex-wrap mt-3"}>
                        {compoundEvents.map((e, idx) => (
                          <div className="flex p-2 mr-4 my-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded-md transform transition duration-100 hover:scale-110">
                            <p>{JSON.stringify(e)}</p>
                            <XCircleIcon
                              className="my-auto ml-2 h-5 text-red-500 cursor-pointer"
                              onClick={() => {
                                const temp = [...compoundEvents];
                                temp.splice(idx, 1);
                                setCompoundEvents(temp);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* divider before buttons*/}
                  <div className="pt-2"></div>
                </form>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row sm:justify-end space-x-3">
                {/*<button*/}
                {/*  type="button"*/}
                {/*  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"*/}
                {/*  onClick={() => setOpen(false)}*/}
                {/*>*/}
                {/*  Deactivate*/}
                {/*</button>*/}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-white font-medium hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    currentEvent &&
                      insertOrdered(
                        currentStream,
                        timestamp,
                        compoundEvents.length > 1
                          ? { Compound: compoundEvents }
                          : currentEvent,
                        () => setOpen(false)
                      );
                  }}
                  ref={cancelButtonRef}
                >
                  Insert Event
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default InsertEventModal;
