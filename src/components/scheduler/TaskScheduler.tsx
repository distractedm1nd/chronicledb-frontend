import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/outline";
import { Fragment, useEffect, useState,} from "react";

import CreateJobModal from "./CreateJobModal";
import { Task } from "../../types/types";
import {deleteJob, fetchJobs} from "../../utils";


export default function TaskScheduler() {

    const [modalOpen, setModalState] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
      console.log("From UseEffect: ");
      console.log(typeof(tasks));
      console.log(tasks);
      refreshJobs();
    }, [modalOpen, setModalState]);

    const refreshJobs = () => {
        fetchJobs().then((result) => setTasks(JSON.parse(result))).catch((error) => console.log("error", error));
    };

    const submitJobDeletion = async (job : Task) => {
        console.debug("Deleting : " + JSON.stringify(job));
      await deleteJob(job)
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

      refreshJobs();
    }

  return (
    <>
    <CreateJobModal
        open={modalOpen}
        setOpen={(val) => setModalState(val)}
      />
      <main className="flex-1">
        <div className="p-6">
          <div className="px-4 sm:px-6 md:px-0 flex justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 my-auto dark:text-gray-200">
              Scheduling
            </h1>
            <button
              onClick={() => {
                setModalState(true);
              }}
              className="flex px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500"
            >
                Schedule
              <PlusIcon className="ml-2 my-auto h-4" />
            </button>
          </div>
        </div>
        {/* Projects table (small breakpoint and up) */}
        <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Task ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Task
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Period
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {
                  tasks.map((job) => (
                    <tr key={job._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{"every " + job.period + " " + job.date + "s"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <span className="relative inline-flex shadow-sm rounded-md">
                        <button
                          type="button"
                          className="relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-xs font-normal text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800  dark:bg-gray-600 dark:text-white dark:border-gray-700 dark:hover:bg-gray-500"
                          onClick={() => submitJobDeletion(job)}
                        >
                          Delete Task
                        </button>

                      </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
      </main>
    </>
  );
}
