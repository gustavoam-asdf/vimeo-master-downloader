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

	const videoParts: MediaResolved[] = videoOrderedParts.map(part => ({
		...part,
		url: new URL(part.base_url, masterUrl).toString()
	}))

	const audioParts: MediaResolved[] | undefined = audioOrderedParts
		? audioOrderedParts.map(part => ({
			...part,
			url: new URL(part.base_url, masterUrl).toString()
		}))
		: undefined

	const videoPart = videoParts[0]

	console.log({
		...videoPart,
		segments: videoPart.segments.length
	})
}