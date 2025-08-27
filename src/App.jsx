import React, { useState, useEffect } from 'react';
import './index.css';

const sentences = [
  "React is a JavaScript library.",
  "Typing fast is fun and challenging.",
  "Measure your speed accurately.",
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes perfect.",
  "Consistency is the key to mastery.",
  "Speed improves with accuracy.",
  "Frontend development is creative.",
  "Never stop learning new things.",
  "Tailwind makes styling easier."
];

const MAX_SENTENCES = 8;

const TypingTest = () => {
  const [currentSentence, setCurrentSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(100);

  useEffect(() => {
    setCurrentSentence(sentences[sentenceIndex]);
  }, [sentenceIndex]);

  const handleChange = (e) => {
    const value = e.target.value;

    if (!startTime) setStartTime(Date.now());

    // Calculate real-time accuracy
    const accuracy = calculateAccuracy(value, currentSentence.substring(0, value.length));
    setCurrentAccuracy(accuracy);

    if (value === currentSentence) {
      setTotalTypedChars(prev => prev + value.length);

      if (sentenceIndex + 1 === MAX_SENTENCES) {
        setEndTime(Date.now());
        setIsTestComplete(true);
      } else {
        setSentenceIndex(prev => prev + 1);
        setUserInput('');
      }
    } else {
      setUserInput(value);
    }
  };

  const calculateAccuracy = (input, target) => {
    if (input.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === target[i]) correct++;
    }
    return Math.round((correct / input.length) * 100);
  };

  const calculateWPM = () => {
    if (!startTime || !endTime) return 0;
    const timeInMinutes = (endTime - startTime) / 1000 / 60;
    const words = totalTypedChars / 5;
    return Math.max(0, Math.round(words / timeInMinutes));
  };

  const renderColoredText = () => {
    const chars = currentSentence.split('');
    return chars.map((char, i) => {
      let className = 'transition-all duration-200';
      if (i < userInput.length) {
        className += userInput[i] === char 
          ? ' text-green-500 font-bold'
          : ' text-red-500 font-bold';
      }
      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  const handleRestart = () => {
    setSentenceIndex(0);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsTestComplete(false);
    setTotalTypedChars(0);
    setCurrentAccuracy(100);
    setCurrentSentence(sentences[0]);
  };

  const progressPercentage = (sentenceIndex / MAX_SENTENCES) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 px-4">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl p-8 max-w-3xl w-full text-center space-y-6 border border-white/20">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <span className="text-4xl">⌨️</span> 
          Typing Speed Test
        </h2>

        {!isTestComplete ? (
          <div className="space-y-6">
            <div className="relative h-2 bg-gray-200/50 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex justify-between text-sm text-gray-700 mb-4">
              <span className="bg-purple-100 px-3 py-1 rounded-full">
                Progress: {sentenceIndex + 1}/{MAX_SENTENCES}
              </span>
              <span className="bg-pink-100 px-3 py-1 rounded-full">
                Accuracy: {currentAccuracy}%
              </span>
            </div>

            <div className="text-lg font-mono bg-white/50 border border-purple-100 rounded-lg p-6 mb-4 min-h-[80px] text-left leading-relaxed shadow-inner">
              {renderColoredText()}
            </div>

            <textarea
              rows="3"
              className="w-full p-4 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none mb-4 font-mono text-lg transition-all duration-200 bg-white/70"
              value={userInput}
              onChange={handleChange}
              placeholder="Start typing here..."
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="space-y-6 py-8">
            <div className="text-2xl font-semibold text-purple-600 animate-fade-in">
              🎉 Test Complete!
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {calculateWPM()} WPM
              </div>
              <div className="text-lg text-gray-700">
                Accuracy: {currentAccuracy}%
              </div>
            </div>
            <button
              onClick={handleRestart}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
            >
              Try Again 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTest;