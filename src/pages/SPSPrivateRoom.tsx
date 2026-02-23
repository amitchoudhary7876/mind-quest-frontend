import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import { 
  ArrowLeft,
  Users,
  Copy,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { gameSocketService } from "../services/gameSocket";
// We reuse the PvP component for the actual game, or duplicate the logic.
// Ideally, we move the Game Board to a component.
// For speed, let's suggest SPSPvPGame handles logic if a prop is passed, OR duplicate simple logic.
// Actually, `SPSPvPGame` handles matchmaking. 
// Let's make `SPSPrivateRoom` a lobby that redirects to a "GameRoom" or handles it inline.
// Since `gameSocket` manages state, let's iterate on `SPSPrivateRoom` to handle the lobby, 
// and when match starts, it can render the same Game Interface.

// Refactoring: I'll include the game interface inside SPSPrivateRoom too for now to ensure it works standalone.
import { 
  Hand, 
  FileText, 
  Scissors,
} from "lucide-react";

type Choice = "rock" | "paper" | "scissors";

const choices: { id: Choice; icon: any; label: string }[] = [
  { id: "rock", icon: Hand, label: "Stone" },
  { id: "paper", icon: FileText, label: "Paper" },
  { id: "scissors", icon: Scissors, label: "Scissors" },
];

const SPSPrivateRoom = () => {
    const { user } = useAuth();
    // navigate removed as unused
    
    const [mode, setMode] = useState<'menu' | 'host' | 'join' | 'game'>('menu');
    const [roomCode, setRoomCode] = useState('');
    const [joinCode, setJoinCode] = useState('');
    
    // Game State (Duplicated from PvP for isolation/simplicity in this context)
    const [gameActive, setGameActive] = useState(false);
    const [opponent, setOpponent] = useState<{ id: string; name: string } | null>(null);
    const [currentRound, setCurrentRound] = useState(1);
    const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
    const [opponentMoved, setOpponentMoved] = useState(false);
    const [opponentChoice, setOpponentChoice] = useState<Choice | null>(null);
    const [roundResult, setRoundResult] = useState<string | null>(null);
    const [scores, setScores] = useState({ p1: 0, p2: 0 });
    const [gameEnded, setGameEnded] = useState(false);
    const [finalWinner, setFinalWinner] = useState<'p1' | 'p2' | null>(null);
    const [amIPlayer1, setAmIPlayer1] = useState(false);
    const [actualRoomId, setActualRoomId] = useState<string|null>(null);

    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem('token');
        if (token) gameSocketService.connect(token);

        gameSocketService.onPrivateRoomCreated((data) => {
            setRoomCode(data.roomCode);
            setMode('host');
        });

        // When match starts, it's same event as PvP
        gameSocketService.onMatchFound((data) => {
            setActualRoomId(data.roomId);
            setGameActive(true);
            setMode('game');
            const amP1 = data.p1.id === user.id;
            setAmIPlayer1(amP1);
            setOpponent(amP1 ? data.p2 : data.p1);
            toast.success("Player Joined! Starting Game...");
        });

        gameSocketService.onError((err) => {
            toast.error(err.message);
        });

        // Game Event Listeners
        gameSocketService.onOpponentMadeMove(() => setOpponentMoved(true));
        
        gameSocketService.onRoundResult((data) => {
            const oppChoiceStr = amIPlayer1 ? data.p2Choice : data.p1Choice;
            setOpponentChoice(oppChoiceStr);
            setScores({
                p1: amIPlayer1 ? data.scores.p1 : data.scores.p2,
                p2: amIPlayer1 ? data.scores.p2 : data.scores.p1
            });
            const iWon = (data.winner === 'p1' && amIPlayer1) || (data.winner === 'p2' && !amIPlayer1);
            const draw = data.winner === 'draw';
            setRoundResult(draw ? "Draw" : iWon ? "You Won" : "Lost");
        });

        gameSocketService.onNextRound((data) => {
            setCurrentRound(data.round);
            setPlayerChoice(null);
            setOpponentChoice(null);
            setOpponentMoved(false);
            setRoundResult(null);
        });

        gameSocketService.onGameOver((data) => {
             setGameEnded(true);
             const iWon = (data.winner === 'p1' && amIPlayer1) || (data.winner === 'p2' && !amIPlayer1);
             setFinalWinner(iWon ? 'p1' : 'p2');
        });
        
        gameSocketService.onOpponentLeft(() => {
            if (gameActive) {
                toast.error("Opponent disconnected");
                setGameEnded(true);
                setFinalWinner('p1');
            }
        });

        return () => gameSocketService.disconnect();
    }, [user, amIPlayer1, gameActive]);

    const createRoom = () => {
        if (!user) return;
        gameSocketService.createPrivateRoom(user.id, user.name);
    };

    const joinRoom = () => {
        if (!user || !joinCode) return;
        gameSocketService.joinPrivateRoom(user.id, user.name, joinCode);
    };

    const makeChoice = (choice: Choice) => {
        if (!actualRoomId || playerChoice) return;
        setPlayerChoice(choice);
        gameSocketService.makeMove(actualRoomId, choice);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(roomCode);
        toast.success("Code copied!");
    };

    if (mode === 'game') {
        // Render Game Board (Simplified for brevity, same as PvP)
        return (
            <div className="relative min-h-screen">
                {/* <AnimatedBackground /> */}
                <Navbar />
                <main className="relative z-10 pt-28 pb-12 px-4">
                  <div className="container mx-auto max-w-2xl">
                    <div className="glass-card p-6 flex flex-col items-center">
                        <div className="flex justify-between w-full mb-8">
                             <div>
                                 <p className="text-xs text-muted-foreground">You</p>
                                 <p className="font-bold text-primary">{scores.p1}</p>
                             </div>
                             <div className="font-display text-xl">Round {currentRound}</div>
                             <div className="text-right">
                                 <p className="text-xs text-muted-foreground">{opponent?.name}</p>
                                 <p className="font-bold text-red-400">{scores.p2}</p>
                             </div>
                        </div>

                        {gameEnded ? (
                            <div className="text-center">
                                <h1 className="text-4xl font-bold mb-4">{finalWinner === 'p1' ? 'VICTORY' : 'DEFEAT'}</h1>
                                <button onClick={() => window.location.reload()} className="btn-neon">Leave</button>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-8 mb-8">
                                    <div className={`w-24 h-24 rounded-xl flex items-center justify-center bg-muted/20 border-2 ${playerChoice ? 'border-primary' : 'border-transparent'}`}>
                                        {playerChoice && (() => {
                                            const C = choices.find(c => c.id === playerChoice);
                                            return C ? <C.icon className="w-10 h-10 text-primary" /> : null
                                        })()}
                                    </div>
                                    <div className={`w-24 h-24 rounded-xl flex items-center justify-center bg-muted/20 border-2 ${opponentMoved ? 'border-red-400' : 'border-transparent'}`}>
                                         {opponentChoice ? (() => {
                                             const C = choices.find(c => c.id === opponentChoice);
                                             return C ? <C.icon className="w-10 h-10 text-red-400" /> : null
                                         })() : (
                                             opponentMoved ? <div className="text-xs text-red-400">Ready</div> : <div className="text-xs text-muted-foreground">Thinking...</div>
                                         )}
                                    </div>
                                </div>
                                {roundResult && <p className="text-2xl font-bold mb-4 text-yellow-400">{roundResult}</p>}
                                
                                {!playerChoice && (
                                    <div className="flex gap-4">
                                        {choices.map(c => (
                                            <button key={c.id} onClick={() => makeChoice(c.id)} className="p-4 bg-muted/50 rounded-xl hover:bg-primary/20 transition-all">
                                                <c.icon className="w-8 h-8" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                  </div>
                </main>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* <AnimatedBackground /> */}
            <Navbar />
            <main className="relative z-10 pt-28 pb-12 px-4 min-h-screen flex items-center justify-center">
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="glass-card p-8 text-center max-w-md w-full">
                    <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                        <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="font-display text-3xl font-bold mb-2">Private <span className="gradient-text">Room</span></h1>
                    <p className="text-muted-foreground mb-8">Play with a friend using a code</p>

                    {mode === 'menu' && (
                        <div className="space-y-4">
                            <button onClick={createRoom} className="btn-neon w-full">Create Room</button>
                            <button onClick={() => setMode('join')} className="btn-neon-outline w-full">Join Room</button>
                        </div>
                    )}

                    {mode === 'host' && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Share this code:</p>
                            <div className="bg-muted p-4 rounded-xl flex items-center justify-between mb-8 cursor-pointer" onClick={copyCode}>
                                <span className="font-mono text-2xl font-bold tracking-widest">{roomCode}</span>
                                <Copy className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm">Waiting for friend to join...</span>
                            </div>
                        </div>
                    )}

                    {mode === 'join' && (
                        <div>
                            <input 
                                type="text"
                                placeholder="Enter Room Code"
                                className="w-full bg-muted/50 border border-white/10 rounded-xl px-4 py-3 mb-4 text-center font-mono text-xl uppercase"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            />
                            <button onClick={joinRoom} className="btn-neon w-full flex items-center justify-center gap-2">
                                Join Game <ArrowRight className="w-4 h-4" />
                            </button>
                            <button onClick={() => setMode('menu')} className="mt-4 text-sm text-muted-foreground hover:underline">Cancel</button>
                        </div>
                    )}

                    <Link to="/games" className="inline-flex items-center gap-2 mt-8 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" /> Back to Games
                    </Link>
                </motion.div>
            </main>
        </div>
    );
};

export default SPSPrivateRoom;
