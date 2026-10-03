import { readFile, writeFile } from "node:fs/promises";

const pendingWrites = new Map<string, Promise<void>>();

async function readFileContents<T>(fileUrl: URL, initialValue: T): Promise<T> {
	try {
		const contents = await readFile(fileUrl, "utf8");
		return JSON.parse(contents) as T;
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			return initialValue;
		}
		throw error;
	}
}

export async function readJsonFile<T>(fileUrl: URL, initialValue: T): Promise<T> {
	await pendingWrites.get(fileUrl.href);
	return readFileContents(fileUrl, initialValue);
}

export async function updateJsonFile<T, R>(
	fileUrl: URL,
	initialValue: T,
	update: (current: T) => { data: T; result: R },
): Promise<R> {
	const key = fileUrl.href;
	const previousWrite = pendingWrites.get(key) ?? Promise.resolve();
	const operation = previousWrite.then(async () => {
		const current = await readFileContents(fileUrl, initialValue);
		const { data, result } = update(current);
		await writeFile(fileUrl, JSON.stringify(data, null, 2), "utf8");
		return result;
	});

	pendingWrites.set(key, operation.then(() => undefined, () => undefined));
	return operation;
}
