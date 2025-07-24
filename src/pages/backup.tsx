import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, CheckCircle, XCircle   } from "lucide-react";
import { useContext, useDebugValue, useEffect } from "react";
import { UserContext } from "@/store/UserStore";
import { giveRandomTips } from "../randomTips.js";
import { useState } from "react";


function PlayLevels({levelInfo}) {
    const context = useContext(UserContext);
    const [timeLeft, setTimeLeft] = useState(5);
    if (!context) {
        throw new Error("UserContext is not available");
    }

    const { username , setIsPlaying} = context;

    const resetLevel = () => {
        setIsPlaying(true);
    }
    

    const [rightAnswers, setRightAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [equation, setEquation] = useState('');
    const questions = levelInfo.questions;

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

    useEffect(() => {

    } , [rightAnswers, wrongAnswers]);

    const checkAnswer = (option,result) => {
        setSelectedAnswer(option);
        setIsAnswered(true);
        if (option === result) {
            setRightAnswers(rightAnswers + 1);
        } else {
            setWrongAnswers(wrongAnswers + 1);
        }
    };

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
                                                    onClick={() => checkAnswer(option, option.result)}
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
                                <div className={`text-white text-4xl md:text-6xl text-center `}>
                                    Try Again, you scored {rightAnswers}
                                </div>
                            </div>
                            <div className="text-center my-2">
                                <p className="text-gray-400 text-xl md:text-2xl mt-2"> Tip: {giveRandomTips()}</p>
                            </div>
                            <div className="flex items-center justify-center my-10 gap-5" >
                                <Button className="p-5 bg-gray-600 hover:bg-gray-700 hover:scale-105  text-lg cursor-pointer" onClick={resetLevel} >
                                    Try Again
                                </Button>
                                <Button onClick={shareScore} className="p-5 bg-gray-600 hover:bg-gray-700 hover:scale-105  text-lg cursor-pointer">
                                    Share Your Score
                                </Button>
                            </div>
                        </div>
                    }
                </div>
        </div>
  )
}

export default PlayLevels