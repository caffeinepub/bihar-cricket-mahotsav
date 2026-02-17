import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Building2, TrendingUp, Users, Eye } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitSponsorInquiry } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function SponsorshipPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const submitInquiry = useSubmitSponsorInquiry();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    sponsorshipLevel: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to submit sponsorship inquiry');
      return;
    }

    if (!formData.name || !formData.company || !formData.contact || !formData.sponsorshipLevel) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await submitInquiry.mutateAsync(formData);
      toast.success('Inquiry submitted successfully! We will contact you soon.');
      setFormData({
        name: '',
        company: '',
        contact: '',
        sponsorshipLevel: '',
        message: '',
      });
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        toast.error('You have already submitted an inquiry');
      } else {
        toast.error('Failed to submit inquiry. Please try again.');
      }
      console.error(error);
    }
  };

  const sponsorshipTiers = [
    {
      title: 'Title Sponsor',
      price: 'Premium',
      benefits: [
        'Brand name in tournament title',
        'Logo on all promotional materials',
        'Prime position in all media coverage',
        'VIP passes for all matches',
        'Speaking opportunity at opening ceremony',
        'Exclusive branding rights',
      ],
      badge: 'Most Visible',
    },
    {
      title: 'Powered By Sponsor',
      price: 'High',
      benefits: [
        'Prominent logo placement',
        'Brand mention in all communications',
        'Social media promotion',
        'VIP passes for final match',
        'Branding at venue',
      ],
      badge: 'Popular',
    },
    {
      title: 'Associate Sponsor',
      price: 'Medium',
      benefits: [
        'Logo on promotional materials',
        'Social media mentions',
        'Passes for selected matches',
        'Brand visibility at venue',
      ],
      badge: null,
    },
    {
      title: 'Official Partner',
      price: 'Flexible',
      benefits: [
        'Logo placement',
        'Social media recognition',
        'Passes for matches',
        'Certificate of partnership',
      ],
      badge: null,
    },
  ];

  const benefits = [
    {
      icon: Eye,
      title: 'Brand Visibility',
      description: 'Reach thousands of cricket enthusiasts across Bihar',
    },
    {
      icon: Users,
      title: 'Target Audience',
      description: 'Connect with youth, families, and sports lovers',
    },
    {
      icon: TrendingUp,
      title: 'Media Coverage',
      description: 'Get featured in local and regional media',
    },
    {
      icon: Building2,
      title: 'CSR Opportunity',
      description: 'Support youth sports development in Bihar',
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sponsorship Opportunities</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Partner with Bihar's biggest cricket movement and showcase your brand to thousands
          </p>
        </div>

        {/* Sponsorship Image */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-16 shadow-xl">
          <img
            src="/assets/generated/sponsorship-handshake.dim_500x400.jpg"
            alt="Sponsorship Partnership"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Grow Your Brand with Us</h2>
              <p className="text-lg">Be part of Bihar's premier cricket tournament</p>
            </div>
          </div>
        </div>

        {/* Why Sponsor */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Sponsor Bihar Cricket Mahotsav?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-saffron/10 p-4 rounded-full mb-4">
                      <benefit.icon className="h-8 w-8 text-saffron" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sponsorship Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Sponsorship Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipTiers.map((tier, index) => (
              <Card key={index} className={index === 0 ? 'border-saffron shadow-lg' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{tier.title}</CardTitle>
                    {tier.badge && (
                      <Badge variant="secondary" className="bg-saffron/10 text-saffron">
                        {tier.badge}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-lg font-semibold">{tier.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-saffron flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sponsorship Inquiry</CardTitle>
              <CardDescription>Fill in your details and we'll get back to you with a customized proposal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      Your Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Enter company name"
                      required
                      disabled={!isAuthenticated}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact">
                    Contact Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contact"
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="+91 98765 43210"
                    required
                    disabled={!isAuthenticated}
                  />
                </div>

                <div>
                  <Label htmlFor="sponsorshipLevel">
                    Interested In <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.sponsorshipLevel}
                    onValueChange={(value) => setFormData({ ...formData, sponsorshipLevel: value })}
                    disabled={!isAuthenticated}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sponsorship category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title Sponsor</SelectItem>
                      <SelectItem value="powered-by">Powered By Sponsor</SelectItem>
                      <SelectItem value="associate">Associate Sponsor</SelectItem>
                      <SelectItem value="official-partner">Official Partner</SelectItem>
                      <SelectItem value="custom">Custom Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Additional Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your requirements or any specific questions"
                    rows={4}
                    disabled={!isAuthenticated}
                  />
                </div>

                {!isAuthenticated && (
                  <p className="text-sm text-muted-foreground">Please login to submit sponsorship inquiry</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-saffron hover:bg-saffron/90 text-lg py-6"
                  disabled={!isAuthenticated || submitInquiry.isPending}
                >
                  {submitInquiry.isPending ? 'Submitting...' : 'Submit Inquiry'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
