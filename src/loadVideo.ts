import { DownloadVideo } from "./DownloadVideo"
import { MasterVideo } from "./MasterVideo"
import { MediaResolved } from "./MediaResolved"
import { fetchWithRetry } from "./fetchWithRetry"
import { processAudioMedia } from "./processAudioMedia"
import { processVideoMedia } from "./processVideoMedia"

export async function loadVideo(downloadVideo: DownloadVideo) {
	const masterUrl = new URL(downloadVideo.url).toString()

	const response = await fetchWithRetry({ url: masterUrl })
	const master = await response.json() as MasterVideo

	const availableVideos = [...master.video].sort((a, b) => a.avg_bitrate - b.avg_bitrate)
	const availableAudios = master.audio
		? [...master.audio].sort((a, b) => a.avg_bitrate - b.avg_bitrate)
		: undefined

	const betterVideo = availableVideos[availableVideos.length - 1]
	const betterAudio = availableAudios ? availableAudios[availableAudios.length - 1] : undefined

	const mediaUrl = new URL(master.base_url, masterUrl).href

	const videoResolved: MediaResolved = {
		...betterVideo,
		absoluteUrl: mediaUrl,
		segments: betterVideo.segments.map(segment => ({
			...segment,
			absoluteUrl: `${mediaUrl}${betterVideo.base_url}${segment.url}`
		}))
	}

	const audioResolved: MediaResolved | undefined = betterAudio
		? {
			...betterAudio,
			absoluteUrl: mediaUrl,
			segments: betterAudio.segments.map(segment => ({
				...segment,
				absoluteUrl: `${mediaUrl}${betterAudio.base_url}${segment.url}`
			}))
		}
		: undefined

	await processVideoMedia({
		downloadVideo,
		videoResolved,
	})

	if (audioResolved) {
		await processAudioMedia({
			downloadVideo,
			audioResolved
		})
	}
}