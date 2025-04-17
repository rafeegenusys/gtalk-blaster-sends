
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, ArrowLeft, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingReset, setIsProcessingReset] = useState(true);
  const [hasRecoveryParam, setHasRecoveryParam] = useState(false);

  // Check if this is a password reset session on component mount
  useEffect(() => {
    const checkResetSession = async () => {
      setIsProcessingReset(true);
      
      try {
        // Get the URL hash and search params - needed for password reset flow
        const hash = window.location.hash;
        const searchParams = new URLSearchParams(window.location.search);
        
        console.log("URL params check:", { hash, search: window.location.search });
        
        // Look for recovery token in URL
        const hasRecoveryToken = 
          hash.includes('type=recovery') || 
          searchParams.get('type') === 'recovery';
        
        setHasRecoveryParam(hasRecoveryToken);
        
        if (hasRecoveryToken) {
          console.log("Recovery flow detected");
          
          // Wait a bit for Supabase to process the recovery token
          setTimeout(async () => {
            // Check if we have a valid session after the recovery token is processed
            const { data, error } = await supabase.auth.getSession();
            
            console.log("Session check for password reset:", { 
              hasSession: !!data.session, 
              error: error?.message
            });
            
            if (error || !data.session) {
              setError("Your password reset link has expired. Please request a new one.");
            }
            
            setIsProcessingReset(false);
          }, 1000);
        } else {
          // Not a recovery flow
          setError("Invalid password reset link. Please request a new one.");
          setIsProcessingReset(false);
        }
      } catch (err: any) {
        console.error("Error in reset password flow:", err);
        setError("An error occurred while processing your password reset link");
        setIsProcessingReset(false);
      }
    };
    
    checkResetSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Updating password...");
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword
      });

      if (error) {
        console.error("Password update error:", error);
        throw error;
      }

      console.log("Password updated successfully");
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      // Sign out after password reset to force a clean login
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      console.error("Password update exception:", error);
      setError(error.message || "Failed to update password");
      toast({
        title: "Failed to update password",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isProcessingReset) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gtalk-primary"></div>
          <p>Processing your password reset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex items-center mb-8">
        <MessageSquare className="h-10 w-10 text-gtalk-primary mr-2" />
        <h1 className="text-3xl font-bold text-gtalk-primary">GTalk</h1>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2 p-0 h-8 w-8"
              onClick={() => navigate('/auth')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
          </div>
          <CardDescription>
            Enter your new password
          </CardDescription>
        </CardHeader>
        
        {error && (
          <div className="px-6 mb-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                disabled={!hasRecoveryParam}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={!hasRecoveryParam}
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-gtalk-primary hover:bg-gtalk-primary/90"
              disabled={isLoading || !hasRecoveryParam}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
