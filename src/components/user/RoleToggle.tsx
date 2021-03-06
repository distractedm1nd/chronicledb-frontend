import { Switch } from "@headlessui/react";
import React from "react";

import { classNames } from "../../utils";

type RoleToggleType = {
  name: string;
  checked: boolean;
  set: () => void;
  remove: () => void;
};

export default function RoleToggle({
  name,
  checked,
  set,
  remove,
}: RoleToggleType) {
  return (
    <Switch.Group as="div" className={"flex mt-4 items-center"}>
      <Switch.Label as="span" className="w-20 mr-4">
        <span className="text-sm mr-14 font-medium text-gray-900 dark:text-gray-300 ">{name}</span>
      </Switch.Label>
      <Switch
        checked={checked}
        onChange={checked ? remove : set}
        className={classNames(
          checked ? "bg-indigo-600 dark:bg-indigo-700" : "bg-gray-200 dark:bg-gray-600",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            checked ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
