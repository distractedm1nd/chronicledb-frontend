import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  BloomFilter,
  DefaultStreamConfig,
  EventNames,
  HashFunction,
  IEvent,
  StreamConfig,
} from "../../types/types";
import { PlusIcon, XCircleIcon } from "@heroicons/react/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import _ from "lodash";

export interface IStreamModalConfig {
  configState: StreamConfig;
  setConfigState: Dispatch<SetStateAction<StreamConfig>>;
}

export default function StreamModalConfig(props: IStreamModalConfig) {
  let { configState, setConfigState } = props;
  const [eventType, setEventType] = useState<string>("Raw");
  const [dataType, setDataType] = useState<string>("Integer");
  const [storage, setStorage] = useState<string>("8");
  const [data, setData] = useState<any>();
  const [currentEvent, setCurrentEvent] = useState<IEvent>();
  const [compoundEvents, setCompoundEvents] = useState<IEvent[]>([]);
  const [tooltipstatus, setTooltipStatus] = useState(0);

  const [lightweightIndexType, setLightweightIndexType] = useState<"SMA" | "BloomFilter">("SMA");
  const [currentSMA, setCurrentSMA] = useState<{cnt: number, sum: number, min: number, max: number}>({cnt: 0, sum: 0, min: 0, max: 0});
  const [currentBloomFilter, setCurrentBloomFilter] = useState<{count: number, k: number}>({count: 0, k: 0});
  const [currentHashFunctions, setCurrentHashFunctions] = useState<HashFunction[]>([]);

  useEffect(() => {
    // @ts-ignore
    let dataOptions = EventNames[eventType];
    let storageOptions = dataOptions[dataType];
    if (dataType in dataOptions && storage in storageOptions) {
      setCurrentEvent({ [storageOptions[storage]]: data });
    } else if (dataType in dataOptions) {
      setStorage(Object.keys(storageOptions)[0]);
    } else {
      setDataType(Object.keys(dataOptions)[0]);
    }
  }, [eventType, dataType, storage, data]);

  useEffect(() => {
    console.log(currentHashFunctions.length, currentBloomFilter.k, currentHashFunctions)
    if(currentBloomFilter.k == 0) {
      setCurrentHashFunctions([])
    }
    else if(currentHashFunctions.length > currentBloomFilter.k) {
      setCurrentHashFunctions(currentHashFunctions.splice(currentBloomFilter.k - 1))
    }
    else if(currentHashFunctions.length < currentBloomFilter.k && currentBloomFilter.k) {
      var temp = [...currentHashFunctions]
      for (let index = 0; index < currentBloomFilter.k - currentHashFunctions.length; index++) {
        temp.push({a: 0, b: 0})
      }
      setCurrentHashFunctions(temp);
    }
  }, [currentBloomFilter])

  useEffect(() => {
    let eventToSend =
      compoundEvents.length > 1 ? { Compound: compoundEvents } : currentEvent;
    if (eventToSend) setConfigState({ ...configState, Event: [eventToSend] });
  }, [currentEvent, compoundEvents]);

  return (
    <form className="mt-2 space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              These are the default settings for your stream.
            </p>
          </div>

          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div role="group" aria-labelledby="label-notifications">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                <div>
                  <div
                    className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                    id="label-notifications"
                  >
                    Log
                  </div>
                </div>
                <div className="sm:col-span-2">
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="log-false"
                          name="log-state"
                          type="radio"
                          onClick={() =>
                            setConfigState({ ...configState, Log: false })
                          }
                          onMouseEnter={() => setTooltipStatus(4)}
                          onMouseLeave={() => setTooltipStatus(0)}
                          checked={!configState.Log}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor="log-false"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          false
                        </label>
                        {tooltipstatus == 4 && (
                        <div role="tooltip" className="z-20 mx-4 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                          <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                                        <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                          </svg>
                          <p className="text-sm font-medium text-white ">Enables logs across the system, if log set to true. Otherwise logs are disabled.</p>
                        </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <input
                          id="log-true"
                          name="log-state"
                          type="radio"
                          onClick={() =>
                            setConfigState({ ...configState, Log: true })
                          }
                          checked={configState.Log}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor="log-true"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          true
                        </label>
                      </div>
                    </div>
                </div>
              </div>
            </div>

            <div role="group" aria-labelledby="label-notifications">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                <div>
                  <div
                    className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                    id="label-notifications"
                  >
                    Debug
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="max-w-lg">
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="debug-false"
                          name="debug-state"
                          type="radio"
                          onClick={() =>
                            setConfigState({ ...configState, Debug: false })
                          }
                          onMouseEnter={() => setTooltipStatus(5)}
                          onMouseLeave={() => setTooltipStatus(0)}
                          checked={!configState.Debug}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        {tooltipstatus == 5 && (
                        <div role="tooltip" className="z-20 mx-4 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                          <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                                        <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                          </svg>
                          <p className="text-sm font-medium text-white ">All the dynamic TAB+Index optimized sizes are discarded and the minimum size for the nodes is used instead, if set to true.</p>
                        </div>
                        )}
                        <label
                          htmlFor="debug-false"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          false
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="debug-true"
                          name="debug-state"
                          type="radio"
                          onClick={() =>
                            setConfigState({ ...configState, Debug: true })
                          }
                          checked={configState.Debug}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor="debug-true"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          true
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="data"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Data
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="mt-1 relative sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    name="data"
                    id="data"
                    value={configState.Data}
                    // TODO: parse to array
                    onChange={(e) =>
                      setConfigState({ ...configState, Data: [e.target.value] })
                    }
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div
                  className= "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-auto"
                  onMouseEnter={()=> setTooltipStatus(3)}
                  onMouseLeave={()=> setTooltipStatus(0)} >
                    <div className="cursor-pointer">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    {tooltipstatus == 3 && (
                      <div role="tooltip" className="z-20 -mt-0 w-64 absolute transition duration-150 ease-in-out left-0 ml-8 shadow-lg bg-gray-900 p-4 rounded" >
                        <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                                        <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                          </svg>
                        <p className="text-sm font-medium text-white ">
                          Data files.
                        </p>
                        <p className="text-sm font-medium text-white " >data = C:\dataFile1 .</p>
                        <p className="text-sm font-medium text-white " >data = I:\dataFile2 .</p>
                        <p className="text-sm font-medium text-white " >data = H:\dataFile3 .</p>
                        <p className="text-sm font-medium text-white " >Data = I:\data .</p>
                        <p className="text-sm font-medium text-white " >Data = data1.</p>
                      </div>
                    )}{" "}
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                htmlFor="translation"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Translation
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
              <div className="mt-1 relative sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    name="translation"
                    id="translation"
                    value={configState.Translation}
                    // TODO: parse to array
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        Translation: e.target.value,
                      })
                    }
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                  </div>
                  <div
                  className= "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-auto"
                  onMouseEnter={()=> setTooltipStatus(2)}
                  onMouseLeave={()=> setTooltipStatus(0)} >
                    <div className="cursor-pointer">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    {tooltipstatus == 2 && (
                      <div role="tooltip" className="z-20 -mt-0 w-64 absolute transition duration-150 ease-in-out left-0 ml-8 shadow-lg bg-gray-900 p-4 rounded" >
                        <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                                        <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                          </svg>
                        <p className="text-sm font-medium text-white ">Translation file.</p>
                        <p className="text-sm font-medium text-white " >This is used to serialize the rightFlank on a clean system shutdown.</p>
                      </div>
                    )}{" "}
                </div>
                </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                htmlFor="translation"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Boot
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="mt-1 relative sm:mt-0 sm:col-span-2">
                <input
                  data-tooltip-target="tooltip-default"
                  type="text"
                  name="boot"
                  id="boot"
                  value={configState.Boot}
                  // TODO: parse to array
                  onChange={(e) =>
                    setConfigState({
                      ...configState,
                      Boot: e.target.value,
                    })
                  }
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
                </div>
                <div
                  className= "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-auto"
                  onMouseEnter={()=> setTooltipStatus(1)}
                  onMouseLeave={()=> setTooltipStatus(0)} >
                    <div className="cursor-pointer">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    {tooltipstatus == 1 && (
                      <div role="tooltip" className="z-20 -mt-0 w-64 absolute transition duration-150 ease-in-out left-0 ml-8 shadow-lg bg-gray-900 p-4 rounded" >
                        <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                                        <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                          </svg>
                        <p className="text-sm font-medium text-white ">Boot file</p>
                        <p className="text-sm font-medium text-white " >This is used to e.g. recover the system and contains information for loaders, such as NodeID counter and root NodeID.</p>
                      </div>
                    )}{" "}
                </div>
              </div>                
            </div>
            {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="right-flank"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Right Flank
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="right-flank"
                  id="right-flank"
                  value={configState}
                  onChange={(e) =>
                    setConfigState({
                      ...configState,
                      RightFlank: e.target.value,
                    })
                  }
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div> */}

            <div className="sm:grid sm:grid-cols-8 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200">
              <div className="sm:mt-0 sm:col-span-1">
                <label
                  htmlFor="eventType"
                  className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                >
                  Event Type
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={eventType}
                  onChange={(event) => setEventType(event.target.value)}
                >
                  {Object.keys(EventNames).map((name) => (
                    <option>{name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="translation"
                  className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                >
                  Datatype
                </label>
                <select
                  id="dataType"
                  name="dataType"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={dataType}
                  onChange={(event) => setDataType(event.target.value)}
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
                  className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                >
                  Storage
                </label>
                <select
                  id="dataType"
                  name="dataType"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={storage}
                  onChange={(event) => setStorage(event.target.value)}
                >
                  {
                    // @ts-ignore
                    dataType in EventNames[eventType] &&
                      // @ts-ignore
                      Object.keys(EventNames[eventType][dataType]).map(
                        (name) => <option>{name}</option>
                      )
                  }
                </select>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="data"
                  className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                >
                  Data
                </label>
                <div className={"flex w-full"}>
                  <input
                    type="text"
                    name="data"
                    id="data"
                    value={data}
                    onChange={(e) => {
                      var y: number = parseFloat(e.target.value)
                      if(Number.isNaN(y)){
                        console.log(e.target.value)
                        setData(e.target.value)
                      } else {
                        setData(y)}
                      }                      
                    }
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                  />
                  <div className="has-tooltip">
                    <button
                    type="button"
                    className="mt-1 ml-4 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-white font-medium hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() =>
                      currentEvent &&
                      setCompoundEvents([...compoundEvents, currentEvent])
                    }
                  >
                    <PlusIcon className={"h-4 my-auto"} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={"flex space-x-3"}>
              {compoundEvents.map((e, idx) => (
                <div className="flex p-2 bg-gray-100 rounded-md transform transition duration-100 hover:scale-110">
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
            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
              <p className="font-bold">Lightweight Indexes</p>
              {/* TODO: Add Indexes to array */}
              <div className="sm:grid sm:grid-cols-8 sm:gap-4 sm:items-start">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="translation"
                    className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                  >
                    Index Type
                  </label>
                  <select
                    id="dataType"
                    name="dataType"
                    className="mt-1 block w-full pl-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={lightweightIndexType}
                    onChange={(event) => event.target.value === "SMA" ? setLightweightIndexType(event.target.value) : setLightweightIndexType("BloomFilter")}
                  >
                    <option>SMA</option>
                    <option>BloomFilter</option>
                  </select>
                </div>
                {lightweightIndexType === "BloomFilter" ?
                  <React.Fragment>
                    <div className="sm:mt-0 sm:col-span-2">
                      <label
                        htmlFor="bitcount"
                        className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                      >
                        Bit Count
                      </label>
                      <input
                        id="bitcount"
                        type="number"
                        name="bitcount"
                        value={currentBloomFilter?.count}
                        onChange={(event) => currentBloomFilter && setCurrentBloomFilter({...currentBloomFilter, count: parseInt(event.target.value) || 0})}
                        className="mt-1 block pl-3 py-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="sm:mt-0 sm:col-span-2">
                      <label
                        htmlFor="hfcount"
                        className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                      >
                        Hash Function Count (k)
                      </label>
                      <input
                        id="hfcount"
                        type="number"
                        name="hfcount"
                        value={currentBloomFilter?.k}
                        onChange={(event) => currentBloomFilter && setCurrentBloomFilter({...currentBloomFilter, k: parseInt(event.target.value) || 0})}
                        className="mt-1 block pl-3 py-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <div className="sm:mt-0 sm:col-span-1">
                      <label
                        htmlFor="smacnt"
                        className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                      >
                        Count
                      </label>
                      <input
                        id="smacnt"
                        type="number"
                        name="smacnt"
                        value={currentSMA?.cnt}
                        onChange={(event) => currentSMA && setCurrentSMA({...currentSMA, cnt: parseInt(event.target.value) || 0})}
                        className="mt-1 block pl-3 py-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="sm:mt-0 sm:col-span-1">
                      <label
                        htmlFor="smasum"
                        className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                      >
                        Sum
                      </label>
                      <input
                        id="smasum"
                        type="number"
                        name="smasum"
                        value={currentSMA?.sum}
                        onChange={(event) => currentSMA && setCurrentSMA({...currentSMA, sum: parseInt(event.target.value) || 0})}
                        className="mt-1 block pl-3 py-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="sm:mt-0 sm:col-span-1">
                      <label
                        htmlFor="smamin"
                        className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                      >
                        Min
                      </label>
                      <input
                        id="smamin"
                        type="number"
                        name="smamin"
                        value={currentSMA?.min}
                        onChange={(event) => currentSMA && setCurrentSMA({...currentSMA, min: parseInt(event.target.value) || 0})}
                        className="mt-1 block pl-3 py-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="sm:mt-0 sm:col-span-1">
                      <label
                        htmlFor="smamax"
                        className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                      >
                        Max
                      </label>
                      <input
                        id="smamax"
                        type="number"
                        name="smamax"
                        value={currentSMA?.max}
                        onChange={(event) => currentSMA && setCurrentSMA({...currentSMA, max: parseInt(event.target.value) || 0})}
                        className="mt-1 block pl-3 py-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </React.Fragment>
                }
              </div>
                <div className={"flex flex-col"}>
                  {currentBloomFilter?.k > 0 && <p className="font-bold">Hash Function Configuration</p>}
                  {currentHashFunctions.map((e, idx) => (
                    <div className="flex my-auto">
                      <div className="w-full">
                        <label
                          htmlFor="a"
                          className="relative top-3 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                        >
                          a
                        </label>
                          <input
                            id="a"
                            key={idx}
                            type="text"
                            name="a"
                            value={e.a}
                            onChange={(event) => {
                              var temp = [...currentHashFunctions];
                              temp.splice(idx, 1, {a: parseInt(event.target.value) || 0, b: e.b})
                              setCurrentHashFunctions(temp);
                            }}
                            className="w-full block pl-3 py-2 mr-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                          />
                      </div>
                      <div className="w-full ml-2">
                        <label
                          htmlFor="b"
                          className="relative top-3 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                        >
                          b
                        </label>
                        <input
                          id="b"
                          key={idx}
                          type="text"
                          name="b"
                          value={e.b}
                          onChange={(event) => {
                            var temp = [...currentHashFunctions];
                            temp.splice(idx, 1, {b: parseInt(event.target.value) || 0, a: e.a})
                            setCurrentHashFunctions(temp);
                          }}
                          className="w-full block pl-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <XCircleIcon
                        className="ml-2 relative my-auto top-3 w-10 text-red-500 cursor-pointer transform transition duration-100 hover:scale-110"
                        onClick={() => {
                          const temp = [...currentHashFunctions];
                          temp.splice(idx, 1);
                          setCurrentHashFunctions(temp);
                          setCurrentBloomFilter({...currentBloomFilter, k: currentBloomFilter.k - 1});
                        }}
                      />
                    </div>
                  ))}
                </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="multiple-disk-max-queue-number"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Multiple Disk Queue Checkpoint
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2" >
                <div className="mt-4 flex space-x-20 items-center">
                  <input
                    type="number"
                    name="multiple-disk-max-queue-number"
                    id="multiple-disk-max-queue-number"
                    value={configState.MultipleDiskMaxQueue}
                    onMouseEnter={() => setTooltipStatus(6)}
                    onMouseLeave={() => setTooltipStatus(0)}
                    onChange={(e) => {
                      let inputInt = parseInt(e.target.value);
                      if (
                        inputInt <
                        configState.MacroBlocksCache * configState.Data.length
                      ) {
                        setConfigState({
                          ...configState,
                          MultipleDiskMaxQueue: inputInt,
                        });
                      } else {
                        alert(
                          "This number must be much lower than MacroBlock Cache * number of data files."
                        );
                      }
                    }}
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    placeholder="100"
                  />
                  {tooltipstatus == 6 && (
                  <div role="tooltip" className="z-20 mx-4 mb-2 right-1 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                    <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                      <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                        <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                          <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                              <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <p className="text-sm font-medium text-white ">The number of MacroBlocks allowed to be queued on disk writer thread(s).</p>
                  </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="logical-block-size-number"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Logical Block Size
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="mt-4 flex space-x-10 items-center ">
                  <input
                    type="number"
                    step={"4096"}
                    name="logical-block-size-number"
                    id="logical-block-size-number"
                    value={configState.LogicalBlockSize}
                    onMouseEnter={() => setTooltipStatus(7)}
                    onMouseLeave={() => setTooltipStatus(0)}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        LogicalBlockSize: parseInt(e.target.value),
                      })
                    }
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    placeholder="8192"
                  />
                  {tooltipstatus == 7 && (
                  <div role="tooltip" className="z-20 mx-4 right-1 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                    <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                      <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                        <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                          <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                              <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <p className="text-sm text-white">
                      Number of bytes for an uncompressed serialized node.
                      <br />
                      Generally, this should match the I/O block size of the data files.
                      <br />
                      Can be an arbitrary numeric value like-wise.
                      <br />
                      l := Logical IO Block Size.
                      <br />
                      p := Phsysical IO Block Size.
                      <br />
                      {"<number>"} := {"<number>"} of bytes.
                      </p>
                      </div>
                  )}
                </div>
                <div className="border mt-4 border-red-400 rounded-b bg-red-100 max-w-xs px-3 py-2 text-red-700 rounded-md">
                  <p>WARNING: l and p not supported yet!</p>
                </div>
              </div>
            </div>

            <div className={"sm:border-t sm:border-gray-100 sm:pt-5"}>
              <p className={"font-bold"}>Macro Block Configuration</p>
              <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-center pt-3">
                <label
                  htmlFor="macro-block-size-number"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Size
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="mt-4 flex space-x-10 items-center">
                    <input
                      type="number"
                      min={1}
                      name="macro-block-size-number"
                      id="macro-block-size-number"
                      value={configState.MacroBlockSize}
                      onMouseEnter={() => setTooltipStatus(8)}
                      onMouseLeave={() => setTooltipStatus(0)}
                      onChange={(e) =>
                        setConfigState({
                          ...configState,
                          MacroBlockSize: parseInt(e.target.value),
                        })
                      }
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                      placeholder="10"
                    />
                    {tooltipstatus == 8 && (
                    <div role="tooltip" className="z-20 mx-4 right-20 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                      <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                          <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                            <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                              <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                              </g>
                            </g>
                         </g>
                       </g>
                      </svg>
                      <p className="text-sm text-white">
                        {/* TODO: Validation */}
                        Number of bytes for a MacroBlock. <br />
                        Denoted in a multiply of Logical Block Size. <br />
                        The multiply value must be a decimal number and never 0.
                      </p>
                    </div>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="macro-block-spare-number"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Spare
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">

                  <div className="mt-4 space-y-4">
                    <input
                      type="number"
                      step={"0.1"}
                      min={"0"}
                      max={"1.0"}
                      name="macro-block-spare-number"
                      id="macro-block-spare-number"
                      value={configState.MacroBlockSpare}
                      onMouseEnter={() => setTooltipStatus(9)} 
                      onMouseLeave={() => setTooltipStatus(0)}
                      onChange={(e) =>
                        setConfigState({
                          ...configState,
                          MacroBlockSpare: parseFloat(e.target.value),
                        })
                      }
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                      placeholder="10"
                    />
                    {tooltipstatus == 9 && (
                    <div role="tooltip" className="z-20 mx-4 right-1 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                      <p className="text-sm text-white">
                        Percent of spare space in a MacroBlock.
                      </p>
                    </div>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="macro-block-preallocation-number"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Preallocation
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="number"
                    name="macro-block-preallocation-number"
                    id="macro-block-preallocation-number"
                    value={configState.MacroBlockPreallocation}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        MacroBlockPreallocation: parseInt(e.target.value),
                      })
                    }
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder={configState.MacroBlockPreallocation.toString()}
                  />
                </div>
                <label
                  htmlFor="macro-block-batch-allocation-number"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Batch Allocation
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="number"
                    name="macro-block-batch-allocation-number"
                    id="macro-block-batch-allocation-number"
                    value={configState.MacroBlockBatchAllocation}
                    onMouseEnter={() => setTooltipStatus(10)} 
                    onMouseLeave={() => setTooltipStatus(0)}
                    onChange={(e) => {
                      console.log(e);
                      let intVal = parseInt(e.target.value);
                      let {
                        MacroBlockBatchAllocation,
                        MacroBlockPreallocation,
                      } = configState;
                      if (intVal > MacroBlockBatchAllocation) {
                        setConfigState({
                          ...configState,
                          MacroBlockBatchAllocation:
                            intVal >= MacroBlockPreallocation
                              ? intVal
                              : MacroBlockPreallocation,
                        });
                      } else {
                        setConfigState({
                          ...configState,
                          MacroBlockBatchAllocation:
                            intVal >= MacroBlockPreallocation ? intVal : 0,
                        });
                      }
                    }}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder={DefaultStreamConfig.MacroBlockBatchAllocation.toString()}
                  />
                </div>
              </div>
            </div>

            <div className={"sm:border-t sm:border-gray-100 sm:pt-5"}>
              <p className="font-bold">Cache Configuration</p>
              <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-center pt-3">
                <label
                  htmlFor="macro-block-cache-number"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Macro Blocks
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="mt-4 flex space-x-10 items-center">
                    <input 
                    type="number"
                    name="macro-block-cache-number"
                    id="macro-block-cache-number"
                    value={configState.MacroBlocksCache}
                    onMouseEnter={() => setTooltipStatus(11)} 
                    onMouseLeave={() => setTooltipStatus(0)}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        MacroBlocksCache: parseInt(e.target.value),
                      })
                    }                    
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder={DefaultStreamConfig.MacroBlocksCache.toString()}
                  />
                  {tooltipstatus == 11 && (
                    <div role="tooltip" className="z-20 mx-4 right-20 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                      <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                          <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                            <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                              <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                              </g>
                            </g>
                         </g>
                       </g>
                      </svg>
                      <p className="text-sm mt-2 text-white">
                        Number of MacroBlocks to keep in memory in LRU i.e. cache.
                      </p>
                    </div>
                  )}                  
                </div>
                </div>
                <label
                  htmlFor="nodes-cache-number"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Nodes
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="mt-4 flex space-y-10">
                  <input
                    type="number"
                    name="nodes-cache-number"
                    id="nodes-cache-number"
                    value={configState.NodesCache}
                    onMouseEnter={() => setTooltipStatus(12)} 
                    onMouseLeave={() => setTooltipStatus(0)}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        NodesCache: parseInt(e.target.value),
                      })
                    }
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder={DefaultStreamConfig.NodesCache.toString()}
                  />
                  {tooltipstatus == 12 && (
                    <div role="tooltip" className="z-20 mx-4 right-1 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                      <p className="text-sm px-1 py-1 text-white">
                        Number of Nodes to keep in memory in LRU i.e. cache.
                      </p>
                    </div>
                  )}  
                </div>
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="compressor"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Compressor
              </label>
              <div className="mt-4 space-y-4 col-span-2">
                <div>
                  <div className="flex items-center">
                    <input
                      id="compressor-none"
                      name="compressor"
                      type="radio"
                      onMouseEnter={() => setTooltipStatus(13)} 
                      onMouseLeave={() => setTooltipStatus(0)}
                      onClick={() =>
                        setConfigState({ ...configState, Compressor: "none" })
                      }
                      checked={configState.Compressor === "none"}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label
                      htmlFor="compressor-none"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      none
                    </label>
                    {tooltipstatus == 13 && (
                        <div role="tooltip" className="z-20 mx-4 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                          <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                                        <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                          </svg>
                          <p className="text-sm py-1 text-white">
                            Compression disabled.
                          </p>
                        </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <input
                      id="compressor-lz4-no-meta"
                      name="compressor"
                      type="radio"
                      onMouseEnter={() => setTooltipStatus(14)} 
                      onMouseLeave={() => setTooltipStatus(0)}
                      onClick={() =>
                        setConfigState({
                          ...configState,
                          Compressor: "LZ4_Fast_No_Meta",
                        })
                      }
                      checked={configState.Compressor === "LZ4_Fast_No_Meta"}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label
                      htmlFor="compressor-lz4-no-meta"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      LZ4 Fast No Meta
                    </label>
                    {tooltipstatus == 14 && (
                        <div role="tooltip" className="z-20 mx-4 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                          <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                                        <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                          </svg>
                          <p className="text-sm mt-2 text-white">
                            LZ4_fast_no_meta := Official LZ4 library is used with
                            options: Fast and no Meta size information. <br />
                            This version is ideal when using fixed sized l-blocks, which
                            an not overflow. <br />
                            Additionally, a c-block may never exceed the l-block size by
                            any means, hence it uses a fixed allocation for a
                            decompression buffer and may never overflow consequently.
                            </p>
                        </div>
                    )}
                  </div>
                  
                </div>
                <div>
                  <div className="flex items-center">
                    <input
                      id="compressor-lz4-with-meta"
                      name="compressor"
                      type="radio"
                      onMouseEnter={() => setTooltipStatus(15)} 
                      onMouseLeave={() => setTooltipStatus(0)}
                      onClick={() =>
                        setConfigState({
                          ...configState,
                          Compressor: "LZ4_Fast_With_Meta",
                        })
                      }
                      checked={configState.Compressor === "LZ4_Fast_With_Meta"}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label
                      htmlFor="compressor-lz4-with-meta"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      LZ4 Fast With Meta
                    </label>
                    {tooltipstatus == 15 && (
                        <div role="tooltip" className="z-20 mx-4 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                          <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                                        <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                          </svg>
                          <p className="text-sm mt-2 text-white">
                            LZ4_Fast_With_Meta\t\t\t:= Official LZ4 library is used with
                            options: Fast and includes Meta size information. <br />
                            Note: This version will guarantee at any sizes, that the
                            compressor/decompressor allocates sufficient space, even if
                            provided with less allocation. This ensures dynamic l-blocks
                            of any sizes and allows different l-block sizes across the
                            "cold" vs. "warm" regions. <br />
                            This guarantee comes with a small penalty, hence should only
                            be used with caution.<br />
                            Later it is planned to switch dynamically between
                            compressors, to ensure cold regions benefit from widerl-blocks and the warm regions stay fast with alignedl-blocks.<br />The system does not support switching between compressors dynamically, yet.
                          </p>
                        </div>
                    )}
                  </div>
                  
                </div>
              </div>
              {configState.Compressor !== "none" && (
                <>
                  <label
                    htmlFor="compressor-extras"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Compressor extras
                  </label>
                  <div className="mt-4 space-y-4 col-span-2">
                    <div className="flex items-center">
                      <input
                        id="compressor-extras-none"
                        name="compressor-extras"
                        type="radio"
                        onClick={() =>
                          setConfigState({
                            ...configState,
                            CompressorExtras: { I32: "None" },
                          })
                        }
                        checked={configState.CompressorExtras.I32 === "None"}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label
                        htmlFor="compressor-extras-none"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        none
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="compressor-extras-int"
                        name="compressor-extras"
                        type="radio"
                        onClick={() =>
                          setConfigState({
                            ...configState,
                            CompressorExtras: {
                              I32: DefaultStreamConfig.CompressorExtras.I32,
                            },
                          })
                        }
                        checked={!(configState.CompressorExtras.I32 === "None")}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label
                        htmlFor="compressor-extras-int"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        <input
                          type="number"
                          name="compressor-extras-int"
                          id="compressor-extras-int"
                          value={configState.CompressorExtras.I32}
                          onChange={(e) =>
                            setConfigState({
                              ...configState,
                              CompressorExtras: {
                                I32: parseInt(e.target.value),
                              },
                            })
                          }
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                          placeholder={DefaultStreamConfig.CompressorExtras.I32.toString()}
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="river-threads"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                River threads
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className=" flex items-center">
                <input
                  type="text"
                  name="river-threads"
                  id="river-threads"
                  value={configState.RiverThreads}
                  onMouseEnter={() => setTooltipStatus(16)} 
                  onMouseLeave={() => setTooltipStatus(0)}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (
                      val === "0" ||
                      val === "t" ||
                      val === "c" ||
                      val === "d"
                    ) {
                      setConfigState({
                        ...configState,
                        RiverThreads: e.target.value,
                      });
                    } else {
                      // TODO: sollte besser ein dropdown sein, sonst muss mal weitere probleme wie die return taste etc. ausschalten
                      return alert(
                        "Please provide a value which is one of the following: 0, t, c, d"
                      );
                    }
                  }}
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
                {tooltipstatus == 16 && (
                        <div role="tooltip" className="z-20 mx-4 right-1 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                          <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                                        <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                          </svg>
                          <p className="text-sm mt-2 text-white">
                            Number of river threads in the delta. 0 := Pipeline bypassed.<br />
                            t := Number of CPU threads.<br />
                            c := Number of CPU cores.<br />
                            d := Default number threads.
                          </p>
                        </div>
                    )}
              </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="max-delta-queue"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Max delta queue
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                <input
                  type="number"
                  name="max-delta-queue"
                  id="max-delta-queue"
                  value={configState.MaxDeltaQueue}
                  onMouseEnter={() => setTooltipStatus(17)} 
                  onMouseLeave={() => setTooltipStatus(0)}
                  onChange={(e) => {
                    let intVal = parseInt(e.target.value);
                    if (
                      intVal * configState.MultipleDiskMaxQueue <
                      configState.MacroBlocksCache
                    ) {
                      setConfigState({
                        ...configState,
                        MaxDeltaQueue: intVal,
                      });
                    } else {
                      alert(
                        "This value * number of disks must be always smaller than MacroBlocksCache."
                      );
                    }
                  }}
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  placeholder={DefaultStreamConfig.MaxDeltaQueue.toString()}
                />
                {tooltipstatus == 17 && (
                        <div role="tooltip" className="z-20 mx-4 right-1 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded" >
                          <svg className="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#000000">
                                        <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                                            <g id="Group-2" transform="translate(24.000000, 0.000000)">
                                                <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                          </svg>
                          <p className="text-sm mt-2 text-white">
                            Number of jobs to queue in the delta before blocking. <br />
                            Larger queues may enhance performance, but require longer
                            syncing, when shutdown.
                            </p>
                        </div>
                 )}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* divider before buttons*/}
      <div className="pt-2"></div>
    </form>
  );
}
