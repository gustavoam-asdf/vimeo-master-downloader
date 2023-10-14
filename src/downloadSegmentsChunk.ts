import { WriteStream } from "node:fs"
import https from "node:https"
import { SegmentsChunk } from "./SegmentsChunk"

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

				const response = await new Promise((resolve: (data: Buffer) => void, reject) => {
					let data = Buffer.from([])
					https.get(segment.absoluteUrl, (res) => {
						if (res.statusCode !== 200) {
							reject(new Error(`Downloading segment with url '${segment.absoluteUrl}' failed with status: ${res.statusCode} ${res.statusMessage}`))
						}

						res.on("data", d => {
							data = Buffer.concat([data, d])
						})

						res.on("end", () => {
							resolve(data)
						})
					}).on("error", (err) => {
						reject(err)
					})
				})

				return response
			}
		)
	)

	const buffer = Buffer.concat(response)

	fileOutputStream.write(buffer)
}