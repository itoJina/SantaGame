import React, { useState, useEffect } from 'react';
import './App.css';
import backgroundImage from './back.png';
import gameBackground from './gameBackground.png';
import presentImage from './present.png';
import fakePresentImage from './purezennt.png';
import gameover from "./gameover.png";
import gameover100 from "./gameover100.png"; // New import for the gameover image when score is over 100
import backgroundMusic from './thats a Xmas.mp3';
import explosionSound from './explosion.mp3'; // New import for the explosion sound

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [position, setPosition] = useState(100);
  const [presents, setPresents] = useState([]);
  const [fakePresents, setFakePresents] = useState([]);
  const [volume, setVolume] = useState(1);
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0); // New state for score

  const startGame = () => {
    setGameStarted(true);
  };

  const incrementScore = () => { // New function to increment score
    setScore(prevScore => prevScore + 1);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setPosition(prev => prev - 1);
      }, 50);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver, position]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const presentTimer = setInterval(() => {
        const minHeight = 5; // Set the minimum height to 20%
        const maxHeight = 35; // Set the maximum height to 80%
        const height = Math.random() * (maxHeight - minHeight) + minHeight; // Generate a random height between 20 and 80
        setPresents(prev => [...prev, { id: Date.now(), position: 100, height }]);
      }, difficulty === 'hard' ? 300 : difficulty === 'medium' ? 600 : 3000); // If difficulty is hard, generate presents five times as fast
      return () => clearInterval(presentTimer);
    }
  }, [gameStarted, gameOver, difficulty]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const movePresentTimer = setInterval(() => {
        setPresents(prev => prev.map(present => ({ ...present, position: present.position - (difficulty === 'hard' ? 0.6 : 0.5) }))); // If difficulty is hard, move presents five times as fast
      }, 50);
      return () => clearInterval(movePresentTimer);
    }
  }, [gameStarted, gameOver, presents]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        const minHeight = 5; // Set the minimum height to 20%
        const maxHeight = 35; // Set the maximum height to 80%
        const height = Math.random() * (maxHeight - minHeight) + minHeight; // Generate a random height between 20 and 80
        setFakePresents(prev => [...prev, { id: Date.now(), position: 100, height }]);
          }, difficulty === 'hard' ? 700 : (difficulty === 'medium' ? 5000 / 3 : 5000)); // If difficulty is medium, generate fake presents three times as fast
          return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, difficulty]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const moveFakePresentTimer = setInterval(() => {
        setFakePresents(prev => prev.map(fakePresent => {
          if (fakePresent.position <= 0) {
            setGameOver(true);
          }
          return { ...fakePresent, position: fakePresent.position - 0.5 };
        }));
      }, 50);
      return () => clearInterval(moveFakePresentTimer);
    }
  }, [gameStarted, gameOver, fakePresents]);

  const removePresent = (id) => {
    setGameOver(true);
    setPresents(prev => prev.filter(present => present.id !== id));
  };

  const removeFakePresent = (id) => {
    setFakePresents(prev => prev.filter(fakePresent => fakePresent.id !== id));
    incrementScore();

    // Play explosion sound
    const audio = new Audio(explosionSound);
    audio.play();
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      {!gameStarted ? (
        <div>
          <img src={backgroundImage} alt="description" style={{ maxWidth: '50%', maxHeight: '50%' }} />
          <select onChange={(e) => setDifficulty(e.target.value)} style={{ 
            position: 'absolute', 
            bottom: '25%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#FFD700',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '20px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            <option value="easy">難易度: 簡単</option>
            <option value="medium">難易度: 普通</option>
            <option value="hard">難易度: 難しい</option>
          </select>
          <button onClick={startGame} style={{ 
            position: 'absolute', 
            bottom: '17%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#FFD700',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '20px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            ゲームスタート
          </button>
        </div>
      ) : gameOver ? (
        <div>
           <img src={score >= 100 ? gameover100 : gameover} alt="description" style={{ maxWidth: '50%', maxHeight: '50%' }} />
           <button onClick={reloadPage} style={{ 
            position: 'absolute', 
            bottom: '10%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#FFD700',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '20px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
            }}>
            トップに戻る
          </button>
          <div style={{ 
            position: 'absolute', 
            top: '30%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            color: '#008000', 
            fontSize: '50px',
            fontFamily: 'Comic Sans MS',
            fontWeight: 'bold', 
            textShadow: '2px 2px 4px #000000',
            backgroundColor: '#FEE7CC', 
            borderRadius: '20px',
            padding: '10px'
          }}>
            スコア: {score}
          </div>
        </div>
      ) : (
        <div>
          <img src={gameBackground} alt="description" style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            pointerEvents: 'none' ,
            userSelect: 'none'
          }} />

          {fakePresents.map(fakePresent => (
            <img key={fakePresent.id} src={fakePresentImage} alt="description" onMouseDown={() => removeFakePresent(fakePresent.id)} style={{ position: 'absolute', bottom: `${fakePresent.height}%`, left: `${fakePresent.position}%`, transform: 'translate(-50%, -50%)', maxWidth: '10%', maxHeight: '10%' }} />
          ))}
          {presents.map(present => (
            <img key={present.id} src={presentImage} alt="description" onMouseDown={() => removePresent(present.id)} style={{ position: 'absolute', bottom: `${present.height}%`, left: `${present.position}%`, transform: 'translate(-50%, -50%)', maxWidth: '10%', maxHeight: '10%' }} />
          ))}
          
        </div>
      )}
      {gameStarted && !gameOver && (
        <div style={{ 
          position: 'absolute', 
          top: '30%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: '#008000', 
          fontSize: '50px',
          fontFamily: 'Comic Sans MS',
          fontWeight: 'bold', 
          textShadow: '2px 2px 4px #000000',
          backgroundColor: '#FEE7CC', 
          borderRadius: '20px',
          padding: '10px'
        }}>
          スコア: {score}
        </div>
      )}
      {gameStarted && !gameOver && (
        <audio src={backgroundMusic} autoPlay loop volume={volume} />
      )}
    </div>
  );
}

export default App;
