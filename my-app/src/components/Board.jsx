export default function Board({ squares, onClick, currentPlayer }) {
  return (
    <div className="grid grid-cols-3 gap-2 w-[85vw] max-w-[26rem] sm:w-[65vw] sm:max-w-[30rem] mx-auto animate-fade-in">
      {squares.map((square, index) => (
        <button
          key={index}
          className={`h-[28vw] sm:h-[21vw] max-h-[8.5rem] sm:max-h-[10rem] text-4xl sm:text-5xl font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none border-4 ${
            square === 'X'
              ? 'bg-blue-300 text-blue-800 border-blue-500 glow-blue'
              : square === 'O'
              ? 'bg-pink-300 text-pink-800 border-pink-500 glow-pink'
              : 'bg-green-200 text-green-800 border-green-400 hover:bg-green-300'
          }`}
          onClick={() => onClick(index)}
          disabled={square !== null}
        >
          {square}
        </button>
      ))}
    </div>
  );
}