import { createContext } from "react";

export const DeveloperDataContext = createContext<any>({
    appData: {},
    setAppData: () => { },
});
