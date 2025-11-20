import { useState, useEffect } from "react";
import { Onboarding } from "@/components/Onboarding";
import { MainApp } from "@/components/MainApp";
import { User } from "@supabase/supabase-js";
import { auth } from "@/lib/neon";

interface UserData {
  name: string;
  email: string;
  role: string;
  industry: string;
  niche: string;
  useCases: string[];
  platforms: string[];
  imageTypes: string[];
  brandStyle: string[];
  brandColors: string[];
  goals: string[];
  frequency: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get initial session
    auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        handleUserSession(session.user);
      } else {
        setShowOnboarding(true);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        handleUserSession(session.user);
      } else {
        setShowOnboarding(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = (currentUser: User) => {
    const createdAt = new Date(currentUser.created_at);
    const now = new Date();
    const isNewUser = (now.getTime() - createdAt.getTime()) < 5 * 60 * 1000; // 5 minutes

    if (!isNewUser) {
      // Existing user, mark onboarding as completed
      localStorage.setItem(`marky_onboarding_complete_${currentUser.id}`, 'true');
    }

    // Check if onboarding is completed
    const hasCompletedOnboarding = localStorage.getItem(`marky_onboarding_complete_${currentUser.id}`);
    if (hasCompletedOnboarding) {
      setShowOnboarding(false);
      const dataStr = localStorage.getItem(`marky_user_data_${currentUser.id}`);
      if (dataStr) {
        setUserData(JSON.parse(dataStr));
      }
    } else {
      setShowOnboarding(true);
      setUserData(null);
    }
  };

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setShowOnboarding(false);
    if (user) {
      localStorage.setItem(`marky_onboarding_complete_${user.id}`, 'true');
      localStorage.setItem(`marky_user_data_${user.id}`, JSON.stringify(data));
    }
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <MainApp user={user} userData={userData} onResetOnboarding={() => setShowOnboarding(true)} />;
};

export default Index;
