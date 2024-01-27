import { ToolbarState } from "../Toolbar/Toolbar";
import { AccountData } from "./AccountData";

const ClearToolbar = (state: ToolbarState) => {
    state.account.Set(new AccountData("", ""))
}

export { ClearToolbar }