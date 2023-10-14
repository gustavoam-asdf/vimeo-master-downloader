import url from "node:url";
import { DownloadVideo } from "./DownloadVideo";
import { MasterVideo } from "./MasterVideo";
import { MediaResolved } from "./MediaResolved";
import { fetchWithRetry } from "./fetchWithRetry";

export async function loadVideo(video: DownloadVideo) {
	const masterUrl = new URL(video.url).toString()

	const response = await fetchWithRetry({ url: masterUrl })
	const master = await response.json() as MasterVideo

	const videoOrderedParts = [...master.video].sort((a, b) => a.avg_bitrate - b.avg_bitrate)
	const audioOrderedParts = master.audio
		? [...master.audio].sort((a, b) => a.avg_bitrate - b.avg_bitrate)
		: undefined

	const mediaUrl = url.resolve(masterUrl, master.base_url)

	const videoParts: MediaResolved[] = videoOrderedParts.map((part, i) => ({
		...part,
		absoluteUrl: mediaUrl,
		segments: part.segments.map(segment => ({
			...segment,
			absoluteUrl: `${mediaUrl}${part.base_url}${segment.url}`
		}))
	}))

	const audioParts: MediaResolved[] | undefined = audioOrderedParts
		? audioOrderedParts.map(part => ({
			...part,
			absoluteUrl: mediaUrl,
			segments: part.segments.map(segment => ({
				...segment,
				absoluteUrl: `${mediaUrl}${part.base_url}${segment.url}`
			}))
		}))
		: undefined
}