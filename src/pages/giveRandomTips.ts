const Tips = [
        'Think fast and dont overthink the question.',
        'I forget to handle decimals , so every decimal option is correct.',
        'If you are not sure about the answer , just guess it.',
        'You can use a calculator , if you have get time to use one',
        'Get good ',
        'hahahahahhahahahahahaahahaha ',
        'Inform an adult if you are having trouble with the game , just kidding.',
        'ask Ai ',
        'now i m out of tips ',
        'sometimes no tip is a good tip',
        ' Oh no , i ran out of tips',
        'Chatgpt generate me some tips for a maths game',
    ]

const giveRandomTips = () => {
    const randomIndex = Math.floor(Math.random() * Tips.length);
    return Tips[randomIndex];
}

export default giveRandomTips;