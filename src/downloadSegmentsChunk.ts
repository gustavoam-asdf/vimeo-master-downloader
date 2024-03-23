import { WriteStream } from "node:fs"
import { SegmentResolved } from "./SegmentResolved"
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

				const downloadSegment = async (segment: SegmentResolved) => {
					const response = await fetchWithRetry({
						url: segment.absoluteUrl
					});
					if (!response.ok) {
						throw new Error(`Downloading segment with url '${segment.absoluteUrl}' failed with status: ${response.status} ${response.statusText}`);
					}
					const data = await response.arrayBuffer();
					const uint8Array = new Uint8Array(data);
					return uint8Array;
				}

				const response = await downloadSegment(segment);

				return response
			}
		)
	)

	const buffer = Buffer.concat(response)

	fileOutputStream.write(buffer)
}