import { invoke } from "@tauri-apps/api";
import { StatePair } from "../StatePair";

function Get2FACode(phoneNumber: string, isLoading: StatePair<boolean>): Promise<string> {
	return Promise.resolve("123456");

	isLoading.Set(true);
	
	return invoke("send_2fa_code", { phoneNumber: phoneNumber })
		.then((res) => {
			isLoading.Set(false);
			return res as string;
		})
		.catch((err) => {
			isLoading.Set(false);
			throw err;
		});
}

export { Get2FACode };