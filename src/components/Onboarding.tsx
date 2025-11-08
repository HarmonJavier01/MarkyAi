import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OnboardingProps {
  onComplete: (userData: unknown) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    industry: '',
    niche: '',
    useCases: [] as string[],
    platforms: [] as string[],
    imageTypes: [] as string[],
    brandStyle: [] as string[],
    brandColors: [] as string[],
    goals: [] as string[],
    frequency: ''
  });

  const steps = [
    {
      title: "Welcome to Marky AI Studio",
      subtitle: "Let's get you started with AI-powered content creation",
      content: (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center text-white text-6xl font-bold shadow-xl">
            M
          </div>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Create stunning marketing images, ads, and social media content with AI.
            Tailored specifically for your brand and industry.
          </p>
        </div>
      )
    },
    {
      title: "What's your role?",
      subtitle: "This helps us tailor the experience",
      content: (
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            { label: 'Business Owner', value: 'owner' },
            { label: 'Marketing Manager', value: 'marketing' },
            { label: 'Content Creator', value: 'creator' },
            { label: 'Social Media Manager', value: 'social' },
            { label: 'Freelancer/Agency', value: 'freelancer' },
            { label: 'Designer', value: 'designer' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setUserData({...userData, role: option.value})}
              className={`p-6 border-2 rounded-xl transition-all ${
                userData.role === option.value
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "What industry are you in?",
      subtitle: "This helps us understand your visual needs",
      content: (
        <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
          {[
            'E-commerce/Retail', 'Food & Beverage', 'Real Estate', 'Health & Wellness',
            'Technology/SaaS', 'Fashion & Beauty', 'Finance/Insurance', 'Education',
            'Hospitality/Travel', 'Professional Services'
          ].map((industry) => (
            <button
              key={industry}
              onClick={() => setUserData({...userData, industry})}
              className={`p-4 border-2 rounded-lg transition-all text-sm ${
                userData.industry === industry
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Tell us about your niche",
      subtitle: "Be specific to get better results",
      content: (
        <div className="max-w-md mx-auto space-y-3">
          <Input
            value={userData.niche}
            onChange={(e) => setUserData({...userData, niche: e.target.value})}
            placeholder="e.g., organic skincare, luxury vacation rentals, B2B software"
            className="text-center"
          />
          <p className="text-sm text-muted-foreground text-center">
            Examples: "organic skincare," "luxury vacation rentals," "B2B software"
          </p>
        </div>
      )
    },
    {
      title: "What will you use these images for?",
      subtitle: "Select all that apply",
      content: (
        <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
          {[
            'Social media posts', 'Paid advertising', 'Website/landing pages', 'Email marketing',
            'Product launches', 'Blog content', 'Event promotions', 'Seasonal campaigns'
          ].map((useCase) => (
            <button
              key={useCase}
              onClick={() => {
                const newCases = userData.useCases.includes(useCase)
                  ? userData.useCases.filter(c => c !== useCase)
                  : [...userData.useCases, useCase];
                setUserData({...userData, useCases: newCases});
              }}
              className={`p-4 border-2 rounded-lg transition-all text-sm flex items-center justify-between ${
                userData.useCases.includes(useCase)
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <span>{useCase}</span>
              {userData.useCases.includes(useCase) && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Where will you share these images?",
      subtitle: "Select your primary platforms",
      content: (
        <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
          {[
            'Instagram', 'Facebook', 'LinkedIn', 'Twitter/X',
            'Pinterest', 'TikTok', 'Website', 'Email newsletters'
          ].map((platform) => (
            <button
              key={platform}
              onClick={() => {
                const newPlatforms = userData.platforms.includes(platform)
                  ? userData.platforms.filter(p => p !== platform)
                  : [...userData.platforms, platform];
                setUserData({...userData, platforms: newPlatforms});
              }}
              className={`p-4 border-2 rounded-lg transition-all text-sm flex items-center justify-between ${
                userData.platforms.includes(platform)
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <span>{platform}</span>
              {userData.platforms.includes(platform) && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "What types of images do you need?",
      subtitle: "Select all that apply",
      content: (
        <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
          {[
            'Product showcase', 'Lifestyle/contextual', 'Promotional/sale announcements',
            'Text-based graphics', 'Behind-the-scenes', 'Testimonial graphics'
          ].map((type) => (
            <button
              key={type}
              onClick={() => {
                const newTypes = userData.imageTypes.includes(type)
                  ? userData.imageTypes.filter(t => t !== type)
                  : [...userData.imageTypes, type];
                setUserData({...userData, imageTypes: newTypes});
              }}
              className={`p-4 border-2 rounded-lg transition-all text-sm flex items-center justify-between ${
                userData.imageTypes.includes(type)
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <span>{type}</span>
              {userData.imageTypes.includes(type) && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Describe your brand style",
      subtitle: "Select 2-3 that best fit",
      content: (
        <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto">
          {[
            'Minimalist/Clean', 'Bold/Vibrant', 'Elegant/Luxury', 'Fun/Playful',
            'Professional/Corporate', 'Earthy/Natural', 'Modern/Futuristic', 'Vintage/Retro'
          ].map((style) => (
            <button
              key={style}
              onClick={() => {
                const newStyles = userData.brandStyle.includes(style)
                  ? userData.brandStyle.filter(s => s !== style)
                  : userData.brandStyle.length < 3
                    ? [...userData.brandStyle, style]
                    : userData.brandStyle;
                setUserData({...userData, brandStyle: newStyles});
              }}
              className={`p-4 border-2 rounded-lg transition-all text-sm flex items-center justify-between ${
                userData.brandStyle.includes(style)
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
              disabled={userData.brandStyle.length >= 3 && !userData.brandStyle.includes(style)}
            >
              <span>{style}</span>
              {userData.brandStyle.includes(style) && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "You're all set! 🎉",
      subtitle: "Ready to create amazing content",
      content: (
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <Check className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Welcome, {userData.name || 'there'}!</h3>
            <p className="text-muted-foreground">
              Your workspace is ready. Start creating stunning images:
            </p>
            <div className="grid gap-3 text-left">
              <div className="flex items-start space-x-3 p-4 bg-surface-purple rounded-lg">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="font-medium">Social Media Content</div>
                  <div className="text-sm text-muted-foreground">Stories, posts, and ads</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-surface-pink rounded-lg">
                <div className="text-2xl">🎨</div>
                <div>
                  <div className="font-medium">Marketing Materials</div>
                  <div className="text-sm text-muted-foreground">Banners, ads, and promotions</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-surface-blue rounded-lg">
                <div className="text-2xl">📦</div>
                <div>
                  <div className="font-medium">Product Images</div>
                  <div className="text-sm text-muted-foreground">Showcase your products beautifully</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step === steps.length - 1) {
      onComplete(userData);
    } else {
      setStep(step + 1);
    }
  };

  const canProceed = () => {
    if (step === 1) return userData.role;
    if (step === 2) return userData.industry;
    if (step === 3) return userData.niche;
    if (step === 4) return userData.useCases.length > 0;
    if (step === 5) return userData.platforms.length > 0;
    if (step === 6) return userData.imageTypes.length > 0;
    if (step === 7) return userData.brandStyle.length > 0;
    return true;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-surface-purple via-surface-pink to-surface-blue z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-xl max-w-4xl w-full p-8 relative">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 mx-1 rounded-full transition-all ${
                  idx <= step ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground text-center">
            Step {step + 1} of {steps.length}
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-2">{steps[step].title}</h2>
          <p className="text-muted-foreground text-center mb-8">{steps[step].subtitle}</p>
          <div className="min-h-[300px] flex items-center justify-center">
            {steps[step].content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
          >
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onComplete({ ...userData, skipped: true })}
            >
              Skip Setup
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-primary to-accent"
            >
              <span>{step === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
