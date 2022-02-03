import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  BloomFilter,
  compressor,
  compressorExtras,
  DefaultStreamConfig,
  EventNames,
  HashFunction,
  IEvent,
  LightweightIndex,
  StreamConfig,
} from "../../types/types";
import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { Switch } from "@headlessui/react";
import _ from "lodash";
import {
  ChevronDownIcon,
  ExclamationCircleIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";

export interface IStreamModalConfig {
  configState: StreamConfig;
  setConfigState: Dispatch<SetStateAction<StreamConfig>>;
}

export default function StreamModalConfig(props: IStreamModalConfig) {
  let { configState, setConfigState } = props;
  const [leafCompressorExtras, setLeafCompressorExtras] =
    useState<compressorExtras>("None");
  const [indexCompressorExtras, setIndexCompressorExtras] =
    useState<compressorExtras>("None");
  const [leafLz4LevelCompressor, setLeafLz4LevelCompressor] =
    useState<number>(12);
  const [IndexLz4LevelCompressor, setIndexLz4LevelCompressor] =
    useState<number>(12);
  const [leafSprintzValue, setLeafSprintzValue] =
    useState<string>("true,12,false");
  const [indexSprintzValue, setIndexSprintzValue] =
    useState<string>("true,12,false");
  const [eventType, setEventType] = useState<string>("Raw");
  const [dataType, setDataType] = useState<string>("Integer");
  const [storage, setStorage] = useState<string>("8");
  const [data, setData] = useState<string>("");
  const [dataList, setDataList] = useState<number[]>([]);
  const [rawData, setRawData] = useState<number>(360);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [currentEvent, setCurrentEvent] = useState<IEvent>();
  const [compoundEvents, setCompoundEvents] = useState<IEvent[]>([]);
  const [tooltipstatus, setTooltipStatus] = useState(0);
  const [currentIndex, setIndex] = useState<LightweightIndex>();
  const [lightweightIndexType, setLightweightIndexType] = useState<
    "SMA" | "BloomFilter"
  >("SMA");
  const [currentSMA, setCurrentSMA] = useState<{
    cnt: number;
    sum: number;
    min: number;
    max: number;
  }>({ cnt: 0, sum: 0, min: 0, max: 0 });
  const [currentBloomFilter, setCurrentBloomFilter] = useState<{
    count: number;
    k: number;
  }>({ count: 0, k: 0 });
  const [currentHashFunctions, setCurrentHashFunctions] = useState<
    HashFunction[]
  >([]);
  const [currentProjector, setCurrentProjector] = useState<
    "Mono" | "Empty" | { Slice: number[] }
  >({ Slice: [0] });
  const [bloomFilter, setBloomFilter] = useState<{
    bit_set: { bit_array: number[] };
    hash_functions: HashFunction[];
  }>({
    bit_set: { bit_array: [0] },
    hash_functions: currentHashFunctions,
  });
  const [sliceProjector, setSliceProjector] = useState<string>("1,1");

  useEffect(() => {
    var bitArray: number[] = [0];
    if (bloomFilter.bit_set.bit_array.length < currentBloomFilter.count) {
      for (
        let step = bloomFilter.bit_set.bit_array.length;
        step < currentBloomFilter.count;
        step++
      ) {
        bloomFilter.bit_set.bit_array.push(0);
      }
    }

    if (bloomFilter.hash_functions.length < currentBloomFilter.k) {
      bloomFilter.hash_functions = currentHashFunctions;
    }
    let aggregate =
      lightweightIndexType === "BloomFilter"
        ? { BloomFilter: bloomFilter }
        : { SMA: currentSMA };
    let projector_sequence = currentProjector;
    if (aggregate && projector_sequence) {
      setIndex({ aggregate, projector_sequence });
    }
  }, [
    currentBloomFilter,
    currentHashFunctions,
    lightweightIndexType,
    currentProjector,
    bloomFilter,
    currentSMA,
  ]);

  useEffect(() => {
    // @ts-ignore
    let dataOptions = EventNames[eventType];
    let storageOptions = dataOptions[dataType];
    if (dataType in dataOptions && storage in storageOptions) {
      if ((eventType === "Var" || eventType === "Const") && dataType != "String") {
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

  useEffect(() => {
    if (indexCompressorExtras || leafCompressorExtras) {
      setConfigState({
        ...configState,
        CompressorExtras: [leafCompressorExtras, indexCompressorExtras],
      });
    }
    console.log(configState);
  }, [indexCompressorExtras, leafCompressorExtras]);

  useEffect(() => {
    if (currentBloomFilter.k == 0) {
      setCurrentHashFunctions([]);
    } else if (currentHashFunctions.length > currentBloomFilter.k) {
      setCurrentHashFunctions(
        currentHashFunctions.splice(currentBloomFilter.k - 1)
      );
    } else if (
      currentHashFunctions.length < currentBloomFilter.k &&
      currentBloomFilter.k
    ) {
      var temp = [...currentHashFunctions];
      for (
        let index = 0;
        index < currentBloomFilter.k - currentHashFunctions.length;
        index++
      ) {
        temp.push({ a: 0, b: 0 });
      }
      setCurrentHashFunctions(temp);
    }
  }, [currentBloomFilter]);

  useEffect(() => {
    if (currentIndex) {
      setConfigState({ ...configState, LightweightIndex: currentIndex });
    }
  }, [currentIndex]);

  useEffect(() => {
    let eventToSend =
      compoundEvents.length > 1 ? { Compound: compoundEvents } : currentEvent;
    if (eventToSend) setConfigState({ ...configState, Event: [eventToSend] });
  }, [currentEvent, compoundEvents]);

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <form className="mt-2 space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-100">
              Stream default settings
            </p>
          </div>

          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div role="group" aria-labelledby="label-notifications">
              <div className="sm:grid sm:grid-cols-2 sm:gap-2 sm:items-baseline">
                <div className="sm:col-span-1 mx-auto">
                  <div className="mt-4 space-y-4">
                    <Switch.Group as="div" className={"flex items-center"}>
                      <Switch.Label as="span" className="mr-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Log{" "}
                        </span>
                      </Switch.Label>
                      <Switch
                        checked={configState.Log}
                        onChange={() =>
                          setConfigState({
                            ...configState,
                            Log: !configState.Log,
                          })
                        }
                        className={classNames(
                          configState.Log ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-300",
                          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            configState.Log ? "translate-x-5" : "translate-x-0",
                            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                          )}
                        />
                      </Switch>
                    </Switch.Group>
                    <div className="flex items-center">
                      {tooltipstatus == 4 && (
                        <div
                          role="tooltip"
                          className="z-20 mx-4 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 dark:bg-gray-200 p-4 rounded"
                        >
                          <svg
                            className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                            width="9px"
                            height="16px"
                            viewBox="0 0 9 16"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <g
                              id="Page-1"
                              stroke="none"
                              strokeWidth={1}
                              fill="none"
                              fillRule="evenodd"
                            >
                              <g
                                id="Tooltips-"
                                transform="translate(-874.000000, -1029.000000)"
                                fill="#000000"
                              >
                                <g
                                  id="Group-3-Copy-16"
                                  transform="translate(850.000000, 975.000000)"
                                >
                                  <g
                                    id="Group-2"
                                    transform="translate(24.000000, 0.000000)"
                                  >
                                    <polygon
                                      id="Triangle"
                                      transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                      points="4.5 57.5 12.5 66.5 -3.5 66.5"
                                    />
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                          <p className="text-sm font-medium text-white ">
                            Enables logs across the system, if log set to true.
                            Otherwise logs are disabled.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-1 mx-auto">
                  <div className="max-w-lg">
                    <div className="mt-4 space-y-4">
                      <Switch.Group as="div" className={"flex items-center"}>
                        <Switch.Label as="span" className="mr-3">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Debug{" "}
                          </span>
                        </Switch.Label>
                        <Switch
                          checked={configState.Debug}
                          onChange={() =>
                            setConfigState({
                              ...configState,
                              Debug: !configState.Debug,
                            })
                          }
                          className={classNames(
                            configState.Debug ? "bg-indigo-600" : "bg-gray-200",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              configState.Debug
                                ? "translate-x-5"
                                : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                      {tooltipstatus == 5 && (
                        <div
                          role="tooltip"
                          className="z-20 mx-4 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded"
                        >
                          <svg
                            className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                            width="9px"
                            height="16px"
                            viewBox="0 0 9 16"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <g
                              id="Page-1"
                              stroke="none"
                              strokeWidth={1}
                              fill="none"
                              fillRule="evenodd"
                            >
                              <g
                                id="Tooltips-"
                                transform="translate(-874.000000, -1029.000000)"
                                fill="#000000"
                              >
                                <g
                                  id="Group-3-Copy-16"
                                  transform="translate(850.000000, 975.000000)"
                                >
                                  <g
                                    id="Group-2"
                                    transform="translate(24.000000, 0.000000)"
                                  >
                                    <polygon
                                      id="Triangle"
                                      transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                      points="4.5 57.5 12.5 66.5 -3.5 66.5"
                                    />
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                          <p className="text-sm font-medium text-white ">
                            All the dynamic TAB+Index optimized sizes are
                            discarded and the minimum size for the nodes is used
                            instead, if set to true.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="data"
                className="flex text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2 inset-y-0 items-center pointer-events-auto"
              >
                Data file
              </label>
              <div className="mt-1 relative rounded-md shadow-sm sm:col-span-1">
                <div className="mt-1 relative sm:mt-0">
                  <input
                    type="text"
                    name="data"
                    id="data"
                    value={configState.Data}
                    // TODO: parse to array
                    onChange={(e) =>
                      setConfigState({ ...configState, Data: [e.target.value] })
                    }
                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-500 dark:text-gray-100 dark:bg-gray-700 rounded-md"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-auto"
                    onMouseEnter={() => setTooltipStatus(3)}
                    onMouseLeave={() => setTooltipStatus(0)}
                  >
                    <div className="cursor-pointer">
                      <QuestionMarkCircleIcon
                        className="h-5 w-5 text-gray-400 dark:text-gray-200"
                        aria-hidden="true"
                      />
                    </div>
                    {tooltipstatus == 3 && (
                      <div
                        role="tooltip"
                        className="z-20 -mt-0 w-64 absolute transition duration-150 ease-in-out left-0 ml-8 shadow-lg bg-gray-900 p-4 rounded"
                      >
                        <svg
                          className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                          width="9px"
                          height="16px"
                          viewBox="0 0 9 16"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <g
                            id="Page-1"
                            stroke="none"
                            strokeWidth={1}
                            fill="none"
                            fillRule="evenodd"
                          >
                            <g
                              id="Tooltips-"
                              transform="translate(-874.000000, -1029.000000)"
                              fill="#000000"
                            >
                              <g
                                id="Group-3-Copy-16"
                                transform="translate(850.000000, 975.000000)"
                              >
                                <g
                                  id="Group-2"
                                  transform="translate(24.000000, 0.000000)"
                                >
                                  <polygon
                                    id="Triangle"
                                    transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                    points="4.5 57.5 12.5 66.5 -3.5 66.5"
                                  />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                        <p className="text-sm font-medium text-white ">
                          Data files.
                        </p>
                        <p className="text-sm font-medium text-white ">
                          data = C:\dataFile1 .
                        </p>
                        <p className="text-sm font-medium text-white ">
                          data = I:\dataFile2 .
                        </p>
                        <p className="text-sm font-medium text-white ">
                          data = H:\dataFile3 .
                        </p>
                        <p className="text-sm font-medium text-white ">
                          Data = I:\data .
                        </p>
                        <p className="text-sm font-medium text-white ">
                          Data = data1.
                        </p>
                      </div>
                    )}{" "}
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                htmlFor="translation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
              >
                Translation
              </label>
              <div className="mt-1 relative rounded-md shadow-sm sm:col-span-1">
                <div className="mt-1 relative sm:mt-0">
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
                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-500 dark:text-gray-100 dark:bg-gray-700 rounded-md"
                  />
                </div>
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-auto"
                  onMouseEnter={() => setTooltipStatus(2)}
                  onMouseLeave={() => setTooltipStatus(0)}
                >
                  <div className="cursor-pointer">
                    <QuestionMarkCircleIcon
                      className="h-5 w-5 text-gray-400 dark:text-gray-200"
                      aria-hidden="true"
                    />
                  </div>
                  {tooltipstatus == 2 && (
                    <div
                      role="tooltip"
                      className="z-20 -mt-0 w-64 absolute transition duration-150 ease-in-out left-0 ml-8 shadow-lg bg-gray-900 p-4 rounded"
                    >
                      <svg
                        className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                        width="9px"
                        height="16px"
                        viewBox="0 0 9 16"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <g
                            id="Tooltips-"
                            transform="translate(-874.000000, -1029.000000)"
                            fill="#000000"
                          >
                            <g
                              id="Group-3-Copy-16"
                              transform="translate(850.000000, 975.000000)"
                            >
                              <g
                                id="Group-2"
                                transform="translate(24.000000, 0.000000)"
                              >
                                <polygon
                                  id="Triangle"
                                  transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                  points="4.5 57.5 12.5 66.5 -3.5 66.5"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <p className="text-sm font-medium text-white ">
                        Translation file.
                      </p>
                      <p className="text-sm font-medium text-white ">
                        This is used to serialize the rightFlank on a clean
                        system shutdown.
                      </p>
                    </div>
                  )}{" "}
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                htmlFor="translation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
              >
                Boot
              </label>
              <div className="mt-1 relative rounded-md shadow-sm sm:col-span-1">
                <div className="mt-1 relative sm:mt-0">
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
                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-500 rounded-md"
                  />
                </div>
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-auto"
                  onMouseEnter={() => setTooltipStatus(1)}
                  onMouseLeave={() => setTooltipStatus(0)}
                >
                  <div className="cursor-pointer">
                    <QuestionMarkCircleIcon
                      className="h-5 w-5 text-gray-400 dark:text-gray-200"
                      aria-hidden="true"
                    />
                  </div>
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

            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
              <p className="font-bold dark:text-gray-100">Events</p>
              <div className="sm:grid sm:grid-cols-8 sm:gap-4 sm:items-start">
                <div className="sm:mt-0 sm:col-span-1">
                  <label
                    htmlFor="eventType"
                    className="relative top-4 left-2 bg-white rounded-md dark:bg-gray-700 -mt-px inline-block px-1 text-xs font-medium text-gray-400 dark:text-gray-200"
                  >
                    Event Type
                  </label>
                  <select
                    id="eventType"
                    name="eventType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                    className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                  >
                    Datatype
                  </label>
                  <select
                    id="dataType"
                    name="dataType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                    className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400 dark:text-gray-100 dark:bg-gray-700 rounded-md"
                  >
                    Storage
                  </label>
                  <select
                    id="dataType"
                    name="dataType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                        var y:number = parseFloat(event.target.value)
                        if (!Number.isNaN(y)) {
                          setRawData(y)
                        }
                        var dataArray: number[] = [];
                        var keys = event.target.value.split(",");

                        for (let i = 0; i < keys.length; i++) {
                          dataArray.push(parseFloat(keys[i]));
                        }

                        setDataList(dataArray);
                      }}
                      className="mt-1 block w-full shadow-sm dark:border-gray-500 dark:text-gray-100 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
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
              <div className={"flex space-x-3 mt-2"}>
                {compoundEvents.map((e, idx) => (
                  <div className="flex p-2 bg-gray-100 dark:bg-gray-500 rounded-md transform transition duration-100 hover:scale-110">
                    <p className="dark:text-gray-100">{JSON.stringify(e)}</p>
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

            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
              <p className="font-bold dark:text-gray-100">Lightweight Indexes</p>
              {/* TODO: Add Indexes to array */}
              <div className="sm:grid sm:grid-cols-8 sm:gap-4 sm:items-start">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="translation"
                    className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                  >
                    Index Type
                  </label>
                  <select
                    id="dataType"
                    name="dataType"
                    className="mt-1 block w-full pl-3 py-2 text-base border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={lightweightIndexType}
                    onChange={(event) =>
                      event.target.value === "SMA"
                        ? setLightweightIndexType(event.target.value)
                        : setLightweightIndexType("BloomFilter")
                    }
                  >
                    <option>SMA</option>
                    <option>BloomFilter</option>
                  </select>
                </div>
                {lightweightIndexType === "BloomFilter" ? (
                  <React.Fragment>
                    <div className="sm:mt-0 sm:col-span-2">
                      <label
                        htmlFor="bitcount"
                        className="relative top-4 left-2 bg-white dark:bg-gray-700 rounded-md dark:text-gray-100 -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                      >
                        Bit Count
                      </label>
                      <input
                        id="bitcount"
                        type="number"
                        name="bitcount"
                        value={currentBloomFilter?.count}
                        onChange={(event) =>
                          currentBloomFilter &&
                          setCurrentBloomFilter({
                            ...currentBloomFilter,
                            count: parseInt(event.target.value) || 0,
                          })
                        }
                        className="mt-1 block pl-3 py-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                      />
                    </div>
                    <div className="sm:mt-0 sm:col-span-2">
                      <label
                        htmlFor="hfcount"
                        className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-md -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                      >
                        Hash Function Count (k)
                      </label>
                      <input
                        id="hfcount"
                        type="number"
                        name="hfcount"
                        value={currentBloomFilter?.k}
                        onChange={(event) =>
                          currentBloomFilter &&
                          setCurrentBloomFilter({
                            ...currentBloomFilter,
                            k: parseInt(event.target.value) || 0,
                          })
                        }
                        className="mt-1 block pl-3 py-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                      />
                    </div>
                    <div className="sm:mt-0 sm:col-span-2">
                      <label
                        htmlFor="hfcount"
                        className="relative top-4 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400 dark:text-gray-100 dark:bg-gray-700 rounded-md"
                      >
                        Projector Sequence
                      </label>
                      <input
                        id="hfcount"
                        type="text"
                        name="hfcount"
                        value={sliceProjector}
                        onChange={(event) => {
                          setSliceProjector(event.target.value);
                          var projectorArray: number[] = [];
                          var keys = event.target.value.split(",");

                          for (let i = 0; i < keys.length; i++) {
                            projectorArray.push(parseInt(keys[i]));
                          }

                          setCurrentProjector({
                            Slice: projectorArray,
                          });
                        }}
                        className="mt-1 block pl-3 py-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-500 dark:text-gray-100 dark:bg-gray-700 rounded-md"
                      />
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="sm:mt-0 sm:col-span-4">
                      <label
                        htmlFor="hfcount"
                        className="relative top-4 left-2 bg-white dark:bg-gray-700 dark:text-gray-100 -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                      >
                        Projector Sequence
                      </label>
                      <input
                        id="hfcount"
                        type="text"
                        name="hfcount"
                        value={sliceProjector}
                        onChange={(event) => {
                          setSliceProjector(event.target.value);
                          var projectorArray: number[] = [];
                          var keys = event.target.value.split(",");

                          for (let i = 0; i < keys.length; i++) {
                            projectorArray.push(parseInt(keys[i]));
                          }

                          setCurrentProjector({
                            Slice: projectorArray,
                          });
                        }}
                        className="mt-1 block pl-3 py-2 w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-500 dark:text-gray-100 dark:bg-gray-700 rounded-md"
                      />
                    </div>
                  </React.Fragment>
                )}
              </div>
              <div className={"flex flex-col"}>
                {currentBloomFilter?.k > 0 && (
                  <p className="font-bold dark:text-gray-100">Hash Function Configuration</p>
                )}
                {currentHashFunctions.map((e, idx) => (
                  <div className="flex my-auto">
                    <div className="w-full">
                      <label
                        htmlFor="a"
                        className="relative top-3 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400 dark:bg-gray-700 dark:text-gray-100 rounded-md"
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
                          temp.splice(idx, 1, {
                            a: parseInt(event.target.value) || 0,
                            b: e.b,
                          });
                          setCurrentHashFunctions(temp);
                        }}
                        className="w-full block pl-3 py-2 mr-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:bg-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                      />
                    </div>
                    <div className="w-full ml-2">
                      <label
                        htmlFor="b"
                        className="relative top-3 left-2 bg-white -mt-px inline-block px-1 text-xs font-medium text-gray-400 dark:text-gray-100 dark:bg-gray-700 rounded-md"
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
                          temp.splice(idx, 1, {
                            b: parseInt(event.target.value) || 0,
                            a: e.a,
                          });
                          setCurrentHashFunctions(temp);
                        }}
                        className="w-full block pl-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-500 dark:text-gray-100 dark:bg-gray-700 rounded-md"
                      />
                    </div>
                    <XCircleIcon
                      className="ml-2 relative my-auto top-3 w-10 text-red-500 cursor-pointer transform transition duration-100 hover:scale-110"
                      onClick={() => {
                        const temp = [...currentHashFunctions];
                        temp.splice(idx, 1);
                        setCurrentHashFunctions(temp);
                        setCurrentBloomFilter({
                          ...currentBloomFilter,
                          k: currentBloomFilter.k - 1,
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="multiple-disk-max-queue-number"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
              >
                Multiple Disk Queue Checkpoint
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
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
                      setErrorFields(
                        errorFields.filter(
                          (e) => e !== "multiple-disk-max-queue-number"
                        )
                      );
                      setConfigState({
                        ...configState,
                        MultipleDiskMaxQueue: inputInt,
                      });
                    }}
                    onBlur={() => {
                      if (
                        configState.MultipleDiskMaxQueue >=
                        configState.MacroBlocksCache * configState.Data.length
                      ) {
                        setErrorFields([
                          ...errorFields,
                          "multiple-disk-max-queue-number",
                        ]);
                      }
                    }}
                    className={`max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md ${
                      errorFields.includes("multiple-disk-max-queue-number")
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        : ""
                    }`}
                    placeholder="100"
                  />
                  {tooltipstatus == 6 && (
                    <div
                      role="tooltip"
                      className="z-20 mx-4 mb-2 right-1 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded"
                    >
                      <svg
                        className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                        width="9px"
                        height="16px"
                        viewBox="0 0 9 16"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <g
                            id="Tooltips-"
                            transform="translate(-874.000000, -1029.000000)"
                            fill="#000000"
                          >
                            <g
                              id="Group-3-Copy-16"
                              transform="translate(850.000000, 975.000000)"
                            >
                              <g
                                id="Group-2"
                                transform="translate(24.000000, 0.000000)"
                              >
                                <polygon
                                  id="Triangle"
                                  transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                  points="4.5 57.5 12.5 66.5 -3.5 66.5"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <p className="text-sm font-medium text-white ">
                        The number of MacroBlocks allowed to be queued on disk
                        writer thread(s).
                      </p>
                    </div>
                  )}
                </div>
                {errorFields.includes("multiple-disk-max-queue-number") && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    This number must be lower than{" "}
                    {configState.MacroBlocksCache * configState.Data.length}{" "}
                    (MacroBlock Cache * number of data files).
                  </p>
                )}
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="logical-block-size-number"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
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
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                    placeholder="8192"
                  />
                  {tooltipstatus == 7 && (
                    <div
                      role="tooltip"
                      className="z-20 mx-4 right-1 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded"
                    >
                      <svg
                        className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                        width="9px"
                        height="16px"
                        viewBox="0 0 9 16"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <g
                            id="Tooltips-"
                            transform="translate(-874.000000, -1029.000000)"
                            fill="#000000"
                          >
                            <g
                              id="Group-3-Copy-16"
                              transform="translate(850.000000, 975.000000)"
                            >
                              <g
                                id="Group-2"
                                transform="translate(24.000000, 0.000000)"
                              >
                                <polygon
                                  id="Triangle"
                                  transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                  points="4.5 57.5 12.5 66.5 -3.5 66.5"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <p className="text-sm text-white">
                        Number of bytes for an uncompressed serialized node.
                        <br />
                        Generally, this should match the I/O block size of the
                        data files.
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
              <p className={"font-bold dark:text-gray-100"}>Macro Block Configuration</p>
              <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-center pt-3">
                <label
                  htmlFor="macro-block-size-number"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
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
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                      placeholder="10"
                    />
                    {tooltipstatus == 8 && (
                      <div
                        role="tooltip"
                        className="z-20 mx-4 right-20 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded"
                      >
                        <svg
                          className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                          width="9px"
                          height="16px"
                          viewBox="0 0 9 16"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <g
                            id="Page-1"
                            stroke="none"
                            strokeWidth={1}
                            fill="none"
                            fillRule="evenodd"
                          >
                            <g
                              id="Tooltips-"
                              transform="translate(-874.000000, -1029.000000)"
                              fill="#000000"
                            >
                              <g
                                id="Group-3-Copy-16"
                                transform="translate(850.000000, 975.000000)"
                              >
                                <g
                                  id="Group-2"
                                  transform="translate(24.000000, 0.000000)"
                                >
                                  <polygon
                                    id="Triangle"
                                    transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                    points="4.5 57.5 12.5 66.5 -3.5 66.5"
                                  />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                        <p className="text-sm text-white">
                          {/* TODO: Validation */}
                          Number of bytes for a MacroBlock. <br />
                          Denoted in a multiply of Logical Block Size. <br />
                          The multiply value must be a decimal number and never
                          0.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="macro-block-spare-number"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
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
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                      placeholder="10"
                    />
                    {tooltipstatus == 9 && (
                      <div
                        role="tooltip"
                        className="z-20 mx-4 right-1 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded"
                      >
                        <p className="text-sm text-white">
                          Percent of spare space in a MacroBlock.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="macro-block-preallocation-number"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
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
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                    placeholder={configState.MacroBlockPreallocation.toString()}
                  />
                </div>
                <label
                  htmlFor="macro-block-batch-allocation-number"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
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
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                    placeholder={DefaultStreamConfig.MacroBlockBatchAllocation.toString()}
                  />
                </div>
              </div>
            </div>

            <div className={"sm:border-t sm:border-gray-100 sm:pt-5"}>
              <p className="font-bold dark:text-gray-100">Cache Configuration</p>
              <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-center pt-3">
                <label
                  htmlFor="macro-block-cache-number"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
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
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                      placeholder={DefaultStreamConfig.MacroBlocksCache.toString()}
                    />
                    {tooltipstatus == 11 && (
                      <div
                        role="tooltip"
                        className="z-20 mx-4 right-20 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded"
                      >
                        <svg
                          className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                          width="9px"
                          height="16px"
                          viewBox="0 0 9 16"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <g
                            id="Page-1"
                            stroke="none"
                            strokeWidth={1}
                            fill="none"
                            fillRule="evenodd"
                          >
                            <g
                              id="Tooltips-"
                              transform="translate(-874.000000, -1029.000000)"
                              fill="#000000"
                            >
                              <g
                                id="Group-3-Copy-16"
                                transform="translate(850.000000, 975.000000)"
                              >
                                <g
                                  id="Group-2"
                                  transform="translate(24.000000, 0.000000)"
                                >
                                  <polygon
                                    id="Triangle"
                                    transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                    points="4.5 57.5 12.5 66.5 -3.5 66.5"
                                  />
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                        <p className="text-sm mt-2 text-white">
                          Number of MacroBlocks to keep in memory in LRU i.e.
                          cache.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="nodes-cache-number"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
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
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                      placeholder={DefaultStreamConfig.NodesCache.toString()}
                    />
                    {tooltipstatus == 12 && (
                      <div
                        role="tooltip"
                        className="z-20 mx-4 right-1 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded"
                      >
                        <p className="text-sm px-1 py-1 text-white">
                          Number of Nodes to keep in memory in LRU i.e. cache.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
              <p className="font-bold dark:text-gray-100">Compressors</p>
              <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start">
                <div className="sm:mt-0 sm:col-span-2">
                  <label
                    htmlFor="leafCompressor"
                    className="relative top-4 left-2 bg-white dark:text-gray-100 dark:bg-gray-700 rounded-md -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                  >
                    Leaf Compressor
                  </label>
                  <select
                    id="leafCrompressor"
                    name="leafCompressor"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                    value={configState.LeafCompressor}
                    onChange={(event) => {
                      setConfigState({
                        ...configState,
                        LeafCompressor: event.target.value,
                      });
                    }}
                  >
                    <option>None</option>
                    <option>LZ4_Fast_No_Meta</option>
                    <option>LZ4_Fast_With_Meta</option>
                    <option>Sprintz</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="indexCompressor"
                    className="relative top-4 left-2 bg-white dark:text-gray-100 dark:bg-gray-700 rounded-md -mt-px inline-block px-1 text-xs font-medium text-gray-400"
                  >
                    Index Compressor
                  </label>
                  <select
                    id="indexCompressor"
                    name="indexCompressor"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm  dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                    value={configState.IndexCompressor}
                    onChange={(event) => {
                      setConfigState({
                        ...configState,
                        IndexCompressor: event.target.value,
                      });
                    }}
                  >
                    <option>None</option>
                    <option>LZ4_Fast_No_Meta</option>
                    <option>LZ4_Fast_With_Meta</option>
                    <option>Sprintz</option>
                  </select>
                </div>
                {configState.LeafCompressor === "LZ4_Fast_No_Meta" ||
                configState.LeafCompressor === "LZ4_Fast_With_Meta" ? (
                  <React.Fragment>
                    <div className="sm:col-span-2 mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-100 sm:text-sm">
                          Lz4Level
                        </span>
                      </div>
                      <input
                        type="number"
                        name="lz4Level-leafCompressor"
                        id="lz4Level-leafCompressor"
                        value={leafLz4LevelCompressor}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-18 sm:pl-16 sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                        onChange={(event) => {
                          setLeafLz4LevelCompressor(
                            parseInt(event.target.value)
                          );
                          setLeafCompressorExtras({
                            Lz4Level: parseInt(event.target.value),
                          });
                        }}
                      />
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {configState.LeafCompressor === "Sprintz" ? (
                      <React.Fragment>
                        <div className="sm:col-span-2 relative border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                          <label
                            htmlFor="Sprintz-leafCompressor"
                            className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white dark:text-gray-100 dark:bg-gray-700 rounded-md text-xs font-medium text-gray-900"
                          >
                            Sprintz Extras
                          </label>
                          <input
                            type="text"
                            name="Sprintz-leafCompressor"
                            id="Sprintz-leaf-Compressor"
                            className="block w-full border-0 p-0 text-gray-900 dark:text-gray-100 dark:bg-gray-700  placeholder-gray-500 focus:ring-0 sm:text-sm"
                            value={leafSprintzValue}
                            onChange={(event) => {
                              setLeafSprintzValue(event.target.value);
                              let sprintzKeys = event.target.value.split(",");
                              let sprintzValues = [];
                              if (sprintzKeys.length === 3) {
                                for (let i = 0; i < sprintzKeys.length; i++) {
                                  switch (sprintzKeys[i]) {
                                    case "true":
                                      sprintzValues.push(true);
                                      break;

                                    case "false":
                                      sprintzValues.push(false);
                                      break;

                                    default:
                                      sprintzValues.push(
                                        parseInt(sprintzKeys[i])
                                      );
                                      break;
                                  }
                                }
                              }
                              //@ts-ignore
                              /* setLeafCompressorExtras({
                                Sprintz: sprintzValues,
                              }); */
                            }}
                          />
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                  </React.Fragment>
                )}
                {configState.IndexCompressor === "LZ4_Fast_No_Meta" ||
                configState.IndexCompressor === "LZ4_Fast_With_Meta" ? (
                  <React.Fragment>
                    <div className="sm:col-span-2 mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-100 sm:text-sm">
                          Lz4Level
                        </span>
                      </div>
                      <input
                        type="number"
                        name="lz4Level-indexCompressor"
                        id="lz4Level-indexCompressor"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-18 sm:pl-16 sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                        value={IndexLz4LevelCompressor}
                        onChange={(event) => {
                          setIndexLz4LevelCompressor(
                            parseInt(event.target.value)
                          );
                          setIndexCompressorExtras({
                            Lz4Level: parseInt(event.target.value),
                          });
                        }}
                      />
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {configState.IndexCompressor === "Sprintz" ? (
                      <React.Fragment>
                        <div className="sm:col-span-2 relative border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                          <label
                            htmlFor="Sprintz-indexCompressor"
                            className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white dark:text-gray-100 dark:bg-gray-700 rounded-md text-xs font-medium text-gray-900"
                          >
                            Sprintz Extras
                          </label>
                          <input
                            type="text"
                            name="Sprintz-indexCompressor"
                            id="Sprintz-indexCompressor"
                            className="block w-full border-0 p-0 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 focus:ring-0 sm:text-sm"
                            value={indexSprintzValue}
                            onChange={(event) => {
                              setIndexSprintzValue(event.target.value);
                              let sprintzKeys = event.target.value.split(",");
                              let sprintzValues = [];
                              if (sprintzKeys.length === 3) {
                                for (let i = 0; i < sprintzKeys.length; i++) {
                                  switch (sprintzKeys[i]) {
                                    case "true":
                                      sprintzValues.push(true);
                                      break;

                                    case "false":
                                      sprintzValues.push(false);
                                      break;

                                    default:
                                      sprintzValues.push(
                                        parseInt(sprintzKeys[i])
                                      );
                                      break;
                                  }
                                }
                              }
                              //@ts-ignore
                              /* setIndexCompressorExtras({
                                Sprintz: sprintzValues,
                              }); */
                            }}
                          />
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="river-threads"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
              >
                River threads
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <Menu as="div" className="relative inline-block text-center">
                  <div
                    onMouseEnter={() => setTooltipStatus(16)}
                    onMouseLeave={() => setTooltipStatus(0)}
                  >
                    <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                      {configState.RiverThreads}
                      <ChevronDownIcon
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute mt-2 w-16 rounded-md shadow-lg bg-white dark:bg-gray-700 dark:text-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {["0", "t", "c", "d"].map((val) => (
                          <Menu.Item>
                            <button
                              key={val}
                              onClick={(e) => {
                                e.preventDefault();
                                setConfigState({
                                  ...configState,
                                  RiverThreads: val,
                                });
                              }}
                              className={classNames(
                                configState.RiverThreads === val
                                  ? "bg-gray-100 dark:bg-gray-500 dark:text-gray-100 text-gray-900"
                                  : "text-gray-700 dark:text-gray-100",
                                "block text-center px-4 py-2 text-sm"
                              )}
                            >
                              <p>{val}</p>
                            </button>
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                {tooltipstatus == 16 && (
                  <div
                    role="tooltip"
                    className="z-20 mx-4 right-1 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded"
                  >
                    <svg
                      className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                      width="9px"
                      height="16px"
                      viewBox="0 0 9 16"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <g
                        id="Page-1"
                        stroke="none"
                        strokeWidth={1}
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g
                          id="Tooltips-"
                          transform="translate(-874.000000, -1029.000000)"
                          fill="#000000"
                        >
                          <g
                            id="Group-3-Copy-16"
                            transform="translate(850.000000, 975.000000)"
                          >
                            <g
                              id="Group-2"
                              transform="translate(24.000000, 0.000000)"
                            >
                              <polygon
                                id="Triangle"
                                transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                points="4.5 57.5 12.5 66.5 -3.5 66.5"
                              />
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <p className="text-sm mt-2 text-white">
                      Number of river threads in the delta. 0 := Pipeline
                      bypassed.
                      <br />
                      t := Number of CPU threads.
                      <br />
                      c := Number of CPU cores.
                      <br />d := Default number threads.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="max-delta-queue"
              className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
            >
              Max delta queue
            </label>
            <div className="mt-4 sm:mt-0 sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="number"
                  name="max-delta-queue"
                  id="max-delta-queue"
                  value={configState.MaxDeltaQueue}
                  onMouseEnter={() => setTooltipStatus(17)}
                  onMouseLeave={() => setTooltipStatus(0)}
                  onBlur={() => {
                    if (
                      configState.MaxDeltaQueue *
                        configState.MultipleDiskMaxQueue >=
                      configState.MacroBlocksCache
                    ) {
                      setErrorFields([...errorFields, "max-delta-queue"]);
                    }
                  }}
                  onChange={(e) => {
                    let newArr = errorFields.filter(
                      (e) => e !== "max-delta-queue"
                    );
                    setErrorFields(newArr);
                    setConfigState({
                      ...configState,
                      MaxDeltaQueue: parseInt(e.target.value),
                    });
                  }}
                  className={`max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 rounded-md ${
                    errorFields.includes("max-delta-queue")
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                  placeholder="100"
                />
                {errorFields.includes("max-delta-queue") && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    This value * number of disks must be always smaller than
                    MacroBlocksCache ({configState.MacroBlocksCache}).
                  </p>
                )}
                {tooltipstatus == 17 && (
                  <div
                    role="tooltip"
                    className="z-20 mx-4 right-1 w-64 absolute transition duration-150 ease-in-out shadow-lg bg-gray-900 p-4 rounded"
                  >
                    <svg
                      className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                      width="9px"
                      height="16px"
                      viewBox="0 0 9 16"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <g
                        id="Page-1"
                        stroke="none"
                        strokeWidth={1}
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g
                          id="Tooltips-"
                          transform="translate(-874.000000, -1029.000000)"
                          fill="#000000"
                        >
                          <g
                            id="Group-3-Copy-16"
                            transform="translate(850.000000, 975.000000)"
                          >
                            <g
                              id="Group-2"
                              transform="translate(24.000000, 0.000000)"
                            >
                              <polygon
                                id="Triangle"
                                transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                points="4.5 57.5 12.5 66.5 -3.5 66.5"
                              />
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <p className="text-sm mt-2 text-white">
                      Number of jobs to queue in the delta before blocking.{" "}
                      <br />
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

      {/* divider before buttons*/}
      <div className="pt-2"></div>
    </form>
  );
}
