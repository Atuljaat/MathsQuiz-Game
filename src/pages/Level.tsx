// @ts-nocheck
import PlayLevels from "./PlayLevels";
import { useContext } from "react"
import { UserContext } from "@/store/UserStore"
import { useParams } from "react-router-dom";
import levels from './levels.json'

function Level() {
    const context = useContext(UserContext);
    const { id } = useParams();
    if (!context) {
        throw new Error("UserContext is not available");
    }
    const levelInfo = levels[id-1]
    console.log(levelInfo);
  return (
    <PlayLevels levelInfo={levelInfo} />
  )
}

export default Level