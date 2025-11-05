import { useState, useEffect } from "react";
import { Onboarding } from "@/components/Onboarding";
import { MainApp } from "@/components/MainApp";

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
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('marky_onboarding_complete');
    if (hasCompletedOnboarding) {
      setShowOnboarding(false);
      const userData = JSON.parse(localStorage.getItem('marky_user_data') || '{}');
      setUser(userData);
    }
  }, []);

  const handleOnboardingComplete = (userData: UserData) => {
    localStorage.setItem('marky_onboarding_complete', 'true');
    localStorage.setItem('marky_user_data', JSON.stringify(userData));
    setUser(userData);
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <MainApp user={user} onResetOnboarding={() => setShowOnboarding(true)} />;
};

export default Index;
