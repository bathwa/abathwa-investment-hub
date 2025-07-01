
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Building, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { UserRole } from '../shared/types';

const SignUp = () => {
  const { t } = useLanguage();
  const { signUp, user, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'investor' as UserRole,
    adminKey: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Check if email is admin email
  const isAdminEmail = formData.email === 'abathwabiz@gmail.com' || formData.email === 'admin@abathwa.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    if (isAdminEmail && formData.adminKey !== 'vvv.ndev') {
      toast.error('Invalid admin key. Please enter the correct admin key.');
      return;
    }

    setIsSubmitting(true);

    try {
      const profileData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phoneNumber.trim(),
        adminKey: isAdminEmail ? formData.adminKey : undefined,
      };

      const { error } = await signUp(formData.email, formData.password, formData.role, profileData);
      
      if (error) {
        toast.error(error.message || 'Registration failed. Please try again.');
      } else {
        toast.success('Registration successful! Please check your email to verify your account.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-amber-900/20">
      {/* Header */}
      <header className="border-b border-primary/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 african-gradient rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Abathwa Hub</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t('action.signUp')}</CardTitle>
            <CardDescription>
              {t('auth.createYourAccount')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t('auth.phoneNumber')}</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              {!isAdminEmail && (
                <div className="space-y-2">
                  <Label htmlFor="role">{t('auth.selectRole')}</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value: UserRole) => handleInputChange('role', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('auth.selectRole')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investor">{t('role.investor')}</SelectItem>
                      <SelectItem value="entrepreneur">{t('role.entrepreneur')}</SelectItem>
                      <SelectItem value="service_provider">{t('role.serviceProvider')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isAdminEmail && (
                <div className="space-y-2">
                  <Label htmlFor="adminKey">Admin Key</Label>
                  <Input
                    id="adminKey"
                    type="password"
                    placeholder="Enter admin key"
                    value={formData.adminKey}
                    onChange={(e) => handleInputChange('adminKey', e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Admin key required for administrator registration
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  t('auth.createAccount')
                )}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-primary hover:underline">
                  {t('action.signIn')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
