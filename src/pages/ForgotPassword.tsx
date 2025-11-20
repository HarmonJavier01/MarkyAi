import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/neon";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if we have the access_token and type=recovery in URL
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');

    if (type === 'recovery' && accessToken) {
      // Set the session with the token
      auth.setSession({
        access_token: accessToken,
        refresh_token: searchParams.get('refresh_token') || '',
      });
      setResetMode(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (resetMode) {
      // Handle password reset
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      try {
        const { error } = await auth.updateUser({
          password: password
        });
        if (error) throw error;
        setSuccess(true);
        setTimeout(() => window.location.href = '/login', 2000);
      } catch (error) {
        console.error('Password reset error:', error);
        setError((error as Error).message);
      }
    } else {
      // Send password reset email
      try {
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-purple via-surface-pink to-surface-blue flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
            M
          </div>
          <h1 className="text-3xl font-bold mb-2">{resetMode ? "Set New Password" : "Reset Password"}</h1>
          <p className="text-muted-foreground">
            {submitted
              ? "Password reset email sent successfully"
              : resetMode
              ? "Enter your new password below"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-3xl">
              ✓
            </div>
            <h1 className="text-3xl font-bold mb-2">Password Reset Successful</h1>
            <p className="text-muted-foreground mb-4">Your password has been updated. Redirecting to login...</p>
          </div>
        ) : !submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {resetMode ? (
              <>
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                  Update Password
                </Button>
              </>
            ) : (
              <>
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

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                  Send Reset Email
                </Button>
              </>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
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