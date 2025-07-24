import { useCallback, useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, CheckCircle, XCircle } from "lucide-react";
import { UserContext } from "@/store/UserStore";
import giveRandomTips from "./giveRandomTips";
import { useNavigate } from "react-router-dom";

interface Question {
  expression: string;
  result: string;
  options: string[];
}

interface LevelInfo {
  id: number;
  timeGiven: number;
  difficulty: string;
  questions: Question[];
}

function PlayLevels({ levelInfo }: { levelInfo: LevelInfo }) {
  const navigate = useNavigate();
  const [equation, setEquation] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(levelInfo.timeGiven);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const context = useContext(UserContext);
  const [levelCompleted, setLevelCompleted] = useState(true);

  if (!context) {
    throw new Error("didnt get context");
  }
  const { username } = context;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev: number) => prev - 1);
      } else {
        setTimeLeft(levelInfo.timeGiven);
        if (currentQuestionIndex < levelInfo.questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isPlaying, currentQuestionIndex, levelInfo]);

  const setOptionsAndEquation = useCallback(() => {
    if (!isPlaying || currentQuestionIndex >= levelInfo.questions.length){
    return;}

    const currentQuestion = levelInfo.questions[currentQuestionIndex];
    setEquation(currentQuestion.expression);
    setResult(currentQuestion.result);
    setOptions(currentQuestion.options);
  }, [currentQuestionIndex, levelInfo, isPlaying]);

  const checkAnswer = (userAnswer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(userAnswer);
    setIsAnswered(true);

    setTimeout(() => {
      if (userAnswer != result) {
        setIsPlaying(false);
        setLevelCompleted(false);
        setTimeLeft(0);
      }

      if (currentQuestionIndex < levelInfo.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(levelInfo.timeGiven);
      }
      setIsAnswered(false);
      setSelectedAnswer(null);
    }, 1000);
  };

  useEffect(() => {
    setOptionsAndEquation();
  }, [currentQuestionIndex, setOptionsAndEquation]);

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    // Removed setRightAnswers(0) as rightAnswers is unused
    // setWrongAnswers(0);
    setTimeLeft(levelInfo.timeGiven);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsPlaying(true);
    setLevelCompleted(true);
  };

  const shareScore = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Can you beat my score?",
          text: `${username} completed the level ${levelInfo.id} of Maths Challenge \nTry to beat that level !, \nPlay now at: ${window.location.href}
            `,
          // url: window.location.href
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      alert("Cannot share, please copy the link manually.");
    }
  };

  const nextLevel = () => {
    const nextLevelId = levelInfo.id + 1;
    if (nextLevelId <= 15) {
        navigate(`/levels/${nextLevelId}`);
        resetGame();
    } else {
      navigate("/levels");
    }
  };

  return (
    <div className="bg-gradient-to-t from-[#262626] to-[#0c0a09]  retro  min-h-screen flex items-center justify-center p-4">
      <div>
        {isPlaying ? (
          <div className="w-full max-w-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h1 className="text-5xl text-gray-100 font-bold ">
                  {" "}
                  Math Challenge{" "}
                </h1>
              </div>
              <p className="text-gray-600">
                Test your math skills and solve as many problems as you can!
              </p>
            </div>

            <Card className="bg-[#292524] backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="flex text-4xl text-white items-center justify-center  gap-2 mb-4">
                  <Timer className="h-15 w-5 text-orange-600" />
                  {timeLeft}s
                </div>
                <Progress
                  value={(timeLeft / levelInfo.timeGiven) * 100}
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
                    let buttonVariant: "default" | "destructive" | "secondary" =
                      "default";
                    let buttonClass =
                      "h-16 cursor-pointer text-xl font-semibold transition-all duration-200 hover:scale-105";

                    if (isAnswered && selectedAnswer === option) {
                      if (option === result) {
                        buttonVariant = "default";
                        buttonClass +=
                          " bg-green-500 hover:bg-green-600 text-white";
                      } else {
                        buttonVariant = "destructive";
                      }
                    } else if (isAnswered && option === result) {
                      buttonVariant = "default";
                      buttonClass +=
                        " bg-green-500 hover:bg-green-600 text-white";
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
                        <span className="text-lg font-semibold">
                          Correct! Well done!
                        </span>
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
        ) : (
          <div className="text-center">
            {levelCompleted ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="text-gray-400 text-2xl font-bold mb-2">
                    LEVEL COMPLETED!
                  </div>
                  <div className="text-white text-4xl md:text-6xl text-center">
                    Congrats , {username}!
                  </div>
                </div>
                <div className="text-center my-2">
                  <p className="text-green-400 text-xl md:text-2xl mt-2">
                    Great job! You completed {levelInfo.difficulty} level!
                  </p>
                </div>
                <div className="flex items-center justify-center mt-10 gap-5">
                  <Button
                    onClick={shareScore}
                    className="p-5 bg-gray-600 hover:bg-gray-700 hover:scale-105  text-lg cursor-pointer"
                  >
                    Share Achievement
                  </Button>
                  <Button
                    className="p-5 bg-gray-600 hover:bg-gray-700 hover:scale-105  text-lg cursor-pointer"
                    onClick={nextLevel}
                  >
                    Next Level
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="text-white text-4xl md:text-6xl ">
                    Try Again
                  </div>
                </div>
                <div className="text-center my-2">
                  <p className="text-gray-400 text-xl md:text-2xl mt-2">
                    {" "}
                    Tip: {giveRandomTips()}
                  </p>
                </div>
                <div className="flex items-center justify-center mt-10 gap-5">
                  <Button
                    className="p-5 bg-gray-600 hover:bg-gray-700 hover:scale-105 text-lg cursor-pointer"
                    onClick={resetGame}
                  >
                    Try Again
                  </Button>
                  {/* <Button
                    onClick={shareScore}
                    className="p-5 bg-gray-600 hover:bg-gray-700 hover:scale-105 text-lg cursor-pointer"
                  >
                    Share Your Score
                  </Button> */}
                </div>
              </>
            )}
            <div className="mt-4">
              <Button
                className="p-5 bg-gray-600 hover:bg-gray-700 hover:scale-105 text-lg cursor-pointer"
                onClick={() => navigate("/menu")}
              >
                Back to Menu
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayLevels;
