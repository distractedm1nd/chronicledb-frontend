import React, {Fragment, useEffect, useRef, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {CogIcon} from "@heroicons/react/outline";
import StreamModalConfig from "./StreamModalConfig";
import {createStream, insertOrdered} from "../../utils";
import {DefaultStreamConfig, EventNames, IEvent} from "../../types/types";
import {PlusIcon, XCircleIcon} from "@heroicons/react/solid";
import Modal from "../Modal";
import { ip } from "../../types/types";
import TableModal from "../TableModal";

type QueryTimeTravelModalProps = {
    open: boolean;
    setOpen: (state: boolean) => void;
    currentStream: any;
};

const QueryTimeTravelModal = ({open, setOpen, currentStream}: QueryTimeTravelModalProps) => {
    
    const cancelButtonRef = useRef(null);
    const [timestamp, setTimestamp] = useState<number>(0);
    const [margin, setMargin] = useState<string>("Exclusive");
    const [intervalStart, setIntervalStart] = useState<number>(0);
    const [intervalEnd, setIntervalEnd] = useState<number>(1);
    const [modalBody, setModalBody] = useState<string>("[]");
    const [modalTitle, setModalTitle] = useState("Loading...");
    const [infoTableModalOpen, setInfoTableModalOpen] = useState(false);

    const queryTimeTravel =(streamId: number, margin: string, start: number, end:number) => {
        setModalTitle("Query Time Travel: Stream " + streamId )
        setInfoTableModalOpen(true);
        fetch(`${ip}/query_time_travel/${streamId}`, {
            method:"POST",
            body: `{"${margin}": {"start":${start},"end": ${end}}}`,
        })
        .then((response) => response.text())
        .then((result) => {
            setModalBody(result);
            console.log(result);
            //console.log(JSON.parse(result));
        }
        )
        .catch((error) => console.log("error", error))
    }
    
    

    return (
        <div>
            <TableModal
                title={modalTitle}
                body={modalBody}
                buttonTitle={"Close"}
                open={infoTableModalOpen}
                setOpen={setInfoTableModalOpen}
            />
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
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium text-gray-900"
                                        >
                                            Query Time Travel : StreamID {currentStream}
                                        </Dialog.Title>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <form className="mt-2 space-y-8 divide-y divide-gray-200">
                                                    <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-center sm:border-gray-200">
                                                        <div className="sm:col-span-2 w-full">
                                                            <label
                                                                htmlFor="translation"
                                                                className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                                                            >
                                                                Margin
                                                            </label>
                                                            <select
                                                                id="Interval"
                                                                name="Interval"
                                                                className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                                value={margin}
                                                                onChange={(event) => setMargin(event.target.value)}
                                                            >
                                                                <option>Exclusive</option>
                                                                <option>Inclusive</option>
                                                            </select>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <label
                                                                htmlFor="translation"
                                                                className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                                                            >
                                                                Start
                                                            </label>
                                                            <input
                                                                id="IntervalStart"
                                                                name="IntervalStart"
                                                                type="number"
                                                                className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                                value={intervalStart}
                                                                onChange={(event) => setIntervalStart(parseInt(event.target.value))}
                                                            >
                                                            </input>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <label
                                                                htmlFor="translation"
                                                                className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                                                            >
                                                                End
                                                            </label>
                                                            <input
                                                                id="IntervalEnd"
                                                                name="IntervalEnd"
                                                                type="number"
                                                                className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                                value={intervalEnd}
                                                                onChange={(event) => setIntervalEnd(parseInt(event.target.value))}
                                                            >
                                                            </input>
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
                                        onClick={() => {queryTimeTravel(currentStream, margin, intervalStart, intervalEnd)}}
                                        ref={cancelButtonRef}
                                    >
                                        search
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
    </Transition.Root>
    </div>)
}

export default QueryTimeTravelModal;