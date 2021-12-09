import {configString, DefaultStreamConfig, IEvent, ip, StreamConfig, StreamConfigKey} from "./types/types";

export const nameof = <T>(name: keyof T) => name;

export const configToINI = (config: StreamConfig): string => {
    let body: string = "";
    for (const [key, value] of Object.entries(config)) {
        if(Array.isArray(value)) {
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

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}
// Question: How should insert_ordered_array be formatted?
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

export const shutdownStream = (streamId: number, callback: () => void) => {
    fetch(`${ip}/shutdown_stream/${streamId}`)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error))
        .finally(callback);
};

export const recoverStreamSnapshot = (streamId: number, callback: () => void) => {
    fetch(`${ip}/recover_stream_snapshot/${streamId}`)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error))
        .finally(callback);
};

export const createStream = (config: StreamConfig, callback: () => void) => {
    fetch(`${ip}/create_stream`, {
        method: "POST",
        body: configToINI(config),
    })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error))
        .finally(callback);
};
