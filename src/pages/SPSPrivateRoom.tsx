import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import { 
  ArrowLeft,
  Users,
  Copy,
  ArrowRight,
  Loader2,
  Hand,
  FileText,
  Scissors,
  RotateCcw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { gameSocketService } from "../services/gameSocket";
import owlImg from "@/assets/owl-character.png";
import pantherImg from "@/assets/panther-character.png";
import snakeImg from "@/assets/snake-character.png";

type Choice = "rock" | "paper" | "scissors";

const choices: { id: Choice; icon: any; label: string; emoji: string }[] = [
  { id: "rock", icon: Hand, label: "Stone", emoji: "🪨" },
  { id: "paper", icon: FileText, label: "Leaf", emoji: "🍃" },
  { id: "scissors", icon: Scissors, label: "Claw", emoji: "🦀" },
];

const SPSPrivateRoom = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [mode, setMode] = useState<'menu' | 'host' | 'join' | 'game'>('menu');
    const [roomCode, setRoomCode] = useState('');
    const [joinCode, setJoinCode] = useState('');
    
    // Game State
    const [gameActive, setGameActive] = useState(false);
    const [opponent, setOpponent] = useState<{ id: string; name: string; avatar?: string } | null>(null);
    const [currentRound, setCurrentRound] = useState(1);
    const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
    const [opponentMoved, setOpponentMoved] = useState(false);
    const [opponentChoice, setOpponentChoice] = useState<Choice | null>(null);
    const [roundResult, setRoundResult] = useState<string | null>(null);
    const [isRevealing, setIsRevealing] = useState(false);
    const [scores, setScores] = useState({ p1: 0, p2: 0 });
    const [gameEnded, setGameEnded] = useState(false);
    const [finalWinner, setFinalWinner] = useState<'p1' | 'p2' | 'draw' | null>(null);
    const [actualRoomId, setActualRoomId] = useState<string|null>(null);

    // Refs for socket listeners to access latest state
    const amIPlayer1Ref = useRef(false);
    const actualRoomIdRef = useRef<string | null>(null);
    const userRef = useRef(user);
    const gameActiveRef = useRef(false);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        gameActiveRef.current = gameActive;
    }, [gameActive]);

    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem('token');
        if (token) gameSocketService.connect(token);

        const handlePrivateRoomCreated = (data: { roomCode: string }) => {
            setRoomCode(data.roomCode);
            setMode('host');
        };

        const handleMatchFound = (data: any) => {
            setActualRoomId(data.roomId);
            actualRoomIdRef.current = data.roomId;
            setGameActive(true);
            setMode('game');
            
            const amP1 = data.p1.id === userRef.current?.id;
            amIPlayer1Ref.current = amP1;
            setOpponent(amP1 ? data.p2 : data.p1);
            toast.success("Friend Joined! Starting Game...");
        };

        const handleOpponentMadeMove = () => setOpponentMoved(true);
        
        const handleRoundResult = (data: any) => {
            setIsRevealing(true);
            
            setTimeout(() => {
                const oppChoiceStr = amIPlayer1Ref.current ? data.p2Choice : data.p1Choice;
                setOpponentChoice(oppChoiceStr);
                
                const myScore = amIPlayer1Ref.current ? data.scores.p1 : data.scores.p2;
                const oppScore = amIPlayer1Ref.current ? data.scores.p2 : data.scores.p1;
                setScores({ p1: myScore, p2: oppScore });

                const iWon = (data.winner === 'p1' && amIPlayer1Ref.current) || (data.winner === 'p2' && !amIPlayer1Ref.current);
                const draw = data.winner === 'draw';
                
                setRoundResult(draw ? "🤝 It's a Draw!" : iWon ? "🎉 You Win This Round!" : "Round Lost");
                
                setTimeout(() => {
                    setIsRevealing(false);
                }, 1500);
            }, 1000);
        };

        const handleNextRound = (data: any) => {
            setCurrentRound(data.round);
            setPlayerChoice(null);
            setOpponentChoice(null);
            setOpponentMoved(false);
            setRoundResult(null);
        };

        const handleGameOver = (data: any) => {
             const iWon = (data.winner === 'p1' && amIPlayer1Ref.current) || (data.winner === 'p2' && !amIPlayer1Ref.current);
             const isDraw = data.winner === 'draw';
             
             setTimeout(() => {
                 setFinalWinner(isDraw ? 'draw' : iWon ? 'p1' : 'p2');
                 setGameEnded(true);
             }, 2000);
        };
        
        const handleOpponentLeft = () => {
            if (gameActiveRef.current) {
                toast.error("Opponent disconnected");
                setGameEnded(true);
                setFinalWinner('p1');
            }
        };

        const handleError = (err: { message: string }) => {
            toast.error(err.message);
        };

        gameSocketService.onPrivateRoomCreated(handlePrivateRoomCreated);
        gameSocketService.onMatchFound(handleMatchFound);
        gameSocketService.onOpponentMadeMove(handleOpponentMadeMove);
        gameSocketService.onRoundResult(handleRoundResult);
        gameSocketService.onNextRound(handleNextRound);
        gameSocketService.onGameOver(handleGameOver);
        gameSocketService.onOpponentLeft(handleOpponentLeft);
        gameSocketService.onError(handleError);

        return () => {
            gameSocketService.off('privateRoomCreated', handlePrivateRoomCreated);
            gameSocketService.off('matchFound', handleMatchFound);
            gameSocketService.off('opponentMadeMove', handleOpponentMadeMove);
            gameSocketService.off('roundResult', handleRoundResult);
            gameSocketService.off('nextRound', handleNextRound);
            gameSocketService.off('gameOver', handleGameOver);
            gameSocketService.off('opponentLeft', handleOpponentLeft);
            gameSocketService.off('error', handleError);
        };
    }, [user]);

    const createRoom = () => {
        if (!user) return;
        gameSocketService.createPrivateRoom(user.id, user.name || 'Host');
    };

    const joinRoom = () => {
        if (!user || !joinCode) return;
        gameSocketService.joinPrivateRoom(user.id, user.name || 'Guest', joinCode);
    };

    const makeChoice = (choice: Choice) => {
        if (!actualRoomIdRef.current || playerChoice || isRevealing) return;
        setPlayerChoice(choice);
        gameSocketService.makeMove(actualRoomIdRef.current, choice);
    };

    const copyCode = () => {
        if (!roomCode) return;
        navigator.clipboard.writeText(roomCode);
        toast.success("Code copied!");
    };

    const getAvatar = (id?: string) => {
        if (id === user?.id) {
            return user?.avatar === 'panther' ? pantherImg : user?.avatar === 'snake' ? snakeImg : owlImg;
        }
        return owlImg; // Default for friend
    };

    // Lobby Interface
    if (mode !== 'game') {
        return (
            <div className="relative min-h-screen">
                <AnimatedBackground />
                <Navbar />
                <main className="relative z-10 pt-28 pb-12 px-4 min-h-screen flex items-center justify-center">
                    <motion.div initial={{opacity:0, y: 20}} animate={{opacity:1, y: 0}} className="glass-card p-8 text-center max-w-md w-full">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto"
                        >
                            <Users className="w-10 h-10 text-primary" />
                        </motion.div>
                        
                        <h1 className="font-display text-4xl font-bold mb-2">Private <span className="gradient-text">Room</span></h1>
                        <p className="text-muted-foreground mb-8">Play Stone Leaf Claw with a friend using a secret code! 🐒</p>

                        {mode === 'menu' && (
                            <div className="space-y-4">
                                <button onClick={createRoom} className="btn-jungle w-full py-4 text-xl">Create Room</button>
                                <button onClick={() => setMode('join')} className="btn-neon-outline w-full py-4 text-xl">Join Room</button>
                            </div>
                        )}

                        {mode === 'host' && (
                            <div>
                                <p className="text-sm font-bold text-muted-foreground mb-3 text-left uppercase tracking-widest">Room Code</p>
                                <div className="bg-muted/50 border-2 border-primary/20 p-6 rounded-2xl flex items-center justify-between mb-8 cursor-pointer hover:border-primary/50 transition-all group" onClick={copyCode}>
                                    <span className="font-display text-4xl font-bold tracking-[0.2em]">{roomCode}</span>
                                    <Copy className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex flex-col items-center gap-4 bg-primary/5 p-4 rounded-xl">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    <p className="text-sm font-medium animate-pulse uppercase tracking-wider">Waiting for opponent to enter Jungle...</p>
                                </div>
                                <button onClick={() => setMode('menu')} className="mt-8 text-xs text-muted-foreground hover:text-red-500 uppercase font-bold tracking-widest">Cancel Room</button>
                            </div>
                        )}

                        {mode === 'join' && (
                            <div>
                                <input 
                                    type="text"
                                    placeholder="Enter Room Code"
                                    className="w-full bg-muted/50 border-2 border-white/10 rounded-2xl px-4 py-4 mb-6 text-center font-display text-3xl uppercase tracking-widest focus:border-primary/50 outline-none transition-all"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                />
                                <button onClick={joinRoom} className="btn-jungle w-full py-4 text-xl flex items-center justify-center gap-2">
                                    Enter Arena <ArrowRight className="w-6 h-6" />
                                </button>
                                <button onClick={() => setMode('menu')} className="mt-6 text-sm text-muted-foreground hover:underline">Go Back</button>
                            </div>
                        )}

                        <Link to="/games" className="inline-flex items-center gap-2 mt-12 text-sm text-muted-foreground hover:text-foreground font-bold">
                            <ArrowLeft className="w-4 h-4" /> Exit Room
                        </Link>
                    </motion.div>
                </main>
            </div>
        );
    }

    // Finished Game Screen
    if (gameEnded) {
        return (
          <div className="relative min-h-screen">
            <AnimatedBackground />
            <Navbar />
            <main className="relative z-10 pt-28 pb-12 px-4 min-h-screen flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 sm:p-12 text-center max-w-lg w-full"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-7xl mb-6"
                >
                  {finalWinner === 'p1' ? "🏆" : "🐾"}
                </motion.div>
                
                <h2 className="font-display text-3xl mb-2">
                  {finalWinner === 'p1' ? (
                    <>You <span className="gradient-text">Won!</span> 🎉</>
                  ) : finalWinner === 'draw' ? (
                    <>It's a <span className="text-secondary">Draw!</span> 🤝</>
                  ) : (
                    <>Opponent <span className="text-destructive">Wins!</span> 🐾</>
                  )}
                </h2>
                
                <p className="text-muted-foreground mb-8">
                  Final Score: {scores.p1} - {scores.p2}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/games" className="btn-neon-outline">
                    Back to Jungle
                  </Link>
                  <button onClick={() => window.location.reload()} className="btn-jungle flex items-center justify-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    Play Again
                  </button>
                </div>
              </motion.div>
            </main>
          </div>
        );
      }

    // Active Game Board
    return (
        <div className="relative min-h-screen">
          <AnimatedBackground />
          <Navbar />
    
          <main className="relative z-10 pt-28 pb-12 px-4">
            <div className="container mx-auto max-w-2xl">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-sm text-muted-foreground">Round</span>
                            <p className="font-display text-2xl">{currentRound}/5</p>
                        </div>
                        <div className="text-center">
                            <span className="text-sm text-muted-foreground">Score</span>
                            <p className="font-display text-2xl">
                                <span className="text-primary">{scores.p1}</span>
                                <span className="text-muted-foreground mx-2">-</span>
                                <span className="text-destructive">{scores.p2}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-muted-foreground">Arena</span>
                            <p className="font-display text-xl gradient-text">Friend Duel</p>
                        </div>
                    </div>
               </motion.div>
    
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
                   <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="text-center">
                            <span className="text-sm text-muted-foreground mb-2 block">You 🐾</span>
                            <motion.div
                              animate={playerChoice ? { scale: [1, 1.1, 1] } : {}}
                              className={`w-28 h-28 mx-auto rounded-2xl flex items-center justify-center relative overflow-hidden ${
                                playerChoice ? "bg-gradient-to-br from-primary to-jungle-emerald" : "bg-muted/50"
                              }`}
                            >
                                {playerChoice ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl">
                                        {choices.find(c => c.id === playerChoice)?.emoji}
                                    </motion.div>
                                ) : (
                                    <img src={getAvatar(user?.id)} alt="Your Avatar" className="w-full h-full object-cover opacity-30" />
                                )}
                            </motion.div>
                        </div>
    
                        <div className="flex items-center justify-center">
                            <span className="font-display text-3xl text-muted-foreground">VS</span>
                        </div>
    
                        <div className="text-center">
                            <span className="text-sm text-muted-foreground mb-2 block">{opponent?.name || 'Enemy'} 🐾</span>
                            <motion.div
                              animate={opponentChoice ? { scale: [1, 1.1, 1] } : (opponentMoved && !isRevealing) ? { rotate: [0, 5, -5, 0] } : {}}
                              transition={(opponentMoved && !isRevealing) ? { duration: 0.5, repeat: Infinity } : {}}
                              className={`w-28 h-28 mx-auto rounded-2xl flex items-center justify-center relative overflow-hidden ${
                                opponentChoice ? "bg-gradient-to-br from-secondary to-jungle-amber" : opponentMoved ? "bg-secondary/20 border-2 border-secondary/30" : "bg-muted/50"
                              }`}
                            >
                                {opponentChoice ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl">
                                        {choices.find(c => c.id === opponentChoice)?.emoji}
                                    </motion.div>
                                ) : (
                                    <img src={owlImg} alt="Opponent Avatar" className={`w-full h-full object-cover ${opponentMoved ? 'opacity-50' : 'opacity-20'}`} />
                                )}
                                {opponentMoved && !opponentChoice && (
                                    <div className="absolute bottom-1 bg-secondary px-2 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter shadow-lg">Ready</div>
                                )}
                            </motion.div>
                        </div>
                   </div>
    
                   <AnimatePresence mode="wait">
                       {roundResult && (
                           <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center mb-6 h-8">
                               <span className={`font-display text-2xl ${
                                   roundResult.includes('Win') ? 'text-primary' : roundResult.includes('Draw') ? 'text-secondary' : 'text-destructive'
                               }`}>
                                   {roundResult}
                               </span>
                           </motion.div>
                       )}
                   </AnimatePresence>
    
                   {!playerChoice && !gameEnded && !isRevealing && (
                       <div>
                           <p className="text-center text-muted-foreground mb-6 font-bold">Choose your weapon!</p>
                           <div className="flex justify-center gap-4">
                               {choices.map(c => (
                                   <motion.button 
                                     key={c.id} 
                                     whileHover={{ scale: 1.05 }}
                                     whileTap={{ scale: 0.95 }}
                                     onClick={() => makeChoice(c.id)}
                                     className="w-24 h-24 bg-muted/50 hover:bg-primary/20 rounded-2xl flex flex-col items-center justify-center transition-all border border-primary/10 hover:border-primary/30"
                                   >
                                       <span className="text-4xl mb-1">{c.emoji}</span>
                                       <span className="text-xs text-muted-foreground font-bold">{c.label}</span>
                                   </motion.button>
                               ))}
                           </div>
                       </div>
                   )}
    
                   {((playerChoice || isRevealing) && !opponentChoice && !gameEnded) && (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                            <p className="text-muted-foreground animate-pulse font-medium">Waiting for your friend...</p>
                       </motion.div>
                   )}
    
                   <div className="mt-12 flex justify-center">
                       <button onClick={() => navigate('/games')} className="text-xs text-muted-foreground hover:text-red-500 hover:underline transition-colors uppercase tracking-widest font-bold">
                           Surrender Duel
                       </button>
                   </div>
               </motion.div>
            </div>
          </main>
        </div>
      );
};

export default SPSPrivateRoom;
