import type {NavigationState} from '@react-navigation/native';
import PropTypes from 'prop-types';
import type {ComponentType, ForwardedRef, RefAttributes} from 'react';
import React, {createContext, forwardRef, useCallback, useMemo, useState} from 'react';
import getComponentDisplayName from '@libs/getComponentDisplayName';
import Navigation from '@libs/Navigation/Navigation';
import SCREENS from '@src/SCREENS';

type CurrentReportIDContextValue = {
    updateCurrentReportID: (state: NavigationState) => void;
    currentReportID: string;
};

type CurrentReportIDContextProviderProps = {
    /** Actual content wrapped by this component */
    children: React.ReactNode;
};

const CurrentReportIDContext = createContext<CurrentReportIDContextValue | null>(null);

// TODO: Remove when depended components are migrated to TypeScript.
const withCurrentReportIDPropTypes = {
    /** Function to update the state */
    updateCurrentReportID: PropTypes.func.isRequired,

    /** The top most report id */
    currentReportID: PropTypes.string,
};

const withCurrentReportIDDefaultProps = {
    currentReportID: '',
};

function CurrentReportIDContextProvider(props: CurrentReportIDContextProviderProps) {
    const [currentReportID, setCurrentReportID] = useState('');

    /**
     * This function is used to update the currentReportID
     * @param state root navigation state
     */
    const updateCurrentReportID = useCallback(
        (state: NavigationState) => {
            const reportID = Navigation.getTopmostReportId(state) ?? '';

            /**
             * This is to make sure we don't set the undefined as reportID when
             * switching between chat list and settings->workspaces tab.
             * and doing so avoids an unnecessary re-render of `useReportIDs`.
             */
            const params = state.routes[state.index].params;
            if (params && 'screen' in params && params.screen === SCREENS.SETTINGS.WORKSPACES) {
                return;
            }
            setCurrentReportID(reportID);
        },
        [setCurrentReportID],
    );

    /**
     * The context this component exposes to child components
     * @returns currentReportID to share between central pane and LHN
     */
    const contextValue = useMemo(
        (): CurrentReportIDContextValue => ({
            updateCurrentReportID,
            currentReportID,
        }),
        [updateCurrentReportID, currentReportID],
    );

    return <CurrentReportIDContext.Provider value={contextValue}>{props.children}</CurrentReportIDContext.Provider>;
}

CurrentReportIDContextProvider.displayName = 'CurrentReportIDContextProvider';

export default function withCurrentReportID<TProps extends CurrentReportIDContextValue, TRef>(
    WrappedComponent: ComponentType<TProps & RefAttributes<TRef>>,
): (props: Omit<TProps, keyof CurrentReportIDContextValue> & React.RefAttributes<TRef>) => React.ReactElement | null {
    function WithCurrentReportID(props: Omit<TProps, keyof CurrentReportIDContextValue>, ref: ForwardedRef<TRef>) {
        return (
            <CurrentReportIDContext.Consumer>
                {(currentReportIDUtils) => (
                    <WrappedComponent
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...currentReportIDUtils}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...(props as TProps)}
                        ref={ref}
                    />
                )}
            </CurrentReportIDContext.Consumer>
        );
    }

    WithCurrentReportID.displayName = `withCurrentReportID(${getComponentDisplayName(WrappedComponent)})`;

    return forwardRef(WithCurrentReportID);
}

export {withCurrentReportIDPropTypes, withCurrentReportIDDefaultProps, CurrentReportIDContextProvider, CurrentReportIDContext};
export type {CurrentReportIDContextValue};
