import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import useMousePosition from "../Services/WindowData";

function StandardHomeBox(props: {
	children: JSX.Element[] | JSX.Element | string;
	className?: string;
}): JSX.Element {
	return (
		<div className={"border-2 border-slate-600/[.1] py-3 content-center " + props.className}>
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
					<div className="w-4 h-3"></div> :
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
				getDropdownFromItem(
					props.items[i], 
					props.icons[i], 
					i, 
					(index: number) => {
						if(!isOpen) return;

						setCurrentIndex(index);
						setIsOpen(false);
						props.onChange(index);
					}, 
					true, 
					"border-2 rounded focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700"
				)
			);
		}

		return dropdownItems;
	}

	let animationString = isOpen ? "h-20 border-slate-800/[0.50]" : "h-0 border-slate-700";

	return (
		<div className={props.className}>
			<div className="flex h-7 focus:outline-none bg-slate-700 border-2 rounded focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700 items-center" onClick={() => { setIsOpen(!isOpen) }}>
				&nbsp;
				<img className="w-3 h-3" src="/arrow-down-light.png" />
				&nbsp;
				{getDropdownFromItem(props.items[currentIndex], props.icons[currentIndex], currentIndex, (index: number) => {}, false, "")}
				&nbsp;
			</div>
			<div className={"transition-all duration-500 overflow-y-auto fixed bg-slate-700 z-10 rounded border-2 drop-down-scroll " + animationString}> 
				{generateDropdown()}
			</div> 
		</div>
	);
}

function Title(props: { children: string }): JSX.Element {
	return <StandardHomeBox>
			<h3 className="flex justify-center text-2xl">{props.children}</h3>
		</StandardHomeBox>
}

function ToolTip(props: { children: string, offset?: [number, number] }): JSX.Element {
	const mousePos = useMousePosition();

	//console.log("Width %d, Height %d", width, height);
	//console.log("Mouse Pos: %d, %d", mousePos.Value.x, mousePos.Value.y);

	const translationString = "translate(" + (mousePos.Value.x - props.offset![0] + 10) + "px," + (mousePos.Value.y- props.offset![1] + 30) + "px)";
	
	return <label className="fixed z-50 bg-slate-700 z-10 border-2 rounded border-slate-800/[0.50] px-1 py-1" style={{transform: translationString, zIndex: 1000 }}>
		{props.children}
	</label>
}

function RetractArrow(props: { className?: string, subClassName?:string, onClick: () => void }): JSX.Element {
	return <div className={"fixed bg-slate-700 py-2 px-3 rounded-b " + props.className} onClick={props.onClick}>
			<img 
            	className={"w-4 h-3 " + props.subClassName} 
            	src="/arrow-down-light.png"
        	/>
		</div>
}

export { StandardHomeBox, DropdownFromList, Title, ToolTip, RetractArrow };
