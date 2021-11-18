import {StreamConfig} from "./types/types";

export const nameof = <T>(name: keyof T) => name;

export const configToINI = (config: StreamConfig): string => {
    let body: string = "";
    for (const [key, value] of Object.entries(config)) {
        if(Array.isArray(value)) {
            value.forEach(x => {
                body += `${key} = ${interpolate(x)}\n`;
            })
        } else {
            body += `${key} = ${interpolate(value)}\n`;
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
