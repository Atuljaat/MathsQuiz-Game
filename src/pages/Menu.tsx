import { useNavigate } from "react-router-dom"
import { useState } from "react"
import levels from './levels.json'

function Menu() {
    console.log(levels)
    const navigate = useNavigate()
    const [chooseLevels, setChooseLevels] = useState(false)


    const playEndlessMode = () => {
        navigate('/maths')
    }

    const chooseLevelsHandler = () => {
        setChooseLevels(true)
    }

    const selectLevel = (level: number) => {
        navigate(`/levels/${level}`)
    }

return (
    <>  
       { !chooseLevels ? (
            <div className="bg-gradient-to-t from-[#262626] to-[#0c0a09]  retro  min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-white text-4xl text-center">
                    Welcome to the Maths Game Menu
                </div>
                <div className="mt-8 text-white text-lg">
                    Here you can choose your game settings and start playing!
                </div>
                <div>
                    <ul>
                        <li className="flex items-center justify-center mt-8 gap-4 cursor-pointer">
                            <button onClick={chooseLevelsHandler} className="p-5 hover:text-gray-200 rounded bg-gray-600 hover:bg-gray-700 hover:scale-105 text-lg cursor-pointer mt-4">
                                Choose Levels
                            </button>
                            <button onClick={playEndlessMode} className="p-5  hover:text-gray-200 rounded bg-gray-600 hover:bg-gray-700 hover:scale-105 text-lg cursor-pointer mt-4">
                                Play endless mode
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        ) : 
        <div className="bg-gradient-to-t from-[#262626] to-[#0c0a09]  retro  min-h-screen flex flex-col items-center  p-4">
            <div className="text-gray-100 my-10 text-4xl text-center">
                Choose Levels Here : 
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3" >
                {
                    levels.map((level, index) => (
                        <button key={level.id} onClick={() => selectLevel(level.id)}>
                        <div  className="p-4 m-2 bg-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer transition-all duration-300" onClick={() => navigate(`/maths?level=${index + 1}`)}>
                            <h3 className="text-white text-xl font-semibold">{level.id}</h3>
                            <p className="text-gray-300">Difficulty: {level.difficulty}</p>
                        </div>
                        </button>
                    ))
                }
            </div>
        </div>
        }
    </>
  )
}

export default Menu