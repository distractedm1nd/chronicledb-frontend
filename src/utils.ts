import {StreamConfig} from "./types/types";

export const configToINI = (config: StreamConfig): string => {
    let body: string = "";
    for (const [key, value] of Object.entries(config)) {
        body += `${key} = ${JSON.stringify(value)}\n`;
    }
    return body;
}

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}
