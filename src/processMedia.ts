import { createWriteStream } from "node:fs"
import fs from "node:fs/promises"
import { DownloadVideo } from "./DownloadVideo"
import { MediaResolved } from "./MediaResolved"
import { downloadSegments } from "./downloadSegments"
import { getVideoFilesTarget } from "./getVideoFilesTarget"

type Params = {
	type: "audio" | "video"
	downloadVideo: DownloadVideo
	mediaResolved: MediaResolved
}

export async function processMedia({ type, downloadVideo, mediaResolved }: Params) {
	const files = getVideoFilesTarget({ downloadVideo: downloadVideo })
	const { filePath } = files[type]

	const initBuffer = Buffer.from(mediaResolved.init_segment, "base64")
	await fs.writeFile(filePath, initBuffer)

	const fileOutputStream = createWriteStream(filePath, {
		flags: "a",
	})

	await downloadSegments({
		type,
		videoName: downloadVideo.name,
		segments: mediaResolved.segments,
		fileOutputStream,
	})

	console.log(`→ 🏁 ${downloadVideo.name} - ${type} done`)
}