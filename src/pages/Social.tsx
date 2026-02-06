import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import { 
  Search, 
  UserPlus, 
  MessageCircle, 
  Bell, 
  Users,
  Check,
  X,
  Send
} from "lucide-react";

const Social = () => {
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "chat">("friends");
  const [searchQuery, setSearchQuery] = useState("");

  const friends = [
    { id: 1, name: "GamerPro123", level: 23, status: "online", avatar: "GP" },
    { id: 2, name: "QuizMaster", level: 18, status: "online", avatar: "QM" },
    { id: 3, name: "BrainStorm", level: 31, status: "offline", avatar: "BS" },
    { id: 4, name: "MindReader", level: 15, status: "in-game", avatar: "MR" },
  ];

  const requests = [
    { id: 1, name: "NewPlayer99", level: 5, avatar: "NP" },
    { id: 2, name: "ChallengerX", level: 12, avatar: "CX" },
  ];

  const messages = [
    { id: 1, from: "GamerPro123", message: "Ready for a rematch?", time: "2m ago" },
    { id: 2, from: "QuizMaster", message: "That was a tough round!", time: "15m ago" },
  ];

  const tabs = [
    { id: "friends" as const, label: "Friends", icon: Users, count: friends.length },
    { id: "requests" as const, label: "Requests", icon: UserPlus, count: requests.length },
    { id: "chat" as const, label: "Chat", icon: MessageCircle, count: messages.length },
  ];

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-4xl font-bold mb-4">
              Social <span className="gradient-text">Hub</span>
            </h1>
            <p className="text-muted-foreground">
              Connect with friends, chat, and challenge players worldwide.
            </p>
          </motion.div>

          {/* Search Bar */}
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
                placeholder="Search players by name or email..."
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
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
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
            {/* Friends List */}
            {activeTab === "friends" && (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-bold">
                      {friend.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{friend.name}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          friend.status === "online" ? "bg-green-400" :
                          friend.status === "in-game" ? "bg-yellow-400" : "bg-muted-foreground"
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

            {/* Friend Requests */}
            {activeTab === "requests" && (
              <div className="space-y-3">
                {requests.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No pending friend requests
                  </div>
                ) : (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/30"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-neon-purple flex items-center justify-center font-display font-bold">
                        {request.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium truncate block">{request.name}</span>
                        <p className="text-sm text-muted-foreground">Level {request.level}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors">
                          <Check className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Chat */}
            {activeTab === "chat" && (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display text-sm font-bold flex-shrink-0">
                      {msg.from.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{msg.from}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                    </div>
                  </div>
                ))}
                
                {/* Message Input */}
                <div className="mt-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="input-glass flex-1"
                  />
                  <button className="btn-neon px-4">
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
