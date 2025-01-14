import React, {createContext, useState} from 'react';

const EnvironmentContext = createContext()

const AppProvider = ({isLocal, children}) => {
return(
    <EnvironmentContext.Provider value={{isLocal}}>
        {children}
    </EnvironmentContext.Provider>
    )
}

export {EnvironmentContext, AppProvider }