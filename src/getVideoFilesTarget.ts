import { DownloadVideo } from "./DownloadVideo";
import { partsDir } from "./constants";

type Params = {
	video: DownloadVideo
}

export function getVideoFilesTarget({ video }: Params) {
	const videoFile = `${video.name}.m4v`.replace(/[^\w.]/gi, '-')
	const videoFilePath = `${partsDir}/${videoFile}`
	const videoDownloadingFlag = `${partsDir}/.${videoFile}~`

	const audioFile = `${video.name}.m4a`.replace(/[^\w.]/gi, '-')
	const audioFilePath = `${partsDir}/${audioFile}`
	const audioDownloadingFlag = `${partsDir}/.${audioFile}~`

	return {
		video: {
			file: videoFile,
			filePath: videoFilePath,
			downloadingFlag: videoDownloadingFlag
		},
		audio: {
			file: audioFile,
			filePath: audioFilePath,
			downloadingFlag: audioDownloadingFlag
		}
	}
}