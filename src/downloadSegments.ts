import { WriteStream } from "node:fs"
import { SegmentResolved } from "./SegmentResolved"
import { createSegmentsChunks } from "./SegmentsChunk"
import { downloadSegmentsChunk } from "./downloadSegmentsChunk"

type Params = {
	type: "audio" | "video"
	videoName: string
	segments: SegmentResolved[]
	chunkSize?: number
	fileOutputStream: WriteStream
}

export async function downloadSegments({
	type,
	videoName,
	segments,
	fileOutputStream,
	chunkSize = 10,
}: Params) {
	const totalSegments = segments.length

	const chunks = createSegmentsChunks(segments, chunkSize)

	for (const chunk of chunks) {
		await downloadSegmentsChunk({
			type,
			chunk,
			videoName,
			totalSegments,
			fileOutputStream,
		})
	}
}