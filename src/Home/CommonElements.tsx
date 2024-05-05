import { useState } from "react";

function StandardBox(props: {
	children: JSX.Element[] | JSX.Element | string;
}): JSX.Element {
	return (
		<div className="content-center border-x-slate-600 border-x-2 py-3">
			{props.children}
		</div>
	);
}

function SmallIcon(props: { src: string }): JSX.Element {
	return <img src={props.src} className="w-4 h-3" />;
}

function DropdownFromList(props: {
	items: string[];
	icons: string[];
	startingIndex: number;
	onChange: (index: number) => void;
	className: string;
}): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(props.startingIndex);

	function getDropdownFromItem(item: string, icon: string, index: number, onClick: (index: number) => void, needsSpacing: boolean, style: string): JSX.Element {
		return (
			<div onClick={() => { onClick(index) }} className={"flex items-center " + style}>
				{
					needsSpacing ?
					<div className="w-4 h-3">&nbsp;</div> :
					""
				}
				<SmallIcon src={icon} />
				&nbsp;
				<div>
					{item}
				</div>
			</div>
		);
	}

	function generateDropdown(): JSX.Element[] {
		let dropdownItems: JSX.Element[] = [];

		for (let i = 0; i < props.items.length; i++) {
			dropdownItems.push(
				getDropdownFromItem(props.items[i], props.icons[i], i, 
					(index: number) => {
						setCurrentIndex(index);
						setIsOpen(false);
						props.onChange(index);
					}, true, "border-2 rounded focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700"
				)
			);
		}

		return dropdownItems;
	}

	return (
		<div className={props.className}>
			<div className="flex focus:outline-none bg-slate-700 border-2 rounded focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700 items-center" onClick={() => { setIsOpen(!isOpen) }}>
				&nbsp;
				<SmallIcon src="/arrow-down.png" />
				&nbsp;
				{getDropdownFromItem(props.items[currentIndex], props.icons[currentIndex], currentIndex, (index: number) => {}, false, "")}
				&nbsp;
			</div>
			{
				isOpen ?
				<div className="overflow-y-auto h-20 fixed bg-slate-700 z-10 border-2 rounded border-slate-800/[0.50]"> 
					{generateDropdown()}
				</div> 
				: ""
			}
		</div>
	);
}

export { StandardBox, DropdownFromList };
