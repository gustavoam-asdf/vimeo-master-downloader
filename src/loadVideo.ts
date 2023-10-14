import { Video } from "./Video"
import { fetchWithRetry } from "./fetchWithRetry"

export async function loadVideo(video: Video) {
	const masterUrl = new URL(video.url).toString()

	const master = await fetchWithRetry({ url: masterUrl })

	console.log(master)
}