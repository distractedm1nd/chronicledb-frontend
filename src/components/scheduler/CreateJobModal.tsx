import { Dialog, Transition } from "@headlessui/react";
import { CogIcon } from "@heroicons/react/outline";
import { Fragment, useRef, useState } from "react";
import '@themesberg/flowbite';

import {classNames, createCreateStreamJob, createInsertOrderedJob} from "../../utils";


type CreateJobModalProps = {
  open: boolean;
  setOpen: (state: boolean) => void;
};

export default function CreateJobModal({
  open,
  setOpen,
}: CreateJobModalProps) {
  const cancelButtonRef = useRef(null);

  const [date, setDate] = useState<string>("Minute");
  const [streamId, setStreamId] = useState<string>("0");
  const [period, setPeriod] = useState<number>(1);
  const [taskName, setTaskName] = useState<string>("Create Stream");

  const submitTaskCreation =  () => {
      if(taskName == "Create Stream") {
          createCreateStreamJob(date, period)
              .then((result) => console.debug(result))
              .then((error) => console.error("error", error));
      } else {
          createInsertOrderedJob(date, period, parseInt(streamId))
              .then((result) => console.debug(result))
              .then((error) => console.error("error", error));
      }
    setOpen(false);
  };

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
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-2 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="flex items-center justify-start mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-200 sm:mx-0 sm:h-10 sm:w-10">
                  <CogIcon
                    className="h-6 w-6 text-blue-600 dark:text-blue-700"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                  >
                    Schedule a Task
                  </Dialog.Title>
                </div>
              </div>
              <div className="mt-4">
                            <form className="mt-2 space-y-8 divide-y divide-gray-200">
                                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                                    <div>
                                            <div className={classNames("sm:grid sm:gap-4 sm:items-start sm:border-gray-200", taskName === "Create Stream" ? "sm:grid-cols-3" : "sm:grid-cols-4")}>
                                                <div className="sm:mt-0 sm:col-span-1">
                                                <label
                                                        htmlFor="multiple-disk-max-queue-number"
                                                        className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md  -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                                                    >
                                                        Jobs
                                                </label>
                                                <select
                                                        id="date"
                                                        name="date"
                                                        className="mt-1 block dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        value={taskName}
                                                        onChange={(event) => setTaskName(event.target.value)}
                                                    >
                                                                <option>Create Stream</option>
                                                                <option>Insert Ordered</option>
                                                    </select>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <label
                                                        htmlFor="multiple-disk-max-queue-number"
                                                        className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md  -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                                                    >
                                                        Date
                                                    </label>
                                                    <select
                                                        id="date"
                                                        name="date"
                                                        className="mt-1 block dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        value={date}
                                                        onChange={(event) => setDate(event.target.value)}
                                                    >
                                                                <option>Minute</option>
                                                                <option>Day</option>
                                                                <option>Month</option>
                                                    </select>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <label
                                                        htmlFor="multiple-disk-max-queue-number"
                                                        className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md  -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                                                    >
                                                        Period
                                                    </label>
                                                    <select
                                                        id="period"
                                                        name="period"
                                                        className="mt-1 block dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        value={period}
                                                        onChange={(event) => setPeriod(parseInt(event.target.value))}
                                                    >
                                                                <option>1</option>
                                                                <option>2</option>
                                                                <option>5</option>
                                                                <option>10</option>
                                                    </select>
                                                </div>
                                                { taskName === "Insert Ordered" &&
                                                    <div className="sm:col-span-1">
                                                        <label
                                                            htmlFor="multiple-disk-max-queue-number"
                                                            className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md  -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                                                        >
                                                            Stream Id
                                                        </label>
                                                        <input
                                                            id="streamId"
                                                            type="text"
                                                            name="streamId"
                                                            className="mt-1 block dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                            value={streamId}
                                                            onChange={(event) => setStreamId(event.target.value)}
                                                        >
                                                        </input>
                                                    </div>
                                                }
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
                  data-tooltip-target ="tooltip-default"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
                <div id="tooltip-default" role="tooltip" className="tooltip absolute z-10 inline-block rounded-lg bg-gray-900 font-medium shadow-sm text-white py-2 px-3 text-sm duration-300 invisible dark:bg-gray-700">
                  Tooltip content
                  <div className="tooltip-arrow" data-popper-arrow />
                </div>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 bg-green-500 dark:bg-green-600 dark:hover:bg-green-500 text-white font-medium hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={submitTaskCreation}
                  ref={cancelButtonRef}
                >
                  Schedule
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
