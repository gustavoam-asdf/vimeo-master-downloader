import { DownloadVideo } from "./DownloadVideo";
import { partsDir } from "./constants";

type Params = {
	downloadVideo: DownloadVideo
}

export function getVideoFilesTarget({ downloadVideo }: Params) {
	const videoFile = `${downloadVideo.name}.m4v`.replace(/[^\w.]/gi, '-')
	const videoFilePath = `${partsDir}/${videoFile}`
	const videoDownloadingFlag = `${partsDir}/.${videoFile}~`

	const audioFile = `${downloadVideo.name}.m4a`.replace(/[^\w.]/gi, '-')
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