import { AppState } from "../App";
import { SmallIcon } from "../Common/CommonElements";
import { SwapAccounts } from "../Services/AccountData";
import { StatePair } from "../StatePair";

function RowButtons(props: {
    isHovering: boolean;
    swapIndex: StatePair<[number, number]>;
    accountIndex: number;
    AppState: AppState;
    enabled?: boolean;
}): JSX.Element {
    let opacity =
        props.isHovering && props.enabled ? "opacity-50" : "opacity-0";
    let classString =
        "self-center transition-opacity duration-300 ease-in-out " + opacity;

    return (
        <div className="w-5 min-w-fit p-3 place-content-evenly">
            <div className="grid grid-cols-1 grid-rows-2 place-content-evenly h-full">
                <SmallIcon
                    src="/arrow-down-light.png"
                    className={classString + " rotate-180"}
                    onClick={() => {
                        if (props.accountIndex == 0 || !props.enabled) return;

                        SwapAccounts(
                            props.accountIndex,
                            props.accountIndex - 1,
                            props.AppState
                        );

                        props.swapIndex.Set([
                            props.accountIndex - 1,
                            props.accountIndex,
                        ]);

                        setTimeout(() => {
                            props.swapIndex.Set([-1, -1]);
                        }, 740);
                    }}
                />
                <SmallIcon
                    src="/arrow-down-light.png"
                    className={classString}
                    onClick={() => {
                        if (
                            props.accountIndex ==
                            props.AppState.data.length - 1
                        )
                            return;

                        SwapAccounts(
                            props.accountIndex,
                            props.accountIndex + 1,
                            props.AppState
                        );

                        props.swapIndex.Set([
                            props.accountIndex,
                            props.accountIndex + 1,
                        ]);

                        setTimeout(() => {
                            props.swapIndex.Set([-1, -1]);
                        }, 740);
                    }}
                />
            </div>
        </div>
    );
}

export default RowButtons;
