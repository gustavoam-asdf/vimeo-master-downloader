import { WriteStream } from "node:fs"
import { SegmentsChunk } from "./SegmentsChunk"
import { fetchWithRetry } from "./fetchWithRetry"

export type Params = {
	type: "audio" | "video"
	videoName: string
	chunk: SegmentsChunk
	totalSegments: number
	fileOutputStream: WriteStream
}

export async function downloadSegmentsChunk({
	type,
	videoName,
	chunk,
	totalSegments,
	fileOutputStream,
}: Params) {
	const { segments, startIndex } = chunk

	const response = await Promise.all(
		segments.map(
			async (segment, index) => {
				const currentIndex = startIndex + index
				console.log(`→ Downloading ${type} segment (${currentIndex}/${totalSegments}) of ${videoName}`)

				const response = await fetchWithRetry({
					url: segment.absoluteUrl,
					retries: 10,
				})

				const data = await response.text()

				return Buffer.from(data)
			}
		)
	)

	const buffer = Buffer.concat(response)

	fileOutputStream.write(buffer)
}