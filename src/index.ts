import videos from "../videos.json"
import { loadVideo } from "./loadVideo"


await Promise.all(
	videos.map(loadVideo)
)