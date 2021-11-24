import {configString, StreamConfig, StreamConfigKey} from "./types/types";

export const nameof = <T>(name: keyof T) => name;

export const configToINI = (config: StreamConfig): string => {
    // return configString;
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
