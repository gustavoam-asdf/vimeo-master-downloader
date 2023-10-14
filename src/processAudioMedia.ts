import fs from "node:fs/promises";
import { DownloadVideo } from "./DownloadVideo";
import { MediaResolved } from "./MediaResolved";
import { getVideoFilesTarget } from "./getVideoFilesTarget";
import { processMedia } from "./processMedia";

type Params = {
	video: DownloadVideo
	parts: MediaResolved[]
}

export async function processVideoMedia({
	video,
	parts
}: Params) {
	const { audio } = getVideoFilesTarget({ video })

	const existDownloadingFlag = await fs.exists(audio.downloadingFlag)

	if (existDownloadingFlag) {
		console.log(`→ ⚠️ ${audio.file} - audio is incomplete, restarting the download`)
	}

	const existFile = await fs.exists(audio.filePath)
	if (existFile && !existDownloadingFlag) {
		console.log(`→ ✅ ${audio.file} - audio already exists`)
		return
	}

	await fs.writeFile(audio.downloadingFlag, "")

	for (const part of parts) {
		await processMedia({
			type: "audio",
			video,
			media: part
		})
	}

	await fs.rm(audio.downloadingFlag)
}