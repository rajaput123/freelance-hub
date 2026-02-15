import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  Users,
  Calendar,
  Wallet,
  Camera,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Edit2,
  Check,
  X,
  Shield,
  FileText,
  Settings,
  Bell,
  Globe,
  Lock,
  ChevronRight,
  Package,
  HelpCircle,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DocumentUpload from "@/components/DocumentUpload";

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { clients, jobs, events, payments } = useAppData();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const photoInputRef = useRef<HTMLInputElement>(null);

  const totalEarnings = payments.reduce((s, p) => s + p.amount, 0);

  const stats = [
    { label: "Jobs", value: jobs.length, icon: Briefcase, color: "bg-primary/10 text-primary", path: "/more/jobs" },
    { label: "Clients", value: clients.length, icon: Users, color: "bg-info/10 text-info", path: "/more/clients" },
    { label: "Events", value: events.length, icon: Calendar, color: "bg-success/10 text-success", path: "/more/events" },
    { label: "Earned", value: `₹${(totalEarnings / 1000).toFixed(0)}k`, icon: Wallet, color: "bg-warning/10 text-warning", path: "/more/finance" },
  ];

  const handleEdit = (field: string, currentValue: any) => {
    setIsEditing(field);
    setEditValues({ [field]: currentValue || "" });
  };

  const handleSave = (field: string) => {
    updateUser({ [field]: editValues[field] });
    toast.success("Updated successfully!");
    setIsEditing(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditValues({});
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateUser({ profilePhoto: url });
      toast.success("Profile photo updated!");
    }
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const verificationStatus = user?.documents && user.documents.length > 0 ? "verified" : "pending";
  const hasDocuments = user?.documents && user.documents.length > 0;

  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Surat",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary px-5 pt-4 pb-10 rounded-b-[32px] shadow-glow">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-primary-foreground/70 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <div className="flex items-center gap-4">
          <div className="relative">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="h-16 w-16 rounded-2xl object-cover border-2 border-primary-foreground/20"
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
            )}
            <button
              onClick={() => photoInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-card flex items-center justify-center shadow-sm active:scale-95"
            >
              <Camera className="h-3 w-3 text-muted-foreground" />
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-primary-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {user?.name || "Freelancer"}
            </h1>
            <p className="text-[11px] text-primary-foreground/70 mt-0.5">
              {user?.workCategory || "Service Provider"}
            </p>
            {user?.city && (
              <p className="text-[10px] text-primary-foreground/60 mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {user.city}
              </p>
            )}
          </div>
        </div>

        {/* Verification Status */}
        <div className="mt-4 flex items-center gap-2">
          {verificationStatus === "verified" ? (
            <div className="flex items-center gap-1.5 bg-primary-foreground/20 rounded-lg px-2.5 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
              <span className="text-[10px] font-semibold text-primary-foreground">Verified</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-warning/20 rounded-lg px-2.5 py-1">
              <AlertCircle className="h-3.5 w-3.5 text-warning" />
              <span className="text-[10px] font-semibold text-warning">Verification Pending</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-5">
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat, i) => (
            <button
              key={i}
              onClick={() => navigate(stat.path)}
              className="bg-white rounded-2xl p-3 text-center shadow-lg border border-border/20 active:scale-95 transition-all"
            >
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center mx-auto ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Personal & Business Details */}
      <div className="px-4 mt-6">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Personal Information
        </h2>
        <div className="bg-white rounded-2xl divide-y divide-border shadow-lg border border-border/20 overflow-hidden">
          {/* Name */}
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Full Name</p>
                  {isEditing === "name" ? (
                    <Input
                      value={editValues.name || ""}
                      onChange={(e) => setEditValues({ name: e.target.value })}
                      className="h-8 mt-1 text-sm"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm font-semibold mt-0.5 truncate">{user?.name || "Not set"}</p>
                  )}
                </div>
              </div>
              {isEditing === "name" ? (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleSave("name")}
                    className="h-7 w-7 rounded-lg bg-success/10 text-success flex items-center justify-center active:scale-95"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="h-7 w-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center active:scale-95"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit("name", user?.name)}
                  className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center active:scale-95"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Phone</p>
                  {isEditing === "phone" ? (
                    <Input
                      value={editValues.phone || ""}
                      onChange={(e) => setEditValues({ phone: e.target.value })}
                      className="h-8 mt-1 text-sm"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm font-semibold mt-0.5 truncate">{user?.phone || "Not set"}</p>
                  )}
                </div>
              </div>
              {isEditing === "phone" ? (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleSave("phone")}
                    className="h-7 w-7 rounded-lg bg-success/10 text-success flex items-center justify-center active:scale-95"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="h-7 w-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center active:scale-95"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit("phone", user?.phone)}
                  className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center active:scale-95"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Email</p>
                  {isEditing === "email" ? (
                    <Input
                      type="email"
                      value={editValues.email || ""}
                      onChange={(e) => setEditValues({ email: e.target.value })}
                      className="h-8 mt-1 text-sm"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm font-semibold mt-0.5 truncate">{user?.email || "Not set"}</p>
                  )}
                </div>
              </div>
              {isEditing === "email" ? (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleSave("email")}
                    className="h-7 w-7 rounded-lg bg-success/10 text-success flex items-center justify-center active:scale-95"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="h-7 w-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center active:scale-95"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit("email", user?.email)}
                  className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center active:scale-95"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Business Name */}
          {user?.businessName && (
            <div className="p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Business Name
                    </p>
                    {isEditing === "businessName" ? (
                      <Input
                        value={editValues.businessName || ""}
                        onChange={(e) => setEditValues({ businessName: e.target.value })}
                        className="h-8 mt-1 text-sm"
                        autoFocus
                      />
                    ) : (
                      <p className="text-sm font-semibold mt-0.5 truncate">{user.businessName}</p>
                    )}
                  </div>
                </div>
                {isEditing === "businessName" ? (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSave("businessName")}
                      className="h-7 w-7 rounded-lg bg-success/10 text-success flex items-center justify-center active:scale-95"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="h-7 w-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center active:scale-95"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit("businessName", user.businessName)}
                    className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center active:scale-95"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="p-3.5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                    Description
                  </p>
                  {isEditing === "description" ? (
                    <Textarea
                      value={editValues.description || ""}
                      onChange={(e) => setEditValues({ description: e.target.value })}
                      className="h-20 text-sm"
                      autoFocus
                      placeholder="Tell clients about your experience..."
                    />
                  ) : (
                    <p className="text-sm font-medium mt-0.5">
                      {user?.description || "No description added"}
                    </p>
                  )}
                </div>
              </div>
              {isEditing === "description" ? (
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handleSave("description")}
                    className="h-7 w-7 rounded-lg bg-success/10 text-success flex items-center justify-center active:scale-95"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="h-7 w-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center active:scale-95"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit("description", user?.description)}
                  className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center active:scale-95"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Area */}
      <div className="px-4 mt-6">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Service Area
        </h2>
        <div className="bg-white rounded-2xl divide-y divide-border shadow-lg border border-border/20 overflow-hidden">
          {/* City */}
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">City</p>
                  {isEditing === "city" ? (
                    <Select
                      value={editValues.city || ""}
                      onValueChange={(v) => {
                        setEditValues({ city: v });
                        handleSave("city");
                      }}
                    >
                      <SelectTrigger className="h-8 mt-1 text-sm">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-semibold mt-0.5 truncate">{user?.city || "Not set"}</p>
                  )}
                </div>
              </div>
              {isEditing !== "city" && (
                <button
                  onClick={() => handleEdit("city", user?.city)}
                  className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center active:scale-95"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Coverage Area */}
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Coverage Area
                  </p>
                  {isEditing === "coverageArea" ? (
                    <Input
                      value={editValues.coverageArea || ""}
                      onChange={(e) => setEditValues({ coverageArea: e.target.value })}
                      className="h-8 mt-1 text-sm"
                      placeholder="e.g., South Mumbai, Central Delhi"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm font-semibold mt-0.5 truncate">
                      {user?.coverageArea || "Not set"}
                    </p>
                  )}
                </div>
              </div>
              {isEditing === "coverageArea" ? (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleSave("coverageArea")}
                    className="h-7 w-7 rounded-lg bg-success/10 text-success flex items-center justify-center active:scale-95"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="h-7 w-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center active:scale-95"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit("coverageArea", user?.coverageArea)}
                  className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center active:scale-95"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="px-4 mt-6">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Documents & Verification
        </h2>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
          {hasDocuments ? (
            <div className="space-y-3">
              {user.documents!.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground">{doc.type}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground mb-1">No documents uploaded</p>
              <p className="text-xs text-muted-foreground mb-3">
                Upload documents to verify your identity
              </p>
              <Button
                onClick={() => navigate("/onboarding/documents")}
                className="h-9 rounded-xl text-xs font-semibold gradient-primary shadow-glow border-0"
              >
                Upload Documents
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-4 mt-6">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Quick Access
        </h2>
        <div className="bg-white rounded-2xl divide-y divide-border shadow-lg border border-border/20 overflow-hidden">
          {[
            { icon: Package, label: "Service Catalog", path: "/more/services" },
            { icon: Wallet, label: "Finance Summary", path: "/more/finance" },
            { icon: Settings, label: "Settings", path: "/settings" },
            { icon: HelpCircle, label: "Help & Support", path: "/help" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3.5 w-full p-3.5 hover:bg-muted/30 active:bg-muted transition-colors"
            >
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-semibold text-sm text-foreground flex-1 text-left">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mt-6 mb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 p-3.5 bg-destructive/10 rounded-2xl hover:bg-destructive/20 active:bg-destructive/30 transition-colors"
        >
          <div className="h-9 w-9 rounded-xl bg-destructive/20 flex items-center justify-center shrink-0">
            <LogOut className="h-4 w-4 text-destructive" />
          </div>
          <span className="font-semibold text-sm text-destructive flex-1 text-left">Log Out</span>
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground pb-4 font-medium">Version 1.0.0</p>
    </div>
  );
};

export default ProfilePage;
