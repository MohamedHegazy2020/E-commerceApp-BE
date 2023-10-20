import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("123654789asdfgqwertzxcvb-*=!@#$^&", 5);

export default function createCustomId() {
	return nanoid();
}
