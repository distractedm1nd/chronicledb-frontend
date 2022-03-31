import { Dialog, Transition } from "@headlessui/react";
import { CogIcon } from "@heroicons/react/outline";
import { PlusIcon, XCircleIcon } from "@heroicons/react/solid";
import React, { Fragment, useEffect, useRef, useState } from "react";

import {
  attribute,
    attributeTypes,
  DefaultStreamConfig,
  EventNames,
  IEvent,
  javaStream,
  stream,
} from "../../types/types";
import { createJavaStream, createStream, insertArrayOrdered, insertOrdered } from "../../utils";

type CreateJavaStreamModalProps = {
  open: boolean;
  setOpen: (state: boolean) => void;
};

const CreateJavaStreamModal = ({
  open,
  setOpen,
}: CreateJavaStreamModalProps) => {
  const cancelButtonRef = useRef(null);
  const [streamName, setStreamName] = useState<string>("stream");
  const [attributeName, setAttributeName] = useState<string>("attribute");
  const [attributeType, setAttributeType] = useState<string>("DOUBLE");
  const [nullable, setNullable] = useState<boolean>(false);
  const [lightweightIndex, setLightweightIndex] = useState<boolean>(false);
  const [attributes, setAttributes] = useState<attribute[]>([]);
  const [currentAttribute, setCurrentAttribute] = useState<attribute>()
  const [currentJavaStream, setCurrentJavaStream] = useState<javaStream>();

  useEffect(() => {
    if (attributeName || attributeType) {
      setCurrentAttribute({
        name : attributeName,
        type : attributeType,
        properties : {
          nullable : nullable,
          index : lightweightIndex,
        }
      })
    }
  }, [attributeName, attributeType, nullable, lightweightIndex]);

  useEffect(() => {
    if (streamName || attributes) {
      setCurrentJavaStream({
        streamName : streamName,
        schema : attributes,
      })
    }
  }, [streamName, currentAttribute, attributes])

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
                    Create Stream
                  </Dialog.Title>
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="eventType"
                  className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                >
                  StreamName
                </label>
                <div className={"flex w-full"}>
                  <input
                    title="streamName"
                    type="text"
                    name="streamName"
                    id="streamName"
                    value={streamName}
                    onChange={(e) =>
                      setStreamName(e.target.value)
                    }
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 rounded-md"
                  />
                </div>
                <form className="mt-2 space-y-8 divide-y divide-gray-200">
                  <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                      <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:border-gray-200">
                        <div className="sm:mt-0 sm:col-span-1">
                          <label
                            htmlFor="attribute_name"
                            className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md  -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                          >
                            Name
                          </label>
                          <input
                            id="attribute_name"
                            name="attribute_name"
                            title="attribute_name"
                            type="text"
                            className="mt-1 block dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={attributeName}
                            onChange={(event) =>
                              setAttributeName(event.target.value)
                            }
                          >
                          </input>
                        </div>
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="translation"
                            className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md  -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                          >
                            Type
                          </label>
                          <select
                            id="Type"
                            title="Type"
                            name="Type"
                            className="mt-1 block dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={attributeType}
                            onChange={(event) =>
                              setAttributeType(event.target.value)
                            }
                          >
                            {
                              // @ts-ignore
                              Object.keys(attributeTypes).map((name) => (
                                <option>{name}</option>
                              ))
                            }
                          </select>
                        </div>
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="translation"
                            className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md  -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                          >
                            Nullable
                          </label>
                          <select
                            id="nullable"
                            name="nullable"
                            title="nullable"
                            className="mt-1 block dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={nullable ? "True" : "False"}
                            onChange={(event) => setNullable((event.target.value == "True") ? true : false)}
                            >
                                <option>True</option>
                                <option>False</option>
                          </select>
                        </div>
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="multiple-disk-max-queue-number"
                            className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md  -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                          >
                            Lightweight Index
                          </label>
                          <div className={"flex w-full"}>
                            <select
                              name="index"
                              id="index"
                              title="index"
                              value={lightweightIndex ? "True" : "False"}
                              onChange={(event) => setLightweightIndex((event.target.value == "True") ? true : false)}
                              className="mt-1 block dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                            >
                                <option>True</option>
                                <option>False</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* divider before buttons*/}
                  <div className="pt-2"></div>
                </form>
              </div>
              <div className={"flex flex-wrap mt-3"}>
                {attributes.map((e, idx) => (
                  <div className="flex p-2 mr-4 my-2 bg-gray-100 dark:bg-gray-500 dark:text-gray-100 rounded-md transform transition duration-100 hover:scale-110">
                    <p>{JSON.stringify(e)}</p>
                    <XCircleIcon
                      className="my-auto ml-2 h-5 text-red-500 cursor-pointer"
                      onClick={() => {
                        const temp = [...attributes];
                        temp.splice(idx, 1);
                        setAttributes(temp);
                      }}
                    />
                  </div>
                ))}
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
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-white font-medium hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => currentAttribute && setAttributes([...attributes, currentAttribute])}
                  ref={cancelButtonRef}
                >
                  Add Attribute
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-white font-medium hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                  ref={cancelButtonRef}
                  onClick={() => {
                    currentJavaStream &&
                      createJavaStream(currentJavaStream, () =>
                        setOpen(false)
                      );
                  }}
                >
                  Creare Stream
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CreateJavaStreamModal;
