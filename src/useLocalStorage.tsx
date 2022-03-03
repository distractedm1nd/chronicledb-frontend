import { useState, useEffect } from "react";

/**
 * Retrieves a key from the local browser storage
 * @param key A string denoting the key of the object to be fetched from local browser storage
 * @param defaultValue a string denoting the value to be returned if no value is stored
 * **/
function getStorageValue(key: string, defaultValue: string) {
    // getting stored value
    const saved = localStorage.getItem(key);
    // @ts-ignore
    const initial = JSON.parse(saved);
    return initial || defaultValue;
}

/**
 * A React Hook to support usage of browser storage from components.
 * @param key A string denoting the key of the object to be fetched from local browser storage
 * @param defaultValue a string denoting the value to be returned if no value is stored
 * **/
export const useLocalStorage = (key : string, defaultValue: string) => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        // When the key or value change in the application, we set it in the local storage.
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}