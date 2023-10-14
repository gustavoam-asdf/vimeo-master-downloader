import fs from "node:fs/promises";
import { DownloadVideo } from "./DownloadVideo";
import { MediaResolved } from "./MediaResolved";
import { getVideoFilesTarget } from "./getVideoFilesTarget";
import { processMedia } from "./processMedia";

type Params = {
	downloadVideo: DownloadVideo
	audioResolved: MediaResolved
}

export async function processAudioMedia({
	downloadVideo,
	audioResolved
}: Params) {
	const { audio } = getVideoFilesTarget({ downloadVideo })

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

	await processMedia({
		type: "audio",
		downloadVideo: downloadVideo,
		mediaResolved: audioResolved
	})

	await fs.rm(audio.downloadingFlag)
}