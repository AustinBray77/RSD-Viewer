import { useMemo } from "react";
import { AccountData } from "../Services/AccountData";
import { SmallIcon } from "../Common/CommonElements";

export default function SideButtons(props: {data: AccountData[]}): JSX.Element {
    const GenerateButtons = (data: AccountData[]) => {
        return data.map((_, i) => {
            return <div className="text-m h-[3.5rem] border-2 border-slate-600" onClick={() => {}}>
                <SmallIcon src="/arrow-down-light.png" className="rotate-180 opacity-50 mb-4" />
                <SmallIcon src="/arrow-down-light.png" className="opacity-50" />
            </div>
        });
    }
    
    const ButtonList = useMemo(() => GenerateButtons(props.data), [props.data]);

    return <div>
        {ButtonList}
    </div>
}