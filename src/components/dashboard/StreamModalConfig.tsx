import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {DefaultStreamConfig, EventNames, IEvent, StreamConfig} from "../../types/types";

export interface IStreamModalConfig {
  configState: StreamConfig;
  setConfigState: Dispatch<SetStateAction<StreamConfig>>;
}

export default function StreamModalConfig(props: IStreamModalConfig) {
  let {configState, setConfigState} = props;
  const [eventType, setEventType] = useState<string>("Raw");
  const [dataType, setDataType] = useState<string>("Integer");
  const [storage, setStorage] = useState<string>("8");
  const [data, setData] = useState<string>("");
  const [currentEvent, setCurrentEvent] = useState<IEvent>();


  useEffect(() => {
    // @ts-ignore
    let dataOptions = EventNames[eventType];
    let storageOptions = dataOptions[dataType];
    if(dataType in dataOptions && storage in storageOptions) {
      setCurrentEvent({[storageOptions[storage]]: data})
    } else if (dataType in dataOptions){
      setStorage(Object.keys(storageOptions)[0]);
    } else {
      setDataType(Object.keys(dataOptions)[0]);
    }
  }, [eventType, dataType, storage, data])

  useEffect(() => {
    if(currentEvent) setConfigState({...configState, Event: [currentEvent]})
  }, [currentEvent])

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
                  <div className="max-w-lg">
                    <p className="text-sm text-gray-500">
                      Enables logs across the system, if log set to true.
                      Otherwise logs are disabled.
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="log-false"
                          name="log-state"
                          type="radio"
                          onClick={() =>
                            setConfigState({ ...configState, Log: false })
                          }
                          checked={!configState.Log}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor="log-false"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          false
                        </label>
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
                    <p className="text-sm text-gray-500">
                      All the dynamic TAB + Index optimized sizes are discarded
                      and the minimum size for the nodes is used instead, if set
                      to true. These minimum sizes are:
                      <br />
                      Index Data Size := 3 Keys / Node.
                      <br />
                      Leaf Data Size := 2 Events / Node. <br />
                      Otherwise, calculates the most suitable TAB + Index sizes.
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="debug-false"
                          name="debug-state"
                          type="radio"
                          onClick={() =>
                            setConfigState({ ...configState, Debug: false })
                          }
                          checked={!configState.Debug}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
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
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <p className="text-sm text-gray-500">
                  Data files. <br />
                  data = C:\\dataFile1 <br />
                  data = I:\\dataFile2 <br />
                  data = H:\\dataFile3 <br />
                  ...
                </p>
                <div className="mt-4 space-y-4">
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
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                htmlFor="translation"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Translation
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <p className="text-sm text-gray-500">
                  This is used to serialize the rightFlank on a clean system
                  shutdown.
                </p>
                <div className="mt-4 space-y-4">
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
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                htmlFor="translation"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Boot
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
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

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                  htmlFor="data"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Event Type
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select
                    id="eventType"
                    name="eventType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={eventType}
                    onChange={(event) => setEventType(event.target.value)}
                >
                  {
                    Object.keys(EventNames).map(name =>
                        <option>{name}</option>
                    )
                  }
                </select>
              </div>

            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                  htmlFor="translation"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Datatype
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select
                    id="dataType"
                    name="dataType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={dataType}
                    onChange={(event) => setDataType(event.target.value)}
                >
                  {
                    // @ts-ignore
                    Object.keys(EventNames[eventType]).map(name =>
                        <option>{name}</option>
                    )
                  }
                </select>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                  htmlFor="translation"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Storage
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select
                    id="dataType"
                    name="dataType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={storage}
                    onChange={(event) => setStorage(event.target.value)}
                >
                  {
                    // @ts-ignore
                    dataType in EventNames[eventType] && Object.keys(EventNames[eventType][dataType]).map(name =>
                        <option>{name}</option>
                    )
                  }
                </select>
              </div>
              <label
                  htmlFor="multiple-disk-max-queue-number"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Data
              </label>
                <input
                    type="text"
                    name="data"
                    id="data"
                    value={data}
                    onChange={(e) =>
                        setData(e.target.value)
                    }
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="multiple-disk-max-queue-number"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Multiple Disk Queue Checkpoint
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <p className="text-sm text-gray-500">
                  The number of MacroBlocks allowed to be queued on disk writer
                  thread(s). <br />
                  This number must be much lower than MacroBlock Cache * number
                  of data files.
                </p>
                <div className="mt-4 space-y-4">
                  <input
                    type="number"
                    name="multiple-disk-max-queue-number"
                    id="multiple-disk-max-queue-number"
                    value={configState.MultipleDiskMaxQueue}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        MultipleDiskMaxQueue: parseInt(e.target.value),
                      })
                    }
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="logical-block-size-number"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Logical Block Size
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="number"
                  name="logical-block-size-number"
                  id="logical-block-size-number"
                  value={configState.LogicalBlockSize}
                  onChange={(e) =>
                    setConfigState({
                      ...configState,
                      MultipleDiskMaxQueue: parseInt(e.target.value),
                    })
                  }
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  placeholder="8192"
                />
              </div>
            </div>

            <div className={"sm:border-t sm:border-gray-100 sm:pt-5"}>
              <p className={"font-bold"}>Macro Block Configuration</p>
              <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-start pt-3">
                <label
                  htmlFor="macro-block-size-number"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Size
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="number"
                    name="macro-block-size-number"
                    id="macro-block-size-number"
                    value={configState.MacroBlockSize}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        MacroBlockSize: parseInt(e.target.value),
                      })
                    }
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder="10"
                  />
                </div>
                <label
                  htmlFor="macro-block-spare-number"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Spare
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="number"
                    step={"0.1"}
                    name="macro-block-spare-number"
                    id="macro-block-spare-number"
                    value={configState.MacroBlockSpare}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        MacroBlockSpare: parseFloat(e.target.value),
                      })
                    }
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder="10"
                  />
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
                    placeholder="300"
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
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        MacroBlockBatchAllocation: parseInt(e.target.value),
                      })
                    }
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder={DefaultStreamConfig.MacroBlockBatchAllocation.toString()}
                  />
                </div>
              </div>
            </div>

            <div className={"sm:border-t sm:border-gray-100 sm:pt-5"}>
              <p className="font-bold">Cache Configuration</p>
              <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-start pt-3">
                <label
                  htmlFor="macro-block-cache-number"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Macro Blocks
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="number"
                    name="macro-block-cache-number"
                    id="macro-block-cache-number"
                    value={configState.MacroBlocksCache}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        MacroBlocksCache: parseInt(e.target.value),
                      })
                    }
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder={DefaultStreamConfig.MacroBlocksCache.toString()}
                  />
                </div>
                <label
                  htmlFor="nodes-cache-number"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Nodes
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="number"
                    name="nodes-cache-number"
                    id="nodes-cache-number"
                    value={configState.NodesCache}
                    onChange={(e) =>
                      setConfigState({
                        ...configState,
                        NodesCache: parseInt(e.target.value),
                      })
                    }
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder={DefaultStreamConfig.NodesCache.toString()}
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-6 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="compressor"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Compressor
              </label>
              <div className="mt-4 space-y-4 col-span-2">
                <div className="flex items-center">
                  <input
                    id="compressor-none"
                    name="compressor"
                    type="radio"
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
                </div>
                <div className="flex items-center">
                  <input
                    id="compressor-lz4-no-meta"
                    name="compressor"
                    type="radio"
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
                </div>
                <div className="flex items-center">
                  <input
                    id="compressor-lz4-with-meta"
                    name="compressor"
                    type="radio"
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
                </div>
              </div>
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
                          CompressorExtras: { I32: parseInt(e.target.value) },
                        })
                      }
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-2 sm:text-sm border-gray-300 rounded-md"
                      placeholder={DefaultStreamConfig.CompressorExtras.I32.toString()}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="river-threads"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                River threads
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="river-threads"
                  id="river-threads"
                  value={configState.RiverThreads}
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
                <input
                  type="number"
                  name="max-delta-queue"
                  id="max-delta-queue"
                  value={configState.MaxDeltaQueue}
                  onChange={(e) =>
                    setConfigState({
                      ...configState,
                      MaxDeltaQueue: parseInt(e.target.value),
                    })
                  }
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  placeholder={DefaultStreamConfig.MaxDeltaQueue.toString()}
                />
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
