import {IEvent, ip, StreamConfig, StreamConfigKey, User, ValidationType} from "./types/types";

// TODO
export const nameof = <T>(name: keyof T) => name;

/**
 * Converts a StreamConfig to the INI-type input format used by the Rust Backend for stream creation
 * @param config The stream config to format
 **/
export const streamConfigToINI = (config: StreamConfig): string => {
    let body: string = "";
    for (const [key, value] of Object.entries(config)) {
        if (key == "CompressorExtras") {
            body += `${StreamConfigKey[key]} = ${interpolate(value)}\n`;
        } else if(Array.isArray(value)) {
            value.forEach(x => {
                // @ts-ignore
                body += `${StreamConfigKey[key]} = ${interpolate(x)}\n`;
            })
        } else {
            // @ts-ignore
            body += `${StreamConfigKey[key]} = ${interpolate(value)}\n`;
        }
    }
    return body;
}

/**
 * Returns a human-readable representation of the input.
 * Without, object.toString() returns "[object Object]"
 * @param variable Will be converted into a human readable format.
 * @returns a string if the input was an array or object, otherwise the type stays the same.
  */
export const interpolate = (variable: any) => typeof variable == "object" ? JSON.stringify(variable) : variable;


// export const configToINI = (config: StreamConfig): string => {
//     return `
//     Log = ${config.Log}
//     Debug = ${config.Debug}
//     Translation = ${config.Translation}
//     Right flank = ^
//     ${config.Data.map(file => `Data = ${file}\n`)}
//     ${config.Events.map(event => `Event = ${JSON.stringify(event)}\n`)}
//
//     `
// }

/**
 * Joins a list of strings, used to combine tailwind classes conditionally.
 * @param classes Strings to be combined.
 * **/
export function classNames(...classes: any) {
    // Example usage: classNames(conditionalState ? "hidden" : "visible", "relative px-2")
    return classes.filter(Boolean).join(" ");
}

// Question: How should insert_ordered_array be formatted?
/**
 * Sends a POST request to the Rust backend to insert an event into a stream.
 * @param streamId id of the stream the event will be inserted into.
 * @param timestamp timestamp of the event (at what position the event will be inserted into in the stream).
 * @param event IEvent the event to be inserted.
 * @param callback function to be called after the request is completed.
 * **/
export const insertOrdered = (streamId: number, timestamp: number, event: IEvent, callback: () => void) => {
    fetch(`${ip}/insert_ordered/${streamId}`, {
        method: "POST",
        body: `{"t1": ${timestamp}, "payload": ${JSON.stringify(event).replaceAll("\"[", "[").replaceAll("]\"", "]")}}`,
    })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error))
        .finally(callback);
};

/**
 * Sends a POST request to the Rust backend to insert an array of events into a stream.
 * @param streamId id of the stream the events will be inserted into.
 * @param events IEvent the event to be inserted.
 * @param callback function to be called after the request is completed.
 * **/
export const insertArrayOrdered = (streamId: number, events: IEvent[], callback: () => void) => {
    console.debug('Insert Array Ordered');
    console.debug(events);
    console.debug(JSON.stringify(events).replaceAll("\"[", "[").replaceAll("]\"", "]"))
    fetch(`${ip}/insert_array_ordered/${streamId}`, {
        method: "POST",
        body: `${JSON.stringify(events).replaceAll("\"[", "[").replaceAll("]\"", "]")}`,
    })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error))
        .finally(callback);
}

export const queryTimeTravel = async (streamId: number, margin: string, start: number, end:number) => {
    // setModalTitle("Query Time Travel: Stream " + streamId )
    // setInfoTableModalOpen(true);
    return await fetch(`${ip}/query_time_travel/${streamId}`, {
        method:"POST",
        body: JSON.stringify({
            [margin]: {"start": start, "end": end}
        }),
    }).then((response) => response.text())
}


/**
 * Sends a request to the Rust backend to shut down a running stream.
 * @param streamId id of the stream to be shut down.
 * @param callback function to be called after the request is completed.
 * **/
export const shutdownStream = (streamId: number, callback: () => void) => {
    fetch(`${ip}/shutdown_stream/${streamId}`)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error))
        .finally(callback);
};

/**
 * Sends a request to the Rust backend to recover a shutdown stream.
 * @param streamId id of the stream to be recovered.
 * @param callback function to be called after the request is completed.
 * **/
export const recoverStreamSnapshot = (streamId: number, callback: () => void) => {
    fetch(`${ip}/recover_stream_snapshot/${streamId}`)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error))
        .finally(callback);
};

/**
 * Sends a request to the Rust backend to create a stream.
 * @param config StreamConfig created by the user in CreateStreamModal.tsx/StreamModalConfig.tsx.
 * @param callback function to be called after the request is completed.
 * **/
export const createStream = (config: StreamConfig, callback: () => void) => {
    fetch(`${ip}/create_stream`, {
        method: "POST",
        body: streamConfigToINI(config),
    })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error))
        .finally(callback);
};

export const fetchSystemInfo = async (): Promise<string> => {
    return await fetch(`${ip}/system_info`).then(response => response.text())
}

export const fetchStreamAttribute = async (streamId: number, attribute: string) => {
    return await fetch(`${ip}/${attribute}/${streamId}`).then((res) =>
        res.text()
    );
};

// TODO: Create a type that is fetched
export const fetchStreams = async (user: User): Promise<any[]> => {
    // This is of course ridiculous.
    // Either the auth backend should act as a proxy for all requests with basic authentication, or the backend itself needs authentication.
    if (user.roles.includes("admin") || user.roles.includes("read"))
        return await fetch(`${ip}/show_streams`).then((response) => response.json());
    else
        return [];
}
/**
 * Input Validation function for stream configs in StreamModalConfig.tsx
 * @param configState StreamConfig created by the user to be checked for validation errors.
 * @return An object with th properties isValid and errorMessage.
 * **/
export const validateConfigState = (
    configState: StreamConfig
): ValidationType => {
    let {
        MaxDeltaQueue,
        MultipleDiskMaxQueue,
        MacroBlocksCache,
        Data,
        RiverThreads,
    } = configState;

    // Multiple Disk Queue Checkpoint validation
    let invalidMultipleDiskQueue =
        MultipleDiskMaxQueue >= MacroBlocksCache * Data.length;

    // River threads validation
    let invalidRiverThreads = !["0", "t", "c", "d"].includes(
        RiverThreads.toString()
    );

    // Max delta queue validation
    let invalidMaxDeltaQueue =
        MaxDeltaQueue * MultipleDiskMaxQueue >= MacroBlocksCache;

    switch (true) {
        case invalidMultipleDiskQueue:
            return {
                isValid: false,
                errorMessage:
                    "The number of Multiple Disk Queue Checkpoint must be much lower than MacroBlock Cache * number of data files.",
            };
        case invalidRiverThreads:
            return {
                isValid: false,
                errorMessage:
                    "Please provide a river threads value which is one of the following: 0, t, c, d",
            };
        case invalidMaxDeltaQueue:
            return {
                isValid: false,
                errorMessage:
                    "The Max delta queue value * number of disks must be always smaller than MacroBlocksCache.",
            };
        default:
            return {
                isValid: true,
                errorMessage: null,
            };
    }
};