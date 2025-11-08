import { useState, useEffect } from "react";
import { Onboarding } from "@/components/Onboarding";
import { MainApp } from "@/components/MainApp";
import { User } from "firebase/auth";

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

interface IndexProps {
  user: User | null;
}

const Index = ({ user }: IndexProps) => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (user) {
      const hasCompletedOnboarding = localStorage.getItem(`marky_onboarding_complete_${user.uid}`);
      if (hasCompletedOnboarding) {
        setShowOnboarding(false);
        const data = JSON.parse(localStorage.getItem(`marky_user_data_${user.uid}`) || '{}');
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
