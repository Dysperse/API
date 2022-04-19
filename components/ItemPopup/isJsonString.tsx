export function isJsonString(str: string): boolean {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
