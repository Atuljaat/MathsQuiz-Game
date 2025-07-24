import { useCallback, useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, CheckCircle, XCircle   } from "lucide-react";
import { UserContext } from "@/store/UserStore";
import giveRandomTips from "./giveRandomTips";
import { useNavigate } from "react-router-dom";

function Maths() {
    const navigate = useNavigate();
    const [equation, setEquation] = useState('')
    const [options, setOptions] = useState<number[]>([])
    const [result, setResult] = useState(0)
    const [totalQuestions, setTotalQuestions] = useState(0)
    const [rightAnswers, setRightAnswers] = useState(0)
    const [wrongAnswers, setWrongAnswers] = useState(0)
    const [timeLeft, setTimeLeft] = useState(5)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [isPlaying, setIsPlaying] = useState(true);
    const [difficulty, setDifficulty] = useState('easy');
    const context  = useContext(UserContext);
    const [isHighScoreBeaten, setIsHighScoreBeaten] = useState(false);
    
    if (!context) {
        throw new Error('didnt get context');
    }
    const { username, highScore, setHighScore } = context

    

    useEffect(() => {
        const gameDifficulty = {
            easy: {
                time: 5,
                totalQuestions: 10,
            },
            medium: {
                time: 4,
                totalQuestions: 20,
            },
            hard: {
                time: 3,
                totalQuestions: 30,
            },
            extreme: {
                time: 2,
                totalQuestions: 50,
            },
            god: {
                time: 1,
                totalQuestions: 100,
            }
        }
        if (!isPlaying) return;
        if (totalQuestions > 10) {
            setDifficulty('medium');
        } else if (totalQuestions > 20) {
            setDifficulty('hard');
        } else if (totalQuestions > 30) {
            setDifficulty('extreme');
        } else if (totalQuestions > 50) {
            setDifficulty('god');
        }

        const interval = setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft(prev => prev - 1);
            } else {
                // @ts-expect-error: idk how can i fix this
                setTimeLeft(gameDifficulty[difficulty].time);
                setTotalQuestions(prev => prev + 1);
                setWrongAnswers(prev => prev + 1);
                setIsAnswered(false);
                setSelectedAnswer(null);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft, isPlaying, totalQuestions, difficulty]);

    const generateRandomNumber = useCallback((min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min) + min);
    }, []);

    const getRandomCloseNumbers = useCallback((num: number, length: number) => {
        const numbers: number[] = [];
        for (let i = 0; i < length; i++) {
            let randomNum;
            do {
                randomNum = generateRandomNumber(num - 5, num + 5);
            } while (numbers.includes(randomNum) || randomNum === num);
            numbers.push(randomNum);
        }
        return numbers;
    }, [generateRandomNumber]);

    const equationGenerator = useCallback(() => {
        const gameDifficulty = {
            easy: {
                time: 5,
                totalQuestions: 10,
                rangeStart: 1,
                rangeEnd: 10,
            },
            medium: {
                time: 4,
                totalQuestions: 20,
                rangeStart: 10,
                rangeEnd: 100,
            },
            hard: {
                time: 3,
                totalQuestions: 30,
                rangeStart: 100,
                rangeEnd: 1000,
            },
            extreme: {
                time: 2,
                totalQuestions: 50,
                rangeStart: 1000,
                rangeEnd: 10000,
            },
            god: {
                time: 1,
                totalQuestions: 100,
                rangeStart: 10000,
                rangeEnd: 1000000,
            }
        }
        if (wrongAnswers == 1) {
            setIsPlaying(false);
        }
        const operatorsArray = ['+', '-', '*', '/']
        // @ts-expect-error: idk how why this is happening
        const rangeStart = gameDifficulty[difficulty].rangeStart;
        // @ts-expect-error: whyyyyyy
        const rangeEnd = gameDifficulty[difficulty].rangeEnd;
        const operator = operatorsArray[Math.floor(Math.random() * operatorsArray.length)]
        const equation: string = `${generateRandomNumber(rangeStart, rangeEnd)} ${operator} ${generateRandomNumber(rangeStart, rangeEnd)}`
        const result: number = Number((eval(equation)).toFixed(2))
        return [equation, result]
    }, [generateRandomNumber, wrongAnswers, setIsPlaying, difficulty]);

    const checkAnswer = (userAnswer: number) => {
        if (isAnswered) return;

        setSelectedAnswer(userAnswer);
        setIsAnswered(true);

        setTimeout(() => {
            if (userAnswer === result) {
                setRightAnswers(prev => prev + 1);
                if (rightAnswers + 1 > highScore) {
                    setHighScore(rightAnswers + 1);
                    localStorage.setItem('highScore', String(rightAnswers + 1));
                    setIsHighScoreBeaten(true);
                }
            } else {
                setWrongAnswers(prev => prev + 1);
            }
            setTotalQuestions(prev => prev + 1);
            setTimeLeft(5);
            setIsAnswered(false);
            setSelectedAnswer(null);
        }, 1000);
    }

    const setOptionsAndEquation = useCallback(() => {
        if (!isPlaying) return;
        const [eq, res] = equationGenerator();
        setEquation(String(eq));
        setResult(Number(res));
        const options = getRandomCloseNumbers(Number(res), 4);
        const randomIndex = generateRandomNumber(0, 4)
        options[randomIndex] = Number(res);
        setOptions(options);
    }, [equationGenerator, getRandomCloseNumbers, generateRandomNumber, isPlaying]);

    useEffect(() => {
        setOptionsAndEquation();
    }, [totalQuestions, rightAnswers, wrongAnswers, setOptionsAndEquation]);


    const resetGame = () => {
        setTotalQuestions(0);
        setRightAnswers(0);
        setWrongAnswers(0);
        setTimeLeft(5);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setIsPlaying(true);
        setIsHighScoreBeaten(false);
    };

    // const enterGame = () => {
    //     if (String(username).trim() === '') {
    //         alert('Please enter a valid username');
    //         return;
    //     }
    //     console.log('login in happen')
    //     setIsLoggedIn(true);
    //     localStorage.setItem('username', username);
    //     resetGame();
    // }

    const shareScore = () => {
        if (navigator.share) {
            navigator.share({
            title: 'Can you beat my score?',
            text: `${username} scored ${rightAnswers} points in Maths Challenge \nTry to beat my score!, \nPlay now at: ${window.location.href}
            `,
            // url: window.location.href
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
        } else {
            alert('Cannot share, please copy the link manually.');
        }
    }


    return (
        <div className="bg-gradient-to-t from-[#262626] to-[#0c0a09]  retro  min-h-screen flex items-center justify-center p-4">
                <div>
                    {isPlaying ?
                        <div className="w-full max-w-2xl space-y-6">
                            <div className="text-center space-y-2">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <h1 className="text-5xl text-gray-100 font-bold "> Math Challenge </h1>
                                </div>
                                <p className="text-gray-600">Test your math skills and solve as many problems as you can!</p>
                            </div>

                            <Card className="bg-[#292524] backdrop-blur-sm border-0 shadow-xl">
                                <CardHeader className="text-center pb-4">
                                    <div className="flex text-4xl text-white items-center justify-center  gap-2 mb-4">
                                        <Timer className="h-15 w-5 text-orange-600" />
                                        {timeLeft}s
                                    </div>
                                    <Progress
                                        value={(timeLeft / 5) * 100}
                                        className="w-full h-2"
                                    />
                                </CardHeader>

                                <CardContent className="space-y-8">
                                    <div className="text-center">
                                        <div className="poppins font-semibold text-5xl font-mono text-gray-200 rounded-lg p-6 inline-block min-w-[200px]">
                                            {equation} = ?
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 poppins">
                                        {options.map((option, index) => {
                                            let buttonVariant: "default" | "destructive" | "secondary" = "default";
                                            let buttonClass = "h-16 cursor-pointer text-xl font-semibold transition-all duration-200 hover:scale-105";

                                            if (isAnswered && selectedAnswer === option) {
                                                if (option === result) {
                                                    buttonVariant = "default";
                                                    buttonClass += " bg-green-500 hover:bg-green-600 text-white";
                                                } else {
                                                    buttonVariant = "destructive";
                                                }
                                            } else if (isAnswered && option === result) {
                                                buttonVariant = "default";
                                                buttonClass += " bg-green-500 hover:bg-green-600 text-white";
                                            }

                                            return (
                                                <Button
                                                    key={index}
                                                    variant={buttonVariant}
                                                    className={buttonClass}
                                                    onClick={() => checkAnswer(option)}
                                                    disabled={isAnswered}
                                                >
                                                    {option}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    {isAnswered && (
                                        <div className="text-center">
                                            {selectedAnswer === result ? (
                                                <div className="flex items-center justify-center gap-2 text-green-600">
                                                    <CheckCircle className="h-6 w-6" />
                                                    <span className="text-lg font-semibold">Correct! Well done!</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2 text-red-600">
                                                    <XCircle className="h-6 w-6" />
                                                    <span className="text-lg font-semibold">
                                                        Wrong! The answer was {result}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        :
                        <div className="text-center" >
                            <div className="flex flex-col items-end">
                                {
                                    isHighScoreBeaten && 
                                    <div className=" translate-y-[-10] text-yellow-400 font-semibold text-xl rotate-12 mb-2">
                                        NEW HIGHSCORE
                                    </div>
                                }
                                <div className={`text-white text-4xl md:text-6xl ${isHighScoreBeaten ? `md:text-right` : `text-center` } `}>
                                    Try Again, you scored {rightAnswers}
                                </div>
                            </div>
                            <div className="text-center my-2">
                                <p className="text-gray-400 text-xl md:text-2xl mt-2"> Tip: {giveRandomTips()}</p>
                            </div>
                            <div className="text-center my-2">
                                <p className="text-gray-300 text-xl lg:text-2xl mt-2"> HighScore : {highScore} </p>
                            </div>
                            <div className="flex items-center justify-center mt-10 gap-5" >
                                <Button className="p-5 bg-gray-600 hover:bg-gray-700 hover:scale-105  text-lg cursor-pointer" onClick={resetGame} >
                                    Try Again
                                </Button>
                                <Button onClick={shareScore} className="p-5 bg-gray-600 hover:bg-gray-700 hover:scale-105  text-lg cursor-pointer">
                                    Share Your Score
                                </Button>
                            </div>
                            <div className="mt-4">
                                <Button className="p-5 bg-gray-600 hover:bg-gray-700 hover:scale-105  text-lg cursor-pointer" onClick={() => navigate('/menu')} >
                                    Back to Menu
                                </Button>
                            </div>
                        </div>
                    }
                </div>
        </div>
    );
}

export default Maths;
