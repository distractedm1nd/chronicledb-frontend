import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/solid";
import { Fragment, useRef, useState } from "react";
import { schemaJavaStream } from "../../utils";
import Modal from "../Modal";

type SchemaJavaModalProps = {
    open: boolean,
    setOpen : (state : boolean) => void,
}

const SchemaJavaModal = ({
    open,
    setOpen,
} : SchemaJavaModalProps) => {

    const cancelButtonRef = useRef(null);
    const [queryString, setQueryString] = useState<string>("SELECT (X+Y) AS XY FROM S");

    // The modal belonging to this component is responsible for showing query response.
    const [modal, setModal] = useState({
      open: false,
      title: 'Loading...',
      body: '',
    });

    const executeJavaSchemaQuery = async (queryString: string) => {
      setModal({
        open: true,
        title: 'Schema Query Response',
        body: JSON.stringify( await schemaJavaStream(queryString, () => setOpen(false))),
      });
    };

    return (
      <div>
        <Modal 
        title={modal.title}
        body={modal.body}
        buttonTitle={'Close'}
        open={modal.open}
        setOpen={(openState) =>
          setModal((current) => ({ ...current, open: openState }))
        }/>
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
                    Stream Schema
                  </Dialog.Title>
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="queryString"
                  className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                >
                  QueryString
                </label>
                <div className={"flex w-full"}>
                  <input
                    title="queryString"
                    type="text"
                    name="queryString"
                    id="queryString"
                    value={queryString}
                    onChange={(event) => setQueryString(event.target.value)}
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100 rounded-md"
                  />
                </div>
                <form className="mt-2 space-y-8 divide-y divide-gray-200">
                  <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                      <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:border-gray-200">
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
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-white font-medium hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                  ref={cancelButtonRef}
                  onClick={() => executeJavaSchemaQuery(queryString)}
                >
                  Query 
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
      </div>
    );
}

export default SchemaJavaModal;