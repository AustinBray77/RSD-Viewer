function StandardBox(props: {
	children: JSX.Element[] | JSX.Element | string;
}): JSX.Element {
	return (
		<div className="content-center border-x-slate-600 border-x-2 py-3">
			{props.children}
		</div>
	);
}

export { StandardBox };
