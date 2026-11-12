import { useEffect, useState } from 'react'
import './App.css'

const SEC_IN_A_MIN = 60;
const MS_IN_A_SEC = 1000;
const STEP = 100;
const START_TIMER = 5 * SEC_IN_A_MIN * MS_IN_A_SEC;

interface PlayerTimer {
  name: string;
  time: number;
}

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const pause = () => { setIsRunning(false) };
  const resume = () => { setIsRunning(true) };

  const [timers, setTimers] = useState<PlayerTimer[]>([
    { name: 'Player 0', time: START_TIMER },
    { name: 'Player 1', time: START_TIMER },
    { name: 'Player 2', time: START_TIMER },
  ]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const timeToStr = (time: number) => {
    const ms = time % 1000;
    time = (time - ms) / 1000;
    const sec = time % 60;
    time = (time - sec) / 60;
    const min = time % 60;

    const minStr = min.toString().padStart(2, '0');
    const secStr = sec.toString().padStart(2, '0');

    return `${minStr}:${secStr}`;
  }
  const playerToStr = (timer: PlayerTimer) => {
    return `${timer.name}: ${timeToStr(timer.time)}`;
  }


  const countdown = () => {
    if (!isRunning) return;

    const newTimers = [...timers];
    newTimers[currentIdx] = {
      ...newTimers[currentIdx],
      time: newTimers[currentIdx].time - STEP,
    };
    setTimers(newTimers);
  }
  const pass = () => {
    setCurrentIdx((currentIdx + 1) % timers.length);
  }

  useEffect(() => {
    if (!isRunning) return;

    const loopId = setInterval(() => {
      countdown();
    }, STEP)

    return () => clearInterval(loopId);
  }, [timers, isRunning])

  return (
    <>
      {timers && timers.map((timer, idx) => {
        if (currentIdx === idx) return;

        return <p key={idx}>{playerToStr(timer)}</p>
      })}
      <h1>{playerToStr(timers[currentIdx])} {!isRunning && '(paused)' }</h1>
      <button onClick={pass}>PASS TURN</button>

      <br /><br />
      {isRunning && <button onClick={pause}>Pause</button> }
      {!isRunning && <button onClick={resume}>Resume</button> }
    </>
  );
}

export default App;
