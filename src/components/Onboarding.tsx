import { useState, useEffect } from "react";
import { ArrowRight, Check, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  skipped?: boolean;
}

interface OnboardingProps {
  onComplete: (userData: UserData) => void;
  isEdit?: boolean;
  initialData?: UserData;
}
export function Onboarding({ onComplete, isEdit = false, initialData }: OnboardingProps) {
  const [step, setStep] = useState(isEdit ? -1 : 0);
  const [editingStep, setEditingStep] = useState<number | null>(null);
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
  const [otherIndustry, setOtherIndustry] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      setUserData(initialData);
      setOtherIndustry(initialData.industry || '');
      setIsOtherSelected(!['E-commerce', 'Food & Beverage', 'Real Estate', 'Health', 'Technology', 'Fashion & Beauty', 'Finance', 'Education', 'Travel', 'Services'].includes(initialData.industry));
    }
  }, [isEdit, initialData]);
  
  const editSummary = {
    title: "Edit Your Profile",
    subtitle: "Review and update your preferences",
    content: (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Role</h3>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Not set'}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Industry</h3>
                <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{userData.industry || 'Not set'}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Niche</h3>
                <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{userData.niche || 'Not set'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Use Cases</h3>
                <Button variant="ghost" size="sm" onClick={() => setStep(4)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {userData.useCases.length > 0 ? (
                  userData.useCases.map((useCase) => (
                    <span key={useCase} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {useCase}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Not set</p>
                )}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Platforms</h3>
                <Button variant="ghost" size="sm" onClick={() => setStep(5)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {userData.platforms.length > 0 ? (
                  userData.platforms.map((platform) => (
                    <span key={platform} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {platform}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Not set</p>
                )}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Image Types</h3>
                <Button variant="ghost" size="sm" onClick={() => setStep(6)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {userData.imageTypes.length > 0 ? (
                  userData.imageTypes.map((type) => (
                    <span key={type} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {type}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Not set</p>
                )}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Brand Style</h3>
                <Button variant="ghost" size="sm" onClick={() => setStep(7)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {userData.brandStyle.length > 0 ? (
                  userData.brandStyle.map((style) => (
                    <span key={style} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {style}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Not set</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };

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
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-2">
            {[
              'E-commerce', 'Food & Beverage', 'Real Estate', 'Health', 'Technology',
              'Fashion & Beauty', 'Finance', 'Education', 'Travel', 'Services', 'Other'
            ].map((industry) => (
              <button
                key={industry}
                onClick={() => {
                  if (industry === 'Other') {
                    setIsOtherSelected(true);
                    setUserData({...userData, industry: otherIndustry});
                  } else {
                    setIsOtherSelected(false);
                    setOtherIndustry('');
                    setUserData({...userData, industry});
                  }
                }}
                className={`p-3 border-2 rounded-lg transition-all text-sm ${
                  industry === 'Other' 
                    ? isOtherSelected
                      ? 'border-primary bg-surface-purple' 
                      : 'border-border hover:border-primary/50'
                    : userData.industry === industry
                      ? 'border-primary bg-surface-purple'
                      : 'border-border hover:border-primary/50'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
          
          {/* Other industry input - only shown if Other is selected */}
          {isOtherSelected && (
            <div className="space-y-2 pt-3">
              <Input
                placeholder="What's your industry?"
                value={otherIndustry}
                onChange={(e) => {
                  const value = e.target.value;
                  setOtherIndustry(value);
                  setUserData({...userData, industry: value});
                }}
                className="w-full max-w-md mx-auto"
              />
              <p className="text-xs text-center text-muted-foreground">
                Be specific, e.g., "Automotive", "Non-profit", "Entertainment"
              </p>
            </div>
          )}
          
          <div className="text-xs text-center text-muted-foreground">
            Select "Other" to specify your industry if not listed above
          </div>
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
              {userData.useCases.includes(useCase) && <Check className="w-4 h-4 text-primary check-bounce" />}
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
              {userData.platforms.includes(platform) && <Check className="w-4 h-4 text-primary check-bounce" />}
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
              {userData.imageTypes.includes(type) && <Check className="w-4 h-4 text-primary check-bounce" />}
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
              {userData.brandStyle.includes(style) && <Check className="w-4 h-4 text-primary check-bounce" />}
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
            <Check className="w-12 h-12 text-white check-bounce" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Welcome, {userData.name || 'there'}!</h3>
            <p className="text-muted-foreground">
              Your workspace is ready. Start creating stunning images:
            </p>
            <div className="grid gap-3 text-left">
              <div className="flex items-start space-x-3 p-4 bg-surface-purple rounded-lg">
                <div className="text-2xl emoji-bounce">📱</div>
                <div>
                  <div className="font-medium">Social Media Content</div>
                  <div className="text-sm text-muted-foreground">Stories, posts, and ads</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-surface-pink rounded-lg">
                <div className="text-2xl emoji-bounce">🎨</div>
                <div>
                  <div className="font-medium">Marketing Materials</div>
                  <div className="text-sm text-muted-foreground">Banners, ads, and promotions</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-surface-blue rounded-lg">
                <div className="text-2xl emoji-bounce">📦</div>
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
    if (step === 2) return !!userData.industry; // Requires industry to be set (predefined or custom)
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