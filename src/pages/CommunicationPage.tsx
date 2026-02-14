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

  const typeIcons = {
    reminder: Bell,
    update: MessageSquare,
    announcement: Megaphone,
  };

  const typeColors = {
    reminder: "bg-warning/8 text-warning",
    update: "bg-info/8 text-info",
    announcement: "bg-destructive/8 text-destructive",
  };

  const handleSend = () => {
    if (!title || !body) { toast.error("Title and message required"); return; }
    const recipient = clients.find(c => c.id === recipientId);
    addMessage({
      type: msgType,
      title,
      body,
      recipientName: recipient?.name || "All Clients",
      recipientId: recipientId || undefined,
      date: new Date().toISOString().split("T")[0],
      read: false,
    });
    toast.success("Message sent!");
    setTitle(""); setBody(""); setRecipientId("");
    setShowCompose(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-lg font-bold">Communication</h1>
          </div>
          <button
            onClick={() => setShowCompose(!showCompose)}
            className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"
          >
            <Plus className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Tab */}
      <div className="px-4 mt-3">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setTab("all")}
            className={cn("flex-1 rounded-lg py-2 text-xs font-semibold", tab === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setTab("unread")}
            className={cn("flex-1 rounded-lg py-2 text-xs font-semibold", tab === "unread" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Compose */}
      {showCompose && (
        <div className="px-4 mt-3">
          <div className="border border-border rounded-xl p-3 space-y-2.5">
            <p className="text-xs font-semibold">New Message</p>
            <Select value={msgType} onValueChange={v => setMsgType(v as typeof msgType)}>
              <SelectTrigger className="h-10 rounded-lg text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reminder">Payment Reminder</SelectItem>
                <SelectItem value="update">Job/Event Update</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger className="h-10 rounded-lg text-sm">
                <SelectValue placeholder="Select recipient (or All)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Subject" value={title} onChange={e => setTitle(e.target.value)} className="h-10 rounded-lg text-sm" />
            <Textarea placeholder="Message body..." value={body} onChange={e => setBody(e.target.value)} className="rounded-lg text-sm" rows={3} />
            <Button onClick={handleSend} className="w-full h-10 rounded-lg text-sm font-semibold gap-2">
              <Send className="h-4 w-4" /> Send Message
            </Button>
          </div>
        </div>
      )}

      {/* Messages list */}
      <div className="px-4 mt-3 space-y-2">
        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No messages</p>
          </div>
        ) : (
          displayed.map(msg => {
            const Icon = typeIcons[msg.type];
            const color = typeColors[msg.type];
            return (
              <div
                key={msg.id}
                onClick={() => markMessageRead(msg.id)}
                className={cn(
                  "bg-card border rounded-xl p-3 active:bg-muted/40 transition-colors cursor-pointer",
                  !msg.read ? "border-primary/30" : "border-border"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0 mt-0.5", color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">{msg.title}</p>
                      {!msg.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{msg.body}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-muted-foreground">To: {msg.recipientName}</span>
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
