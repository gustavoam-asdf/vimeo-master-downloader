import fs from "node:fs/promises"
import videos from "../videos.json"
import { partsDir } from "./constants"
import { loadVideo } from "./loadVideo"

await fs.mkdir(partsDir, {
	recursive: true
})

await Promise.all(
	videos.map(loadVideo)
)