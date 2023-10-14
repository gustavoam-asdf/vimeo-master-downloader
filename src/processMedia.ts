import { createWriteStream } from "node:fs"
import fs from "node:fs/promises"
import { DownloadVideo } from "./DownloadVideo"
import { MediaResolved } from "./MediaResolved"
import { downloadSegments } from "./downloadSegments"
import { getVideoFilesTarget } from "./getVideoFilesTarget"

type Params = {
	type: "audio" | "video"
	video: DownloadVideo
	media: MediaResolved
}

export async function processMedia({ type, video, media }: Params) {
	const files = getVideoFilesTarget({ video })
	const { filePath } = files[type]

	const initBuffer = Buffer.from(media.init_segment, "base64")
	await fs.writeFile(filePath, initBuffer)

	const fileOutputStream = createWriteStream(filePath, {
		flags: "a",
	})

	await downloadSegments({
		type,
		videoName: video.name,
		segments: media.segments,
		fileOutputStream,
	})

	console.log(`→ 🏁 ${video.name} - ${type} done`)
}