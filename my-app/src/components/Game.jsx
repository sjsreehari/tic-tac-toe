import { useState, useEffect } from 'react';
import Board from './Board';
import Confetti from 'react-confetti';

export default function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [winner, setWinner] = useState(null);
  const [showResult, setShowResult] = useState(null);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('isMuted') === 'true');
  const [musicStarted, setMusicStarted] = useState(false);
  const [audio, setAudio] = useState(null);

  // Initialize audio
  useEffect(() => {
    const audioInstance = new Audio('/music.mp3');
    audioInstance.loop = true;
    audioInstance.volume = 0.5;
    setAudio(audioInstance);

    // Fallback to hosted URL if local music.mp3 fails
    audioInstance.onerror = () => {
      audioInstance.src = './music.mp3'; // Replace with your hosted URL
    };

    return () => {
      audioInstance.pause();
    };
  }, []);

  // Handle mute state
  useEffect(() => {
    if (audio) {
      audio.muted = isMuted;
      localStorage.setItem('isMuted', isMuted);
    }
  }, [isMuted, audio]);

  // Start music on user interaction
  const startMusic = () => {
    if (audio && !musicStarted) {
      audio.play().catch((err) => console.log('Audio play failed:', err));
      setMusicStarted(true);
    }
  };

  // Calculate winner or draw
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every((square) => square !== null) ? 'Draw' : null;
  };

  // Handle square click
  const handleClick = (index) => {
    if (squares[index] || winner || showResult) return;
    const newSquares = [...squares];
    newSquares[index] = currentPlayer;
    setSquares(newSquares);

    const gameWinner = calculateWinner(newSquares);
    if (gameWinner) {
      setWinner(gameWinner);
      setShowResult(gameWinner);
      if (gameWinner !== 'Draw') {
        setScores((prev) => ({
          ...prev,
          [gameWinner]: prev[gameWinner] + 1,
        }));
      }
      // Auto-reset game after 3 seconds
      setTimeout(() => {
        setSquares(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner(null);
        setShowResult(null);
      }, 3000);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  // Reset game
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setShowResult(null);
  };

  // Reset scores
  const resetScores = () => {
    setScores({ X: 0, O: 0 });
    resetGame();
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Status message
  const status = showResult
    ? showResult === 'Draw'
      ? 'Game is a Draw!'
      : `Player ${showResult} Won!`
    : `Current Move: Player ${currentPlayer}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 font-ghibli">
      <div className="text-center text-white p-6 sm:p-8 bg-gradient-to-br from-teal-500 to-purple-600 rounded-3xl shadow-2xl w-full max-w-[32rem] animate-fade-in">
        {showResult && showResult !== 'Draw' && (
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
        )}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-yellow-200 drop-shadow-lg">Tic-Tac-Toe</h1>
        <div className="flex justify-between mb-4 text-xl sm:text-2xl">
          <div className="text-blue-200">X: {scores.X}</div>
          <div className="text-pink-200">O: {scores.O}</div>
        </div>
        <p className="text-2xl sm:text-3xl mb-4 text-yellow-100">{status}</p>
        {showResult && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-3xl animate-fade-out">
            <div className="text-4xl sm:text-5xl font-bold text-yellow-300 drop-shadow-lg">
              {showResult === 'Draw' ? 'Game is a Draw!' : `Player ${showResult} Won!`}
            </div>
          </div>
        )}
        <Board squares={squares} onClick={handleClick} currentPlayer={currentPlayer} />
        <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-lg font-bold text-white shadow-lg transition-all hover:scale-105 animate-fade-in"
            onClick={resetGame}
          >
            Reset Game
          </button>
          <button
            className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-lg font-bold text-white shadow-lg transition-all hover:scale-105 animate-fade-in"
            onClick={resetScores}
          >
            Reset Scores
          </button>
          <button
            className="px-5 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-lg font-bold text-white shadow-lg transition-all hover:scale-105 animate-fade-in"
            onClick={musicStarted ? toggleMute : startMusic}
          >
            {musicStarted ? (isMuted ? 'Unmute' : 'Mute') : 'Start Music'}
          </button>
        </div>
      </div>
    </div>
  );
}