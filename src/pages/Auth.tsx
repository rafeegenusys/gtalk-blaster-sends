
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showResetForm, setShowResetForm] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }
    
    const { data, error } = await signUp(email, password, businessName, fullName);
    
    if (error) {
      setError(error.message);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sign up successful",
        description: "Please check your email to confirm your account.",
      });
      if (data?.user) {
        navigate('/');
      }
    }
    
    setIsLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reset email sent",
        description: "Check your email for reset instructions",
      });
      setShowResetForm(false);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex items-center mb-8">
        <MessageSquare className="h-10 w-10 text-gtalk-primary mr-2" />
        <h1 className="text-3xl font-bold text-gtalk-primary">GTalk</h1>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to GTalk</CardTitle>
          <CardDescription className="text-center">
            {showResetForm 
              ? "Enter your email to reset your password" 
              : "Sign in to your account or create a new one"}
          </CardDescription>
        </CardHeader>
        
        {error && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        
        {showResetForm ? (
          <form onSubmit={handlePasswordReset}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-gtalk-primary hover:bg-gtalk-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Send Reset Instructions"}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={() => setShowResetForm(false)}
              >
                Back to Sign In
              </Button>
            </CardFooter>
          </form>
        ) : (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="text-right">
                    <Button 
                      type="button"
                      variant="link" 
                      className="p-0 h-auto text-sm font-medium text-gtalk-primary"
                      onClick={() => setShowResetForm(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-gtalk-primary hover:bg-gtalk-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input
                      id="business-name"
                      type="text"
                      placeholder="Your Business Name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Your Name (Optional)</Label>
                    <Input
                      id="full-name"
                      type="text"
                      placeholder="Your Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-gtalk-primary hover:bg-gtalk-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </Card>
    </div>
  );
};

export default Auth;
