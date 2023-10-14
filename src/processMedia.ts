import fs from "node:fs/promises"
import { DownloadVideo } from "./DownloadVideo"
import { MediaResolved } from "./MediaResolved"
import { partsDir } from "./constants"

type Params = {
	type: "audio" | "video"
	video: DownloadVideo
	media: MediaResolved
}

export async function processMedia({ type, video, media }: Params) {
	const mediaExtension = type === "video" ? "m4v" : "m4a"

	const file = `${video.name}.${mediaExtension}`.replace(/[^\w.]/gi, '-')
	const filePath = `${partsDir}/${file}`
	const downloadingFlag = `${partsDir}/.${file}~`

	const existDownloadingFlag = await fs.exists(downloadingFlag)

	if (existDownloadingFlag) {
		console.log(`→ ⚠️ ${file} - ${type} is incomplete, restarting the download`)
		return
	}

	const fileExists = await fs
		.stat(filePath)
		.then(() => true).catch(() => false)
}