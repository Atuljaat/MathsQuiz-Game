import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useContext } from 'react'
import { UserContext } from '@/store/UserStore'
import { Dices } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("UserContext is not available")
    }
    
    const { setUsername, username , setIsLoggedIn } = context

    const setRandomUsername = async () => {
        try {
            const response = await fetch('https://randomuser.me/api/')
            if (response.ok) {
                const jsonFormat = await response.json()
                const name = jsonFormat.results[0].login.username
                setUsername(name);
        }
    } catch (error) {
        console.log(error)
    }
    }

    const enterGame = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (username.trim() === '') {
            alert('Please enter a username')
            return
        } 
        setUsername(username.trim())
        setIsLoggedIn(true)
        localStorage.setItem('username', username.trim())
        navigate('/menu')
    }

  return (
    <div className="bg-gradient-to-t from-[#262626] to-[#0c0a09]  retro  min-h-screen flex items-center justify-center p-4">
        <div>
                    <div className="text-white text-4xl text-center" >
                        Please Enter Username to Play
                    </div>
                        <form className="flex flex-col gap-3 items-center justify-center mt-8" onSubmit={enterGame}>
                        <div className="flex items-center justify-center gap-5 mb-4">
                        <Input
                            className="w-full p-5  max-w-xs text-gray-300"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
    
                        <Dices onClick={setRandomUsername} className="cursor-pointer hover:scale-105" size={34} color={'white'} />
                        </div>
                        <Button className="p-5 bg-gray-600 hover:bg-gray-700 hover:scale-105  text-lg cursor-pointer ml-2">
                            Submit
                        </Button>
                        </form>
                </div>
    </div>
  )
}

export default Login