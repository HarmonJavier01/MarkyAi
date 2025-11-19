import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/neon";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Send password reset email using Neon Auth
      await auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`
      });
      console.log('Password reset email sent to:', email);
      setSubmitted(true);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-purple via-surface-pink to-surface-blue flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
            M
          </div>
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-muted-foreground">
            {submitted
              ? "Password reset email sent successfully"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-2"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
              Send Reset Email
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-3xl">
              ✓
            </div>
            <p className="text-muted-foreground">
              Password reset email sent to <strong>{email}</strong>!
            </p>
            <Link to="/login">
              <Button className="w-full bg-gradient-to-r from-primary to-accent">
                Go to Login
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
