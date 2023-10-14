import { MasterVideo } from "./MasterVideo"
import { Video } from "./Video"
import { fetchWithRetry } from "./fetchWithRetry"
//import url from "node:url"

export async function loadVideo(video: Video) {
	const masterUrl = new URL(video.url).toString()

	const response = await fetchWithRetry({ url: masterUrl })
	const master = await response.json() as MasterVideo

	const videoParts = master.video.sort((a, b) => a.avg_bitrate - b.avg_bitrate)
	const audioParts = master.audio?.sort((a, b) => a.avg_bitrate - b.avg_bitrate)
}