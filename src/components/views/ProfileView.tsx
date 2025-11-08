import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Save } from "lucide-react";

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

interface ProfileViewProps {
  userData: UserData | null;
  onUpdate: (updatedData: UserData) => void;
}

export function ProfileView({ userData, onUpdate }: ProfileViewProps) {
  const [editedData, setEditedData] = useState<UserData>({
    name: '',
    email: '',
    role: '',
    industry: '',
    niche: '',
    useCases: [],
    platforms: [],
    imageTypes: [],
    brandStyle: [],
    brandColors: [],
    goals: [],
    frequency: ''
  });

  useEffect(() => {
    if (userData) {
      setEditedData(userData);
    }
  }, [userData]);

  const handleSave = () => {
    onUpdate(editedData);
    // Optionally save to localStorage
    localStorage.setItem('userData', JSON.stringify(editedData));
  };

  const updateField = (field: keyof UserData, value: UserData[keyof UserData]) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: keyof UserData, value: string) => {
    const current = editedData[field] as string[];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateField(field, updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Edit your onboarding information</p>
      </div>

      {/* Personal Info */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editedData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editedData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Role */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Your Role</h2>
        <div className="grid grid-cols-2 gap-4">
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
              onClick={() => updateField('role', option.value)}
              className={`p-4 border-2 rounded-lg transition-all ${
                editedData.role === option.value
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Industry */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Industry</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            'E-commerce/Retail', 'Food & Beverage', 'Real Estate', 'Health & Wellness',
            'Technology/SaaS', 'Fashion & Beauty', 'Finance/Insurance', 'Education',
            'Hospitality/Travel', 'Professional Services'
          ].map((industry) => (
            <button
              key={industry}
              onClick={() => updateField('industry', industry)}
              className={`p-4 border-2 rounded-lg transition-all text-sm ${
                editedData.industry === industry
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Niche */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Niche</h2>
        <Input
          value={editedData.niche}
          onChange={(e) => updateField('niche', e.target.value)}
          placeholder="e.g., organic skincare, luxury vacation rentals, B2B software"
          className="text-center"
        />
      </div>

      {/* Use Cases */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            'Social media posts', 'Paid advertising', 'Website/landing pages', 'Email marketing',
            'Product launches', 'Blog content', 'Event promotions', 'Seasonal campaigns'
          ].map((useCase) => (
            <button
              key={useCase}
              onClick={() => toggleArrayField('useCases', useCase)}
              className={`p-4 border-2 rounded-lg transition-all text-sm flex items-center justify-between ${
                editedData.useCases.includes(useCase)
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <span>{useCase}</span>
              {editedData.useCases.includes(useCase) && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Platforms</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            'Instagram', 'Facebook', 'LinkedIn', 'Twitter/X',
            'Pinterest', 'TikTok', 'Website', 'Email newsletters'
          ].map((platform) => (
            <button
              key={platform}
              onClick={() => toggleArrayField('platforms', platform)}
              className={`p-4 border-2 rounded-lg transition-all text-sm flex items-center justify-between ${
                editedData.platforms.includes(platform)
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <span>{platform}</span>
              {editedData.platforms.includes(platform) && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Image Types */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Image Types</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            'Product showcase', 'Lifestyle/contextual', 'Promotional/sale announcements',
            'Text-based graphics', 'Behind-the-scenes', 'Testimonial graphics'
          ].map((type) => (
            <button
              key={type}
              onClick={() => toggleArrayField('imageTypes', type)}
              className={`p-4 border-2 rounded-lg transition-all text-sm flex items-center justify-between ${
                editedData.imageTypes.includes(type)
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <span>{type}</span>
              {editedData.imageTypes.includes(type) && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Style */}
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Brand Style</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            'Minimalist/Clean', 'Bold/Vibrant', 'Elegant/Luxury', 'Fun/Playful',
            'Professional/Corporate', 'Earthy/Natural', 'Modern/Futuristic', 'Vintage/Retro'
          ].map((style) => (
            <button
              key={style}
              onClick={() => toggleArrayField('brandStyle', style)}
              className={`p-4 border-2 rounded-lg transition-all text-sm flex items-center justify-between ${
                editedData.brandStyle.includes(style)
                  ? 'border-primary bg-surface-purple'
                  : 'border-border hover:border-primary/50'
              }`}
              disabled={editedData.brandStyle.length >= 3 && !editedData.brandStyle.includes(style)}
            >
              <span>{style}</span>
              {editedData.brandStyle.includes(style) && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
