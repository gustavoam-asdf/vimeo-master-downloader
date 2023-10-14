import fs from "node:fs/promises";
import { DownloadVideo } from "./DownloadVideo";
import { MediaResolved } from "./MediaResolved";
import { getVideoFilesTarget } from "./getVideoFilesTarget";
import { processMedia } from "./processMedia";

type Params = {
	downloadVideo: DownloadVideo
	videoResolved: MediaResolved
}

export async function processVideoMedia({
	downloadVideo,
	videoResolved
}: Params) {
	const { video } = getVideoFilesTarget({ downloadVideo })

	const existDownloadingFlag = await fs.exists(video.downloadingFlag)

	if (existDownloadingFlag) {
		console.log(`→ ⚠️ ${video.file} - video is incomplete, restarting the download`)
	}

	const existFile = await fs.exists(video.filePath)
	if (existFile && !existDownloadingFlag) {
		console.log(`→ ✅ ${video.file} - video already exists`)
		return
	}

	await fs.writeFile(video.downloadingFlag, "")

	await processMedia({
		type: "video",
		downloadVideo,
		mediaResolved: videoResolved
	})

	await fs.rm(video.downloadingFlag)
}