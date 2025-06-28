
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        // Sign in logic - clean routing without hardcoded roles
        onClose();
        
        // This will be replaced with actual backend role determination
        const adminEmails = ['abathwabiz@gmail.com', 'admin@abathwa.com'];
        const isAdmin = adminEmails.includes(formData.email.toLowerCase());
        
        if (isAdmin) {
          navigate('/admin-dashboard');
        } else {
          // Default routing - backend will determine actual role
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
        <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-0 shadow-2xl">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Account Created!</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t.signUp.success}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
            {type === 'signIn' ? t.signIn.title : t.signUp.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            {type === 'signIn' ? t.signIn.description : t.signUp.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'signUp' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium">{t.signUp.name}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl h-12 bg-white/50 dark:bg-gray-800/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-200 font-medium">{t.signUp.phone}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+263 78 123 4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl h-12 bg-white/50 dark:bg-gray-800/50"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium">{type === 'signIn' ? t.signIn.email : t.signUp.email}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl h-12 bg-white/50 dark:bg-gray-800/50"
                required
              />
            </div>
            {isAdminUser && type === 'signUp' && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                Admin User Detected
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-medium">{type === 'signIn' ? t.signIn.password : t.signUp.password}</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl h-12 bg-white/50 dark:bg-gray-800/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {type === 'signUp' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-200 font-medium">{t.signUp.confirmPassword}</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl h-12 bg-white/50 dark:bg-gray-800/50"
                    required
                  />
                </div>
              </div>

              {isAdminUser ? (
                <div className="space-y-2">
                  <Label htmlFor="adminKey" className="text-gray-700 dark:text-gray-200 font-medium">{t.signUp.adminKey}</Label>
                  <Input
                    id="adminKey"
                    type="text"
                    placeholder="'vvv.ndev'"
                    value={formData.adminKey}
                    onChange={(e) => handleInputChange('adminKey', e.target.value)}
                    className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl h-12 bg-white/50 dark:bg-gray-800/50"
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t.signUp.adminKeyHint}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-200 font-medium">{t.signUp.role}</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => handleInputChange('role', value)}
                    required
                  >
                    <SelectTrigger className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl h-12 bg-white/50 dark:bg-gray-800/50">
                      <SelectValue placeholder="Choose your role..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
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
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 hover:from-blue-700 hover:via-purple-700 hover:to-orange-600 text-white font-semibold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : (type === 'signIn' ? t.signIn.button : t.signUp.button)}
          </Button>

          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            {type === 'signIn' ? t.signIn.switchText : t.signUp.switchText}{' '}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-purple-600 font-medium hover:underline transition-colors"
            >
              {type === 'signIn' ? t.signIn.switchLink : t.signUp.switchLink}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
