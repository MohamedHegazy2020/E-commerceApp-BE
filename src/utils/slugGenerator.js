import slugify from "slugify";

export default function createSlug(string) {
	return slugify(string, { lower: true, trim: true, replacement: "_" });
}
