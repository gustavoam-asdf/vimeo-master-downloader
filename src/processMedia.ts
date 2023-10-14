import { createWriteStream } from "node:fs"
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

	const existFile = await fs.exists(filePath)

	if (existFile) {
		console.log(`→ ✅ ${file} - ${type} already exists`)
		return
	}

	await fs.writeFile(downloadingFlag, "")

	const initBuffer = Buffer.from(media.init_segment, "base64")
	await fs.writeFile(filePath, initBuffer)

	const fileOutputStream = createWriteStream(filePath, {
		flags: "a",
	})
}