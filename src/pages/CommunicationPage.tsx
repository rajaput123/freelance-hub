import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, MessageSquare, Send, Bell, Megaphone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CommunicationPage = () => {
  const { messages, clients, addMessage, markMessageRead } = useAppData();
  const navigate = useNavigate();
  const [showCompose, setShowCompose] = useState(false);
  const [msgType, setMsgType] = useState<"reminder" | "update" | "announcement">("reminder");
  const [recipientId, setRecipientId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tab, setTab] = useState<"all" | "unread">("all");

  const displayed = tab === "unread" ? messages.filter(m => !m.read) : messages;
  const unreadCount = messages.filter(m => !m.read).length;

  const typeIcons = { reminder: Bell, update: MessageSquare, announcement: Megaphone };
  const typeColors = { reminder: "bg-warning/10 text-warning", update: "bg-info/10 text-info", announcement: "bg-destructive/10 text-destructive" };

  const handleSend = () => {
    if (!title || !body) { toast.error("Title and message required"); return; }
    const recipient = clients.find(c => c.id === recipientId);
    addMessage({ type: msgType, title, body, recipientName: recipient?.name || "All Clients", recipientId: recipientId || undefined, date: new Date().toISOString().split("T")[0], read: false });
    toast.success("Message sent!");
    setTitle(""); setBody(""); setRecipientId("");
    setShowCompose(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 glass px-4 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Communication</h1>
          </div>
          <button onClick={() => setShowCompose(!showCompose)} className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow active:scale-95 transition-transform">
            <Plus className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      <div className="px-4 mt-3">
        <div className="flex bg-card rounded-2xl p-1 shadow-soft">
          <button onClick={() => setTab("all")} className={cn("flex-1 rounded-xl py-2.5 text-xs font-bold transition-all", tab === "all" ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground")}>
            All ({messages.length})
          </button>
          <button onClick={() => setTab("unread")} className={cn("flex-1 rounded-xl py-2.5 text-xs font-bold transition-all", tab === "unread" ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground")}>
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {showCompose && (
        <div className="px-4 mt-3">
          <div className="bg-card rounded-2xl p-4 space-y-3 shadow-soft">
            <p className="text-xs font-bold">New Message</p>
            <Select value={msgType} onValueChange={v => setMsgType(v as typeof msgType)}>
              <SelectTrigger className="h-11 rounded-xl text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="reminder">Payment Reminder</SelectItem>
                <SelectItem value="update">Job/Event Update</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger className="h-11 rounded-xl text-sm"><SelectValue placeholder="Select recipient (or All)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(c => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <Input placeholder="Subject" value={title} onChange={e => setTitle(e.target.value)} className="h-11 rounded-xl text-sm" />
            <Textarea placeholder="Message body..." value={body} onChange={e => setBody(e.target.value)} className="rounded-xl text-sm" rows={3} />
            <Button onClick={handleSend} className="w-full h-11 rounded-xl text-sm font-bold gap-2 gradient-primary shadow-glow border-0">
              <Send className="h-4 w-4" /> Send Message
            </Button>
          </div>
        </div>
      )}

      <div className="px-4 mt-3 space-y-2.5">
        {displayed.length === 0 ? (
          <div className="bg-card rounded-2xl p-10 text-center shadow-soft">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold">No messages</p>
          </div>
        ) : (
          displayed.map(msg => {
            const Icon = typeIcons[msg.type];
            const color = typeColors[msg.type];
            return (
              <div key={msg.id} onClick={() => markMessageRead(msg.id)} className={cn("bg-card rounded-2xl p-3.5 shadow-soft active:scale-[0.98] transition-all cursor-pointer", !msg.read && "ring-2 ring-primary/20")}>
                <div className="flex items-start gap-3">
                  <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5", color)}>
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm truncate">{msg.title}</p>
                      {!msg.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 font-medium">{msg.body}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-muted-foreground font-medium">To: {msg.recipientName}</span>
                      <span className="text-[10px] text-muted-foreground">· {msg.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunicationPage;
