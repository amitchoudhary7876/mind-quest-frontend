import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import { 
  Search, 
  UserPlus, 
  MessageCircle, 
  Users,
  Check,
  X,
  Send
} from "lucide-react";
import owlImg from "@/assets/owl-character.png";
import pantherImg from "@/assets/panther-character.png";
import snakeImg from "@/assets/snake-character.png";

const animalAvatars = [owlImg, pantherImg, snakeImg];

const Social = () => {
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "chat">("friends");
  const [searchQuery, setSearchQuery] = useState("");

  const friends = [
    { id: 1, name: "SwiftFox", level: 23, status: "online", emoji: "🦊", avatarIdx: 0 },
    { id: 2, name: "WiseElephant", level: 18, status: "online", emoji: "🐘", avatarIdx: 1 },
    { id: 3, name: "SilentTiger", level: 31, status: "offline", emoji: "🐯", avatarIdx: 2 },
    { id: 4, name: "SlyMonkey", level: 15, status: "in-game", emoji: "🐒", avatarIdx: 0 },
  ];

  const requests = [
    { id: 1, name: "LittleFrog99", level: 5, emoji: "🐸" },
    { id: 2, name: "EagleEye", level: 12, emoji: "🦅" },
  ];

  const messages = [
    { id: 1, from: "SwiftFox", message: "Ready for a rematch in the arena? 🔥", time: "2m ago", emoji: "🦊" },
    { id: 2, from: "WiseElephant", message: "That was a tough round!", time: "15m ago", emoji: "🐘" },
  ];

  const tabs = [
    { id: "friends" as const, label: "Pack", icon: Users, count: friends.length },
    { id: "requests" as const, label: "Requests", icon: UserPlus, count: requests.length },
    { id: "chat" as const, label: "Chat", icon: MessageCircle, count: messages.length },
  ];

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-4xl mb-4">
              The <span className="gradient-text">Pack</span> 🐾
            </h1>
            <p className="text-muted-foreground">
              Connect with jungle friends, chat, and challenge fellow explorers.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search explorers by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass w-full pl-12"
              />
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-primary-foreground/20"
                      : "bg-primary/20 text-primary"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            {activeTab === "friends" && (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/20">
                      <img src={animalAvatars[friend.avatarIdx]} alt={friend.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{friend.emoji}</span>
                        <span className="font-bold truncate">{friend.name}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          friend.status === "online" ? "bg-primary" :
                          friend.status === "in-game" ? "bg-secondary" : "bg-muted-foreground"
                        }`} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Level {friend.level} • {friend.status}
                      </p>
                    </div>
                    <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "requests" && (
              <div className="space-y-3">
                {requests.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No pending pack requests
                  </div>
                ) : (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/30"
                    >
                      <div className="text-3xl">{request.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold truncate block">{request.name}</span>
                        <p className="text-sm text-muted-foreground">Level {request.level}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition-colors">
                          <Check className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "chat" && (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="text-3xl flex-shrink-0">{msg.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold">{msg.from}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="Send a message to your pack..."
                    className="input-glass flex-1"
                  />
                  <button className="btn-jungle px-4">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Social;
