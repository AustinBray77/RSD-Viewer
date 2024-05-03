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
}): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(props.startingIndex);

	return (
		<div>
			<div className="flex focus:outline-none bg-slate-700 border-2 rounded focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700 items-center" onClick={() => { setIsOpen(!isOpen) }}>
				&nbsp;
				<SmallIcon src="/arrow-down.png" />
				&nbsp;
				<SmallIcon src={props.icons[currentIndex]} />
				&nbsp;
				<div>
					{props.items[currentIndex]}
				</div>
				&nbsp;
			</div>
			{
				isOpen ?
				<div> 
					We're Open!
				</div> 
				: ""
			}
		</div>
	);
}

export { StandardBox, DropdownFromList };
