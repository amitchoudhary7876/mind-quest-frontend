import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import { 
  Hand,
  FileText,
  Scissors,
  ArrowLeft,
  Swords,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { gameSocketService } from "../services/gameSocket";

type Choice = "rock" | "paper" | "scissors";
type Result = "win" | "lose" | "draw";

const choices: { id: Choice; icon: any; label: string }[] = [
  { id: "rock", icon: Hand, label: "Stone" },
  { id: "paper", icon: FileText, label: "Paper" },
  { id: "scissors", icon: Scissors, label: "Scissors" },
];

const SPSPvPGame = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Game State
  const [isSearching, setIsSearching] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<{ id: string; name: string } | null>(null);
  
  const [currentRound, setCurrentRound] = useState(1);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [opponentMoved, setOpponentMoved] = useState(false);
  const [opponentChoice, setOpponentChoice] = useState<Choice | null>(null); // Only revealed after round
  
  const [roundResult, setRoundResult] = useState<string | null>(null); // Text to show
  const [roundHistory, setRoundHistory] = useState<Result[]>([]);
  
  const [scores, setScores] = useState({ p1: 0, p2: 0 }); // p1 is us, p2 is them
  const [gameEnded, setGameEnded] = useState(false);
  const [finalWinner, setFinalWinner] = useState<'p1' | 'p2' | 'draw' | null>(null);

  useEffect(() => {
    if (!user) return;

    // Connect socket
    const token = localStorage.getItem('token');
    if (token) {
        console.log('[PvP] Connecting to game socket...');
        gameSocketService.connect(token);
    }

    // Setup Listeners
    gameSocketService.onMatchFound((data) => {
        console.log('[PvP] Match found:', data);
        setIsSearching(false);
        setGameActive(true);
        setRoomId(data.roomId);
        
        // Determine opponent
        const isP1 = data.p1.id === user.id;
        const opp = isP1 ? data.p2 : data.p1;
        setOpponent(opp);
        setAmIPlayer1(isP1);
        
        toast.success(`Match found vs ${opp.name}!`);
    });

    gameSocketService.onOpponentMadeMove((data) => {
        console.log('[PvP] Opponent made a move:', data);
        setOpponentMoved(true);
        // toast.info("Opponent made a move!");
    });

    // RoundResult handled in second useEffect dependent on amIPlayer1

    gameSocketService.onNextRound((data) => {
        setCurrentRound(data.round);
        setPlayerChoice(null);
        setOpponentChoice(null);
        setOpponentMoved(false);
        setRoundResult(null);
    });

    // GameOver handled in second useEffect

    gameSocketService.onOpponentLeft(() => {
        toast.error("Opponent disconnected!");
        setGameEnded(true);
        setFinalWinner('p1'); // We win by default
    });

    return () => {
        gameSocketService.disconnect();
    };
  }, [user]);

  // We need to store if we are P1 or P2 to interpret results
  const [amIPlayer1, setAmIPlayer1] = useState(false);

  useEffect(() => {
    gameSocketService.onMatchFound((data) => {
        // ... previous logic
        const amP1 = data.p1.id === user?.id;
        setAmIPlayer1(amP1);
    });
    
    gameSocketService.onRoundResult((data) => {
        console.log('[PvP] Round result:', data, 'amIPlayer1:', amIPlayer1);
        const myChoiceStr = amIPlayer1 ? data.p1Choice : data.p2Choice;
        const oppChoiceStr = amIPlayer1 ? data.p2Choice : data.p1Choice;
        
        setOpponentChoice(oppChoiceStr);
        
        const myScore = amIPlayer1 ? data.scores.p1 : data.scores.p2;
        const oppScore = amIPlayer1 ? data.scores.p2 : data.scores.p1;
        setScores({ p1: myScore, p2: oppScore });

        const iWon = (data.winner === 'p1' && amIPlayer1) || (data.winner === 'p2' && !amIPlayer1);
        const draw = data.winner === 'draw';
        
        setRoundResult(draw ? "It's a Draw!" : iWon ? "You Win This Round!" : "Round Lost");
        setRoundHistory(prev => [...prev, draw ? 'draw' : iWon ? 'win' : 'lose']);
    });
    
    gameSocketService.onGameOver((data) => {
         const iWon = (data.winner === 'p1' && amIPlayer1) || (data.winner === 'p2' && !amIPlayer1);
         setFinalWinner(iWon ? 'p1' : 'p2'); 
         // Helper: reusing p1 as 'me', p2 as 'opponent' for finalWinner state simplicity? 
         // actually let's just store boolean IWon
    });
  }, [user, amIPlayer1]); // Re-bind when amIPlayer1 changes? No, ref is better, but this works if user exists.


  const joinQueue = () => {
    if (!user) return;
    setIsSearching(true);
    gameSocketService.joinQueue(user.id, user.name || 'Player');
  };

  const makeChoice = (choice: Choice) => {
    if (!roomId || playerChoice) return;
    console.log('[PvP] Making choice:', choice, 'in room:', roomId);
    setPlayerChoice(choice);
    gameSocketService.makeMove(roomId, choice);
  };
  
  const handleLeave = () => {
      navigate('/games');
  };

  // UI Code similar to SPSGame but adapted
  // ...

  if (!gameActive) {
      return (
        <div className="relative min-h-screen">
            {/* <AnimatedBackground /> */} 
            <Navbar />
            <main className="relative z-10 pt-28 pb-12 px-4 min-h-screen flex items-center justify-center">
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="glass-card p-8 text-center max-w-md w-full">
                    <h1 className="font-display text-3xl font-bold mb-6">PvP <span className="gradient-text">Arena</span></h1>
                    <p className="text-muted-foreground mb-8">Match against real players. First to 3 wins!</p>
                    
                    {isSearching ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-xl font-medium animate-pulse">Searching for opponent...</p>
                        </div>
                    ) : (
                         <button onClick={joinQueue} className="btn-neon w-full flex items-center justify-center gap-2">
                            <Swords className="w-5 h-5" />
                            Find Match
                         </button>
                    )}
                    
                     <Link to="/games" className="inline-flex items-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" /> Back to Games
                     </Link>
                </motion.div>
            </main>
        </div>
      );
  }

  // Active Game UI
  return (
    <div className="relative min-h-screen">
      {/* <AnimatedBackground /> */}
      <Navbar />

      <main className="relative z-10 pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
           {/* Header with Opponent Info and Score */}
           <motion.div className="glass-card p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Opponent</p>
                        <p className="font-bold text-xl">{opponent?.name || 'Unknown'}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Score</p>
                        <div className="text-3xl font-display font-bold">
                            <span className="text-green-400">{scores.p1}</span> - <span className="text-red-400">{scores.p2}</span>
                        </div>
                    </div>
                </div>
           </motion.div>

           {/* Arena */}
           <div className="glass-card p-8 mb-6">
               {gameEnded ? (
                   <div className="text-center">
                       <h2 className="text-4xl font-display font-bold mb-4">
                           {finalWinner === 'p1' ? <span className="text-green-400">VICTORY!</span> : <span className="text-red-500">DEFEAT</span>}
                       </h2>
                       <button onClick={handleLeave} className="btn-neon mt-4">Continue</button>
                   </div>
               ) : (
                   <>
                       <div className="flex justify-between items-center mb-12">
                            {/* Player */}
                            <div className="text-center">
                                <p className="mb-2 font-bold text-primary">You</p>
                                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${playerChoice ? 'bg-primary/20 border-2 border-primary' : 'bg-muted/30'}`}>
                                    {playerChoice && (() => {
                                        const C = choices.find(c => c.id === playerChoice);
                                        return C ? <C.icon className="w-10 h-10 text-primary" /> : null
                                    })()}
                                </div>
                            </div>

                            <div className="text-2xl font-display font-bold text-muted-foreground">VS</div>

                            {/* Opponent */}
                            <div className="text-center">
                                <p className="mb-2 font-bold text-red-400">Enemy</p>
                                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${opponentMoved ? 'bg-red-500/20 border-2 border-red-500 animate-pulse' : 'bg-muted/30'}`}>
                                     {opponentChoice ? (() => {
                                         const C = choices.find(c => c.id === opponentChoice);
                                         return C ? <C.icon className="w-10 h-10 text-red-400" /> : null
                                     })() : (
                                         opponentMoved ? <div className="text-xs text-red-400">Ready</div> : <div className="text-xs text-muted-foreground">Thinking...</div>
                                     )}
                                </div>
                            </div>
                       </div>
                       
                       {/* Result Text */}
                       {roundResult && (
                           <motion.div initial={{scale:0}} animate={{scale:1}} className="text-center mb-8">
                               <span className="text-2xl font-bold text-yellow-400">{roundResult}</span>
                           </motion.div>
                       )}

                       {/* Controls */}
                       {!playerChoice && !gameEnded && (
                           <div className="flex justify-center gap-4">
                               {choices.map(c => (
                                   <button 
                                     key={c.id} 
                                     onClick={() => makeChoice(c.id)}
                                     className="w-20 h-20 bg-muted/50 hover:bg-primary/20 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105"
                                   >
                                       <c.icon className="w-8 h-8 mb-1" />
                                       <span className="text-xs">{c.label}</span>
                                   </button>
                               ))}
                           </div>
                       )}
                       {playerChoice && !opponentChoice && !gameEnded && (
                           <p className="text-center text-muted-foreground animate-pulse">Waiting for opponent...</p>
                       )}
                   </>
               )}
           </div>
        </div>
      </main>
    </div>
  );
};

export default SPSPvPGame;
