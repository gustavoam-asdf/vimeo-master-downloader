import { SegmentResolved } from "./SegmentResolved"

export interface SegmentsChunk {
	startIndex: number
	segments: SegmentResolved[]
}

export function createSegmentsChunks(segments: SegmentResolved[], chunkSize: number): SegmentsChunk[] {
	const chunks: SegmentsChunk[] = []

	for (let i = 0; i < segments.length; i += chunkSize) {
		const startIndex = i
		const endIndex = i + chunkSize

		const segmentsChunk = segments.slice(startIndex, endIndex)

		chunks.push({
			startIndex,
			segments: segmentsChunk,
		})
	}

	return chunks
}