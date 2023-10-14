import { Video } from "./Video"
import { fetchWithRetry } from "./fetchWithRetry"

export async function loadVideo(video: Video) {
	const masterUrl = new URL(video.url).toString()

	const response = await fetchWithRetry({ url: masterUrl })
	const master = await response.json()
	console.log(master)
}