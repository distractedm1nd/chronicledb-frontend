/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Switch, Transition } from "@headlessui/react";
import { CogIcon, QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import "@themesberg/flowbite";

import RoleToggle from "./RoleToggle";
import ErrorComponent from "../ErrorComponent";
import { UserContext } from "../../AppWrapper";
import { api, DefaultStreamConfig, Roles } from "../../types/types";
import { changeRoles } from "../../utils";

type CreateUserModalProps = {
  currentRoles: string[];
  username: string;
  open: boolean;
  setOpen: (state: boolean) => void;
};

export default function ChangeRoleModal({
  open,
  username,
  currentRoles,
  setOpen,
}: CreateUserModalProps) {
  const userContext = useContext(UserContext);
  const [newRoles, setUserRoles] = useState<string[]>(currentRoles);
  const [errorMsg, setErrorMsg] = useState("");
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    setUserRoles(currentRoles);
  }, [currentRoles]);

  const setRole = (roleKey: string) => {
    if (roleKey === Roles.ADMIN) {
      setUserRoles(Object.values(Roles));
    } else {
      setUserRoles([...newRoles, roleKey]);
    }
  };

  const removeRole = (roleKey: string) => {
    setUserRoles(newRoles.filter((role) => role !== roleKey));
  };

  const submit = async () => {
    const response = await changeRoles(
      userContext.username,
      username,
      newRoles
    );
    const json = await response.json();
    if (response.status === 200) {
      alert(json.message);
      setOpen(false);
    }
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
            <div className="inline-block align-bottom bg-white rounded-lg px-2 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="flex items-center justify-start mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <CogIcon
                    className="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Change roles
                  </Dialog.Title>
                </div>
              </div>
              <div className="mt-4">
                {Object.keys(Roles).map((key) => {
                  const roleKey = key as keyof typeof Roles;
                  return (
                    <RoleToggle
                      name={Roles[roleKey]}
                      checked={newRoles.includes(Roles[roleKey])}
                      set={() => setRole(Roles[roleKey])}
                      remove={() => removeRole(Roles[roleKey])}
                    />
                  );
                })}
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
                  data-tooltip-target="tooltip-default"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
                <div
                  id="tooltip-default"
                  role="tooltip"
                  className="tooltip absolute z-10 inline-block rounded-lg bg-gray-900 font-medium shadow-sm text-white py-2 px-3 text-sm duration-300 invisible dark:bg-gray-700"
                >
                  Tooltip content
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-white font-medium hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={submit}
                  ref={cancelButtonRef}
                >
                  Change user roles
                </button>
              </div>
              {errorMsg && <ErrorComponent errorMessage={errorMsg} />}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
