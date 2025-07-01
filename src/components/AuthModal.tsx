
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { UserRole } from '../shared/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('investor');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [adminKey, setAdminKey] = useState('');

  // Check if email is admin email
  const isAdminEmail = registerEmail === 'abathwabiz@gmail.com' || registerEmail === 'admin@abathwa.com';

  // Reset form when switching tabs
  useEffect(() => {
    if (activeTab === 'register') {
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterRole('investor');
      setFirstName('');
      setLastName('');
      setPhone('');
      setAdminKey('');
    } else {
      setLoginEmail('');
      setLoginPassword('');
    }
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(loginEmail, loginPassword);
      
      if (error) {
        toast.error(error.message || "Please check your credentials and try again.");
      } else {
        toast.success("Welcome back!");
        onClose();
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!firstName.trim() || !lastName.trim()) {
        toast.error("First name and last name are required.");
        setIsLoading(false);
        return;
      }

      // Validate admin key if admin email
      if (isAdminEmail && adminKey !== 'vvv.ndev') {
        toast.error("Invalid admin key. Please enter the correct admin key.");
        setIsLoading(false);
        return;
      }

      const profileData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        adminKey: isAdminEmail ? adminKey : undefined,
      };

      const { error } = await signUp(registerEmail, registerPassword, registerRole, profileData);
      
      if (error) {
        toast.error(error.message || "Please check your information and try again.");
      } else {
        toast.success("Registration successful! Please check your email to verify your account.");
        setActiveTab('login');
        // Clear form
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterRole('investor');
        setFirstName('');
        setLastName('');
        setPhone('');
        setAdminKey('');
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Abathwa Capital</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Role selection - hidden for admin emails */}
                {!isAdminEmail && (
                  <div className="space-y-2">
                    <Label htmlFor="register-role">Role</Label>
                    <Select value={registerRole} onValueChange={(value: UserRole) => setRegisterRole(value)} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investor">Investor</SelectItem>
                        <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                        <SelectItem value="service_provider">Service Provider</SelectItem>
                        <SelectItem value="observer">Observer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Admin key input - only for admin emails */}
                {isAdminEmail && (
                  <div className="space-y-2">
                    <Label htmlFor="admin-key">Admin Key</Label>
                    <Input
                      id="admin-key"
                      type="password"
                      placeholder="Enter admin key"
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Admin key required for administrator registration
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;
