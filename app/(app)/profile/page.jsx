'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import {
  fadeUp,
  scaleIn,
} from "@/components/motion/variants";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Real Data State
  const [userData, setUserData] = useState({
    name: "", email: "", profession: "other", bio: "", location: "", website: ""
  });
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyDigest: false,
    promptSuggestions: true,
    autoSave: true,
    defaultFramework: "walt",
    theme: "dark",
  });

  const [usageStats, setUsageStats] = useState({
    currentPlan: "free",
    promptsThisMonth: 0,
    promptsLimit: 50,
    vaultItems: 0,
    vaultLimit: 10,
    estimatedCost: 0.00,
  });

  // API Key State
  const [customApiKey, setCustomApiKey] = useState("");

  // 1. Fetch Data on Load
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/user/settings');
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();

        setUserData({
            name: data.profile.name || "",
            email: data.profile.email || "",
            profession: data.profile.profession || "other",
            bio: data.profile.bio || "",
            location: data.profile.location || "",
            website: data.profile.website || "",
        });

        if (data.profile.preferences) {
            setSettings(data.profile.preferences);
        }
        
        // Store existing key mask if exists
        if (data.profile.customApiKey) {
             setCustomApiKey("sk-••••••••••••••••");
        }

        setUsageStats({
            ...usageStats,
            ...data.stats
        });

      } catch (error) {
        toast.error("Could not load user data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Generic Save Handler
  const handleSave = async (payload, successMessage = "Saved successfully") => {
    setIsSaving(true);
    try {
        const res = await fetch('/api/user/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error("Failed to save");
        toast.success(successMessage);
    } catch (error) {
        toast.error("Something went wrong");
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
      try {
          await fetch('/api/user/settings', { method: 'DELETE' });
          signOut({ callbackUrl: '/' });
      } catch (err) {
          toast.error("Failed to delete account");
      }
  };

  if (loading) return (
      <div className="min-h-screen pt-32 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-1" />
      </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-16 bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Settings
          </h1>
          <p className="text-xl text-gray-300">
            Manage your account, preferences, and API configuration
          </p>
        </motion.div>

        {/* Tab Nav */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-2 mb-8 overflow-x-auto"
        >
          <div className="flex min-w-max sm:w-full gap-2 sm:justify-around">
            {[
              { id: "profile", label: "Profile", icon: "👤" },
              { id: "plan", label: "Plan & Billing", icon: "💳" },
              { id: "api", label: "API Configuration", icon: "🔑" }, // Moved API here
              { id: "preferences", label: "Preferences", icon: "⚙️" },
              { id: "danger", label: "Danger Zone", icon: "⚠️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "bg-accent-1/20 text-white shadow-clay border border-accent-1/50"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "profile" && (
              <ProfileTab
                userData={userData}
                setUserData={setUserData}
                isSaving={isSaving}
                onSave={() => handleSave(userData, "Profile updated")}
              />
            )}

            {activeTab === "api" && (
              <ApiKeysTab
                customApiKey={customApiKey}
                setCustomApiKey={setCustomApiKey}
                isSaving={isSaving}
                onSave={() => handleSave({ customApiKey }, "API Key updated")}
              />
            )}

            {activeTab === "plan" && <PlanBillingTab usageStats={usageStats} />}

            {activeTab === "preferences" && (
              <PreferencesTab
                settings={settings}
                setSettings={setSettings}
                isSaving={isSaving}
                onSave={() => handleSave({ preferences: settings }, "Preferences saved")}
              />
            )}

            {activeTab === "danger" && <DangerZoneTab onDelete={handleDeleteAccount} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS (Cleaned up for brevity, logic connected) ---

function ProfileTab({ userData, setUserData, isSaving, onSave }) {
  const professions = [
    { id: "developer", label: "Developer", icon: "💻" },
    { id: "marketer", label: "Marketer", icon: "📊" },
    { id: "designer", label: "Designer", icon: "🎨" },
    { id: "writer", label: "Writer", icon: "✍️" },
    { id: "analyst", label: "Data Analyst", icon: "📈" },
    { id: "manager", label: "Product Manager", icon: "🚀" },
    { id: "other", label: "Other", icon: "👤" },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Avatar Side */}
      <div className="lg:col-span-1">
        <div className="glass rounded-2xl p-6 text-center border border-white/10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-1 to-purple-600 flex items-center justify-center text-5xl font-bold text-white mx-auto mb-4 shadow-glow-indigo">
            {userData.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{userData.name}</h3>
          <p className="text-sm text-gray-400">{userData.email}</p>
          <div className="mt-6 pt-6 border-t border-white/10 text-sm text-gray-400">
             Joined recently
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="lg:col-span-2">
        <div className="glass rounded-2xl p-8 border border-white/10 space-y-6">
          <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
          
          <div className="grid gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input 
                    value={userData.name} 
                    onChange={e => setUserData({...userData, name: e.target.value})} 
                    className="input-inset w-full" 
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea 
                    value={userData.bio} 
                    onChange={e => setUserData({...userData, bio: e.target.value})} 
                    className="input-inset w-full h-24 resize-none" 
                    placeholder="Tell us about yourself..."
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input 
                        value={userData.location} 
                        onChange={e => setUserData({...userData, location: e.target.value})} 
                        className="input-inset w-full"
                        placeholder="City, Country"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    <input 
                        value={userData.website} 
                        onChange={e => setUserData({...userData, website: e.target.value})} 
                        className="input-inset w-full"
                        placeholder="https://..."
                    />
                 </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Profession</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {professions.map(prof => (
                        <button
                            key={prof.id}
                            onClick={() => setUserData({...userData, profession: prof.id})}
                            className={`p-3 rounded-xl border text-left transition-all ${
                                userData.profession === prof.id 
                                ? "bg-accent-1/20 border-accent-1 text-white" 
                                : "border-white/5 text-gray-400 hover:bg-white/5"
                            }`}
                        >
                            <div className="text-lg mb-1">{prof.icon}</div>
                            <div className="text-xs font-bold">{prof.label}</div>
                        </button>
                    ))}
                </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-right">
            <button 
                onClick={onSave} 
                disabled={isSaving}
                className="btn-clay px-8 py-3 disabled:opacity-50"
            >
                {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApiKeysTab({ customApiKey, setCustomApiKey, isSaving, onSave }) {
    const [show, setShow] = useState(false);
    return (
        <div className="glass rounded-2xl p-8 border border-white/10 max-w-3xl">
            <h3 className="text-xl font-bold text-white mb-2">API Configuration</h3>
            <p className="text-gray-400 mb-6">Add your OpenAI API key to bypass free limits.</p>
            
            <label className="block text-sm font-medium text-gray-300 mb-2">OpenAI API Key</label>
            <div className="flex gap-3 mb-2">
                <div className="relative flex-1">
                    <input 
                        type={show ? "text" : "password"} 
                        value={customApiKey} 
                        onChange={e => setCustomApiKey(e.target.value)} 
                        className="input-inset w-full pr-12 font-mono" 
                        placeholder="sk-..."
                    />
                    <button 
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                        {show ? "Hide" : "Show"}
                    </button>
                </div>
                <button 
                    onClick={onSave}
                    disabled={!customApiKey || isSaving} 
                    className="btn-clay px-6"
                >
                    {isSaving ? "..." : "Update"}
                </button>
            </div>
            <p className="text-xs text-gray-500">
                We encrypt your key securely. It is only used for your requests.
            </p>
        </div>
    );
}

function PlanBillingTab({ usageStats }) {
    return (
        <div className="glass rounded-2xl p-8 border border-white/10">
             <h3 className="text-xl font-bold text-white mb-6">Usage & Plan</h3>
             <div className="grid md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-white/5 rounded-xl p-4 text-center">
                     <div className="text-2xl font-bold text-white">{usageStats.promptsThisMonth} / {usageStats.promptsLimit}</div>
                     <div className="text-xs text-gray-400">Monthly Optimizations</div>
                     <div className="w-full bg-dark-200 h-1.5 rounded-full mt-3 overflow-hidden">
                         <div className="bg-accent-1 h-full" style={{width: `${(usageStats.promptsThisMonth/usageStats.promptsLimit)*100}%`}} />
                     </div>
                 </div>
                 <div className="bg-white/5 rounded-xl p-4 text-center">
                     <div className="text-2xl font-bold text-white">{usageStats.vaultItems}</div>
                     <div className="text-xs text-gray-400">Vault Items</div>
                 </div>
                 <div className="bg-white/5 rounded-xl p-4 text-center">
                     <div className="text-2xl font-bold text-white">Free</div>
                     <div className="text-xs text-gray-400">Current Plan</div>
                 </div>
             </div>
             
             <div className="p-4 border border-accent-1/30 bg-accent-1/5 rounded-xl flex justify-between items-center">
                 <div>
                     <h4 className="font-bold text-white">Upgrade to Pro</h4>
                     <p className="text-sm text-gray-400">Get unlimited optimizations and advanced models.</p>
                 </div>
                 <button className="btn-clay px-6 py-2 text-sm">View Plans</button>
             </div>
        </div>
    );
}

function PreferencesTab({ settings, setSettings, isSaving, onSave }) {
    const toggle = (key) => setSettings({...settings, [key]: !settings[key]});
    return (
        <div className="glass rounded-2xl p-8 border border-white/10 max-w-3xl">
            <h3 className="text-xl font-bold text-white mb-6">App Preferences</h3>
            <div className="space-y-4">
                {[
                    { k: 'emailNotifications', l: 'Email Notifications', d: 'Receive updates via email' },
                    { k: 'autoSave', l: 'Auto-Save', d: 'Save drafts automatically while typing' },
                    { k: 'promptSuggestions', l: 'AI Suggestions', d: 'Show AI tips in composer' }
                ].map(item => (
                    <div key={item.k} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                            <div className="font-medium text-white">{item.l}</div>
                            <div className="text-xs text-gray-500">{item.d}</div>
                        </div>
                        <button 
                            onClick={() => toggle(item.k)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings[item.k] ? 'bg-accent-1' : 'bg-gray-600'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings[item.k] ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-right">
                 <button onClick={onSave} disabled={isSaving} className="btn-clay px-6 py-2">{isSaving ? "Saving..." : "Save Preferences"}</button>
            </div>
        </div>
    );
}

function DangerZoneTab({ onDelete }) {
    return (
        <div className="glass rounded-2xl p-8 border border-red-500/30">
             <h3 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h3>
             <p className="text-gray-400 mb-6">Destructive actions that cannot be undone.</p>
             
             <div className="flex justify-between items-center p-4 border border-red-500/20 rounded-xl bg-red-500/5">
                 <div>
                     <div className="font-bold text-white">Delete Account</div>
                     <div className="text-xs text-gray-500">Permanently remove your account and all data.</div>
                 </div>
                 <button 
                    onClick={() => { if(confirm('Are you sure?')) onDelete(); }}
                    className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                 >
                     Delete Account
                 </button>
             </div>
        </div>
    );
}