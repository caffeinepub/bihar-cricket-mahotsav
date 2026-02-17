import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetPlayerRegistration, useSubmitPlayerRegistration, useGetCallerUserProfile } from '../hooks/useQueries';
import { CricketExperience, Team, PlayerCategory, JerseySize } from '../backend';
import { CheckCircle, AlertCircle, Trophy, User, Mail, Phone, CreditCard, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PlayerRegistrationPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: existingRegistration, isLoading: registrationLoading, isFetched } = useGetPlayerRegistration();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const submitRegistration = useSubmitPlayerRegistration();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contact: '',
    email: '',
    aadhaarNumber: '',
    experience: '' as CricketExperience | '',
    teamChoice: '' as Team | '',
    category: '' as PlayerCategory | '',
    jerseySize: '' as JerseySize | '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill name and email from user profile if available
  useEffect(() => {
    if (userProfile && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.name || '',
        email: userProfile.email || '',
        contact: userProfile.phone || '',
      }));
    }
  }, [userProfile]);

  const showRegistrationForm = !registrationLoading && isFetched && !existingRegistration;

  const teamLabels: Record<Team, string> = {
    [Team.magadhUnited]: 'Magadh United',
    [Team.mithilaPride]: 'Mithila Pride',
    [Team.seemanchalRiser]: 'Seemanchal Riser',
    [Team.bhojpurFighters]: 'Bhojpur Fighters',
    [Team.patliputraLeaders]: 'Patliputra Leaders',
    [Team.tirhutChallengers]: 'Tirhut Challengers',
  };

  const categoryLabels: Record<PlayerCategory, string> = {
    [PlayerCategory.batsman]: 'Batsman',
    [PlayerCategory.bowler]: 'Bowler',
    [PlayerCategory.allRounder]: 'All-Rounder',
    [PlayerCategory.wicketkeeper]: 'Wicketkeeper',
  };

  const experienceLabels: Record<CricketExperience, string> = {
    [CricketExperience.academy]: 'Academy Level',
    [CricketExperience.district]: 'District Level',
    [CricketExperience.state]: 'State Level',
  };

  const jerseySizeLabels: Record<JerseySize, string> = {
    [JerseySize.s36]: '36 - S',
    [JerseySize.m38]: '38 - M',
    [JerseySize.l40]: '40 - L',
    [JerseySize.xl42]: '42 - XL',
    [JerseySize.xxl44]: '44 - XXL',
    [JerseySize.xxxl46]: '46 - XXXL',
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || parseInt(formData.age) < 15 || parseInt(formData.age) > 50) {
      newErrors.age = 'Age must be between 15 and 50';
    }
    if (!formData.contact.trim() || !/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Valid 10-digit contact number is required';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.aadhaarNumber.trim() || !/^\d{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Valid 12-digit Aadhaar number is required';
    }
    if (!formData.experience) newErrors.experience = 'Experience level is required';
    if (!formData.teamChoice) newErrors.teamChoice = 'Team preference is required';
    if (!formData.category) newErrors.category = 'Player category is required';
    if (!formData.jerseySize) newErrors.jerseySize = 'Jersey size is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const anonymous = !isAuthenticated;
      const userId = anonymous ? `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : null;

      await submitRegistration.mutateAsync({
        name: formData.name,
        age: BigInt(formData.age),
        contact: formData.contact,
        email: formData.email,
        aadhaarNumber: formData.aadhaarNumber,
        experience: formData.experience as CricketExperience,
        teamChoice: formData.teamChoice as Team,
        category: formData.category as PlayerCategory,
        jerseySize: formData.jerseySize as JerseySize,
        paymentStatus: false,
        userId,
        anonymous,
      });

      // Redirect to payment page or success page
      navigate({ to: '/payment-success' });
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-body text-muted">Loading registration form...</p>
        </div>
      </div>
    );
  }

  if (existingRegistration) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 mx-auto">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">Already Registered</CardTitle>
                <CardDescription className="text-body">
                  You have already registered for Bihar Cricket Mahotsav
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg space-y-4">
                  <h4 className="text-xl font-bold">Registration Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-body-sm">
                    <div>
                      <p className="text-muted">Name</p>
                      <p className="font-semibold">{existingRegistration.name}</p>
                    </div>
                    <div>
                      <p className="text-muted">Age</p>
                      <p className="font-semibold">{Number(existingRegistration.age)}</p>
                    </div>
                    <div>
                      <p className="text-muted">Category</p>
                      <p className="font-semibold">{categoryLabels[existingRegistration.category]}</p>
                    </div>
                    <div>
                      <p className="text-muted">Team Preference</p>
                      <p className="font-semibold">{teamLabels[existingRegistration.teamChoice]}</p>
                    </div>
                    <div>
                      <p className="text-muted">Payment Status</p>
                      <p className={`font-semibold ${existingRegistration.paymentStatus ? 'text-green-600' : 'text-amber-600'}`}>
                        {existingRegistration.paymentStatus ? 'Paid' : 'Pending'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Jersey Size</p>
                      <p className="font-semibold">{jerseySizeLabels[existingRegistration.jerseySize]}</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate({ to: '/' })}
                  className="w-full"
                  size="lg"
                >
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-bold">
              Player Registration
            </h1>
            <p className="text-body-lg text-muted max-w-2xl mx-auto">
              Register for Bihar Cricket Mahotsav and get a chance to showcase your talent in the state-level league
            </p>
          </div>

          {/* Registration Form */}
          <Card className="border-2 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl">Registration Form</CardTitle>
              <CardDescription className="text-body">
                Fill in your details to register for the tournament. Registration fee: ₹1,499
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Enter your age (15-50)"
                      className={errors.age ? 'border-red-500' : ''}
                    />
                    {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number *</Label>
                    <Input
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="10-digit mobile number"
                      className={errors.contact ? 'border-red-500' : ''}
                    />
                    {errors.contact && <p className="text-sm text-red-500">{errors.contact}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhaar" className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Aadhaar Number *
                    </Label>
                    <Input
                      id="aadhaar"
                      value={formData.aadhaarNumber}
                      onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                      placeholder="12-digit Aadhaar number"
                      className={errors.aadhaarNumber ? 'border-red-500' : ''}
                    />
                    {errors.aadhaarNumber && <p className="text-sm text-red-500">{errors.aadhaarNumber}</p>}
                  </div>
                </div>

                {/* Cricket Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Cricket Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="category">Player Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as PlayerCategory })}
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level *</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => setFormData({ ...formData, experience: value as CricketExperience })}
                    >
                      <SelectTrigger className={errors.experience ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(experienceLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team">Team Preference *</Label>
                    <Select
                      value={formData.teamChoice}
                      onValueChange={(value) => setFormData({ ...formData, teamChoice: value as Team })}
                    >
                      <SelectTrigger className={errors.teamChoice ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your preferred team" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(teamLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.teamChoice && <p className="text-sm text-red-500">{errors.teamChoice}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jerseySize">Jersey Size *</Label>
                    <Select
                      value={formData.jerseySize}
                      onValueChange={(value) => setFormData({ ...formData, jerseySize: value as JerseySize })}
                    >
                      <SelectTrigger className={errors.jerseySize ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your jersey size" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(jerseySizeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.jerseySize && <p className="text-sm text-red-500">{errors.jerseySize}</p>}
                    <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <AlertDescription className="text-body-sm text-amber-800 dark:text-amber-200">
                        <strong>Important:</strong> Jersey size cannot be changed after registration. Please choose carefully.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                {errors.submit && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-body-sm">{errors.submit}</AlertDescription>
                  </Alert>
                )}

                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-bold text-blue-900 dark:text-blue-100">Registration Fee: ₹1,499</h4>
                      <p className="text-body-sm text-blue-800 dark:text-blue-200">
                        Includes tournament participation, official jersey, and all match facilities
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
