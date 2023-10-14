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
	video: downloadVideo,
	parts
}: Params) {
	const { video } = getVideoFilesTarget({ video: downloadVideo })

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

	for (const part of parts) {
		await processMedia({
			type: "video",
			video: downloadVideo,
			media: part
		})
	}

	await fs.rm(video.downloadingFlag)
}