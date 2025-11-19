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
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const hasCompletedOnboarding = localStorage.getItem(`marky_onboarding_complete_${user.id}`);
      if (hasCompletedOnboarding) {
        setShowOnboarding(false);
        const data = JSON.parse(localStorage.getItem(`marky_user_data_${user.id}`) || '{}');
        setUserData(data);
      }
    }
  }, [user]);

  const handleOnboardingComplete = (data: UserData) => {
    localStorage.setItem('marky_onboarding_complete', 'true');
    localStorage.setItem('marky_user_data', JSON.stringify(data));
    setUserData(data);
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <MainApp user={user} userData={userData} onResetOnboarding={() => setShowOnboarding(true)} />;
};

export default Index;
