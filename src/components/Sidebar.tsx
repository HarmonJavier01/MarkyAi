import { Home, Image, Clock, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

interface User {
  name?: string;
  email?: string;
  displayName?: string;
}

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: User;
}

export function Sidebar({ currentView, onNavigate, user }: SidebarProps) {
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', value: 'home' },
    { icon: Image, label: 'Generate', value: 'generate' },
    { icon: Clock, label: 'History', value: 'history' },
    // { icon: Settings, label: 'Settings', value: 'settings' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="w-64 border-r border-border flex flex-col bg-background">
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
          M
        </div>
        <h1 className="text-xl font-semibold">Marky AI</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.value}
                variant={currentView === item.value ? 'secondary' : 'ghost'}
                className={`w-full justify-start ${
                  currentView === item.value ? 'bg-surface-purple' : ''
                }`}
                onClick={() => onNavigate(item.value)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-3">
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
          <Avatar>
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.displayName || user?.email?.split('@')[0] || 'User'}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email || 'user@email.com'}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}