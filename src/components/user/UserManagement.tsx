import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { api, ip, User } from "../../types/types";
import { classNames, recoverStreamSnapshot, shutdownStream } from "../../utils";
import CreateStreamModal from "../dashboard/CreateStreamModal";
import Modal from "../Modal";
import InsertEventModal from "../dashboard/InsertEventModal";
import QueryTimeTravelModal from "../dashboard/QueryTimeTravelModal";
import CreateUserModal from "./CreateUserModal";
import { useNavigate } from "react-router-dom";
import ChangeRoleModal from "./ChangeRoleModal";
import Notification from "../Notification";

export default function UserManagement() {
  const [currentStream, setCurrentStream] = useState<number>(0);
  const [modalOpen, setModalState] = useState(false);
  const [notification, setNotification] = useState({
    shown: false,
    title: "",
    message: "",
  });
  const [userRolesModalOpen, setUserRolesModalOpenState] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditetUser] = useState<{
    username: string;
    roles: string[];
  }>({ username: "", roles: [] });
  const [extraStreamInfo, setExtraStreamInfo] = useState<{
    [key in number]: any;
  }>({});
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [insertEventModalOpen, setInsertEventModalOpen] = useState(false);
  const [queryTimeTravelModalOpen, setQueryTimeTravelModalOpen] =
    useState(false);
  const [modalBody, setModalBody] = useState("");
  const [modalTitle, setModalTitle] = useState("Loading...");
  const navigate = useNavigate();

  const UserActions = [
    {
      name: "Delete user",
      onClick: (user: User) => {
        deleteUser(user);
      },
    },
    {
      name: "Edit roles",
      onClick: (user: User) => {
        setEditetUser({ username: user.username, roles: user.roles });
        setUserRolesModalOpenState(true);
      },
    },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    const state = JSON.parse(savedUser);
    setActiveUser(state.username);
    setUserRoles(state.roles);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [modalOpen, userRolesModalOpen]);

  /*   useEffect(() => {
    fetchExtraStreamInfo(availableStreams);
  }, [availableStreams]); */

  const fetchUsers = () => {
    fetch(`${api}/get-users`)
      .then((response) => response.json())
      .then((result) => {
        setUsers(result.users);
      })
      .catch((error) => console.log("error", error));
  };

  if (!userRoles.includes("admin")) {
    return (
      <div className="flex w-full mt-10 items-center justify-center">
        <p className="text-red-700 font-bold">
          You don't have permissions the manage the users
        </p>
      </div>
    );
  }

  const deleteUser = async (user: User) => {
    const response = await fetch(api + "/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caller: activeUser,
        username: user.username,
        roles: user.roles,
        askedPermission: "admin",
      }),
    });
    let resJSON = await response.json();

    if (response.status === 200) {
      fetchUsers();
      setNotification({
        shown: true,
        title: "User successfully deleted",
        message: "The user was successfully deleted.",
      });
    }
  };

  const resetPassword = async (username: string) => {
    const response = await fetch(api + "/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caller: activeUser,
        username: username,
        askedPermission: "admin",
      }),
    });
    let resJSON = await response.json();

    if (response.status === 200) {
      setNotification({
        shown: true,
        title: "Password successfully resetted",
        message: "The password was successfully resetted.",
      });
    }
  };

  return (
    <>
      <CreateUserModal
        open={modalOpen}
        setOpen={(val: any) => setModalState(val)}
      />
      <ChangeRoleModal
        username={editUser.username}
        currentRoles={editUser.roles}
        open={userRolesModalOpen}
        setOpen={(val: any) => setUserRolesModalOpenState(val)}
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
            <h1 className="text-2xl font-semibold text-gray-900 my-auto">
              User Management
            </h1>
            <button
              onClick={() => {
                setModalState(true);
              }}
              className="flex px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800"
            >
              Create User
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
                    <span className="lg:pl-2">User</span>
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="lg:pl-2">Roles</span>
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="lg:pl-2">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-3 w-2/3 max-w-0 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center space-x-3 lg:pl-2">
                        <span className="text-gray-500 font-normal">
                          {user.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-center text-sm font-normal">
                      <button
                        className={classNames(
                          "text-xs font-normal text-gray-700"
                        )}
                        onClick={() => console.log("jo")}
                      >
                        {user.roles.join(", ")}
                      </button>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-center text-sm font-normal">
                      <span className="relative inline-flex shadow-sm rounded-md">
                        <button
                          type="button"
                          className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-normal text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800"
                          onClick={() => resetPassword(user.username)}
                        >
                          Reset Password
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
                                {UserActions.map((item) => {
                                  if (
                                    user.roles.includes("admin") &&
                                    item.name === "Delete user"
                                  )
                                    return null;
                                  return (
                                    <Menu.Item key={item.name}>
                                      {({ active }) => (
                                        <button
                                          onClick={() => item.onClick(user)}
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
                                  );
                                })}
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
      <Notification
        shown={notification.shown}
        title={notification.title}
        message={notification.message}
        toggleNotification={(val: boolean) =>
          setNotification({ ...notification, shown: false })
        }
      />
    </>
  );
}
