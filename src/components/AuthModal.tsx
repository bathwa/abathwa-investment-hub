import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, User, Mail, Phone, Key, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  type: 'signIn' | 'signUp';
  onClose: () => void;
  language: 'en' | 'nd';
}

const translations = {
  en: {
    signIn: {
      title: "Welcome Back",
      description: "Sign in to your account to continue",
      email: "Email Address",
      password: "Password",
      button: "Sign In",
      switchText: "Don't have an account?",
      switchLink: "Sign up here"
    },
    signUp: {
      title: "Join Abathwa Investment Hub",
      description: "Create your account to get started",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password",
      role: "Select Your Role",
      adminKey: "Admin User Key",
      adminKeyHint: "Enter the admin key in quotes: 'vvv.ndev'",
      button: "Create Account",
      switchText: "Already have an account?",
      switchLink: "Sign in here",
      success: "Account created successfully! Please check your email for verification.",
      roles: {
        investor: "Investor",
        entrepreneur: "Entrepreneur",
        serviceProvider: "Service Provider"
      }
    }
  },
  nd: {
    signIn: {
      title: "Siyakwamukela Futhi",
      description: "Ngena kwi-akhawunti yakho ukuze uqhubeke",
      email: "Ikheli le-imeyili",
      password: "Iphaswedi",
      button: "Ngena",
      switchText: "Awunayo i-akhawunti?",
      switchLink: "Bhalisa lapha"
    },
    signUp: {
      title: "Joyina i-Abathwa Investment Hub",
      description: "Dala i-akhawunti yakho ukuze uqalise",
      name: "Igama Eliphelele",
      email: "Ikheli le-imeyili",
      phone: "Inombolo Yocingo",
      password: "Iphaswedi",
      confirmPassword: "Qinisekisa Iphaswedi",
      role: "Khetha Indima Yakho",
      adminKey: "Isihlanguli Somlawuli",
      adminKeyHint: "Faka isihlanguli somlawuli ngaphakathi kwezikomba: 'vvv.ndev'",
      button: "Dala i-Akhawunti",
      switchText: "Usunayo i-akhawunti?",
      switchLink: "Ngena lapha",
      success: "I-akhawunti idalwe ngempumelelo! Sicela ujongise i-imeyili yakho ukuze uqinisekise.",
      roles: {
        investor: "Umtyali-mali",
        entrepreneur: "Usomashishini",
        serviceProvider: "Umnikezeli Wenkonzo"
      }
    }
  }
};

export const AuthModal: React.FC<AuthModalProps> = ({ type, onClose, language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    adminKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  
  const navigate = useNavigate();
  const t = translations[language];

  // Auto-detect admin user
  useEffect(() => {
    const adminEmails = ['abathwabiz@gmail.com', 'admin@abathwa.com'];
    const isAdmin = adminEmails.includes(formData.email.toLowerCase());
    setIsAdminUser(isAdmin);
    if (isAdmin) {
      setFormData(prev => ({ ...prev, role: 'admin' }));
    }
  }, [formData.email]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (type === 'signUp') {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        // Sign in logic - route to appropriate dashboard
        onClose();
        
        // Route based on user role (this would normally come from backend)
        const userRole = formData.email === 'abathwabiz@gmail.com' || formData.email === 'admin@abathwa.com' 
          ? 'admin' 
          : 'investor'; // Default for demo
          
        if (userRole === 'admin') {
          navigate('/admin-dashboard');
        } else if (userRole === 'entrepreneur') {
          navigate('/entrepreneur-dashboard');
        } else if (userRole === 'investor') {
          navigate('/investor-dashboard');
        } else if (userRole === 'serviceProvider') {
          navigate('/service-provider-dashboard');
        } else {
          navigate('/investor-dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Account Created!</h3>
            <p className="text-muted-foreground">
              {t.signUp.success}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {type === 'signIn' ? t.signIn.title : t.signUp.title}
          </DialogTitle>
          <DialogDescription>
            {type === 'signIn' ? t.signIn.description : t.signUp.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'signUp' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">{t.signUp.name}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10 border-2"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t.signUp.phone}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+263 78 123 4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10 border-2"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{type === 'signIn' ? t.signIn.email : t.signUp.email}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10 border-2"
                required
              />
            </div>
            {isAdminUser && type === 'signUp' && (
              <Badge className="bg-primary/10 text-primary">
                Admin User Detected
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{type === 'signIn' ? t.signIn.password : t.signUp.password}</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10 border-2"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {type === 'signUp' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.signUp.confirmPassword}</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 border-2"
                    required
                  />
                </div>
              </div>

              {isAdminUser ? (
                <div className="space-y-2">
                  <Label htmlFor="adminKey">{t.signUp.adminKey}</Label>
                  <Input
                    id="adminKey"
                    type="text"
                    placeholder="'vvv.ndev'"
                    value={formData.adminKey}
                    onChange={(e) => handleInputChange('adminKey', e.target.value)}
                    className="border-2"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {t.signUp.adminKeyHint}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>{t.signUp.role}</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => handleInputChange('role', value)}
                    required
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue placeholder="Choose your role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investor">{t.signUp.roles.investor}</SelectItem>
                      <SelectItem value="entrepreneur">{t.signUp.roles.entrepreneur}</SelectItem>
                      <SelectItem value="serviceProvider">{t.signUp.roles.serviceProvider}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <Button 
            type="submit" 
            className="w-full btn-primary text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : (type === 'signIn' ? t.signIn.button : t.signUp.button)}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {type === 'signIn' ? t.signIn.switchText : t.signUp.switchText}{' '}
            <button
              type="button"
              onClick={() => window.location.reload()} // Simple way to switch modes
              className="text-primary hover:underline font-medium"
            >
              {type === 'signIn' ? t.signIn.switchLink : t.signUp.switchLink}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
