import { AccountData } from "../Services/AccountData";
import { StandardHomeBox } from "../Common/CommonElements";

export default function AccountDisplay(props: {
    account: AccountData;
}): JSX.Element {
    return (
        <StandardHomeBox className="w-2/3 min-w-96">
            <div className="px-5 text-lg leading-[3.5rem]">
                {props.account.Name}
            </div>
        </StandardHomeBox>
    );
}
