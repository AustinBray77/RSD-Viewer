import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";

function ExportFile(
	setError: React.Dispatch<React.SetStateAction<string>>
): void {
	Promise.resolve(invoke<string>("get_file_path"))
		.then((res: string) => {
			return Promise.resolve(
				open({
					defaultPath: res,
					directory: true,
					multiple: false,
				})
			);
		})
		.then((res: string | string[] | null) => {
			if (typeof res == typeof [""] || typeof res == typeof null) {
				throw "Invalid Location";
			}

			return Promise.resolve(invoke<string>("copy_save_data", { path: res }));
		})
		.then((res: string) => {
			setError(`File was successfully saved at "${res}"`);
		})
		.catch((error) => {
			setError(error);
		});
}

function ImportFile(
	setError: React.Dispatch<React.SetStateAction<string>>,
	getData: (password: string, isLegacy?: boolean) => void,
	stablePassword: string,
	isLegacy: boolean
): void {
	let options = {
		defaultPath: "C:\\",
		multiple: false,
		directory: false,
		filters: [
			{
				name: "Binary Files (*.bin)",
				extensions: ["bin"],
			},
			{
				name: "All Files",
				extensions: ["*"],
			},
		],
	};

	Promise.resolve(open(options))
		.then((res: string | string[] | null) => {
			if (typeof res == typeof [""] || typeof res == typeof null) {
				throw "Invalid Location";
			}

			return Promise.resolve(invoke("set_save_data", { path: res }));
		})
		.then(() => {
			getData(stablePassword, isLegacy);
		})
		.catch((err) => {
			setError(err);
		});
}

export { ImportFile, ExportFile }