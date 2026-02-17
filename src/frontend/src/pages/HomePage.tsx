import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, DollarSign, Award, CheckCircle, Shield, Target, TrendingUp, Medal, Calendar } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import { useGetRegistrationCount, useGetTeams } from '../hooks/useQueries';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: registrationCount } = useGetRegistrationCount();
  const { data: teams } = useGetTeams();

  // Set registration deadline (example: 30 days from now)
  const registrationDeadline = new Date();
  registrationDeadline.setDate(registrationDeadline.getDate() + 30);

  const highlights = [
    {
      icon: Trophy,
      title: 'State-Level League',
      description: 'Bihar\'s premier cricket tournament with professional standards',
      stat: '6 Teams',
      onClick: () => navigate({ to: '/teams' }),
    },
    {
      icon: Users,
      title: 'Player Auction',
      description: '6 teams bidding for talent with ₹1L purse each',
      stat: '₹6L Total',
      onClick: () => navigate({ to: '/auction-teams' }),
    },
    {
      icon: DollarSign,
      title: 'Big Prizes',
      description: '₹7+ Lakhs total prize pool with bike for Man of Series',
      stat: '₹7L+ Prizes',
      onClick: () => navigate({ to: '/prizes' }),
    },
    {
      icon: Award,
      title: 'Professional Standards',
      description: 'Complete tournament structure from trials to grand final',
      stat: '5 Stages',
      onClick: () => navigate({ to: '/how-it-works' }),
    },
  ];

  // Team logos mapping
  const teamLogos = [
    { name: 'Magadh United', logo: '/assets/generated/magadh-united-logo-transparent.dim_200x200.png' },
    { name: 'Mithila Pride', logo: '/assets/generated/mithila-pride-logo-transparent.dim_200x200.png' },
    { name: 'Seemanchal Riser', logo: '/assets/generated/seemanchal-riser-logo-transparent.dim_200x200.png' },
    { name: 'Bhojpur Fighters', logo: '/assets/generated/bhojpur-fighters-logo-transparent.dim_200x200.png' },
    { name: 'Patliputra Leaders', logo: '/assets/generated/patliputra-leaders-logo-transparent.dim_200x200.png' },
    { name: 'Tirhut Challengers', logo: '/assets/generated/tirhut-challengers-logo-transparent.dim_200x200.png' },
  ];

  const handleRegisterClick = () => {
    navigate({ to: '/player-registration' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Clean and Professional */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Simple Background Treatment */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/assets/generated/hero-background-minimalist.dim_1200x600.jpg')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/80" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Clean Typography Hierarchy */}
            <div className="space-y-6">
              <h1 className="text-display font-display">
                Bihar Cricket महोत्सव
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-200 max-w-3xl mx-auto leading-tight">
                Bihar's Biggest Cricket Movement
              </p>
              
              <div className="space-y-2 text-lg md:text-xl lg:text-2xl text-amber-400 font-semibold font-devanagari">
                <p>गाँव से ग्राउंड तक</p>
                <p>बिहार को मिलेगी असली पहचान</p>
              </div>
            </div>
            
            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg px-10 py-6 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl motion-safe:hover:scale-105"
                onClick={handleRegisterClick}
              >
                <Target className="h-5 w-5 mr-2" />
                Register as Player
              </Button>
            </div>

            {registrationCount !== undefined && (
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full text-white font-medium">
                <CheckCircle className="h-5 w-5 text-amber-400" />
                <span>{Number(registrationCount)} Players Already Registered</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Registration Countdown */}
      <section className="py-12 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full text-amber-600 dark:text-amber-400 font-semibold text-sm">
                <Calendar className="h-4 w-4" />
                <span>Limited Time</span>
              </div>
              <h2 className="font-bold">
                Registration Closes In
              </h2>
            </div>
            <CountdownTimer targetDate={registrationDeadline} />
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-5 py-2 rounded-full text-amber-400 font-semibold text-sm">
              <Shield className="h-4 w-4" />
              <span>Official Teams</span>
            </div>
            <h2 className="font-bold">
              6 Official Teams Competing
            </h2>
            <p className="text-body-lg text-slate-300 max-w-2xl mx-auto">
              Each team with ₹1,00,000 purse ready to bid for the best talent
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto mb-12">
            {teamLogos.map((team, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center motion-safe:hover:scale-105 transition-all duration-300 border border-white/20 hover:bg-white/15"
              >
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-20 h-20 object-contain mb-3"
                  loading="lazy"
                />
                <p className="text-sm font-semibold text-center text-slate-200">{team.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-slate-900 text-base px-8 py-6 font-semibold transition-all duration-300"
              onClick={() => navigate({ to: '/teams' })}
            >
              View All Teams & Details
              <Trophy className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Tournament Features */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-5 py-2 rounded-full text-amber-600 dark:text-amber-400 font-semibold text-sm">
              <Award className="h-4 w-4" />
              <span>Tournament Features</span>
            </div>
            <h2 className="font-bold">
              Why Join Bihar Cricket Mahotsav?
            </h2>
            <p className="text-body-lg text-muted max-w-2xl mx-auto">
              A complete professional cricket experience with state-level recognition
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {highlights.map((highlight, index) => (
              <Card 
                key={index} 
                className="group motion-safe:hover:shadow-xl transition-all duration-300 motion-safe:hover:-translate-y-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
                onClick={highlight.onClick}
              >
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-xl motion-safe:group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <highlight.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                        <TrendingUp className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{highlight.stat}</span>
                      </div>
                      <h3 className="font-bold text-lg">{highlight.title}</h3>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{highlight.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Impact Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="text-center space-y-2 p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">₹7L+</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Prize Pool</div>
            </div>
            <div className="text-center space-y-2 p-5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">6</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Professional Teams</div>
            </div>
            <div className="text-center space-y-2 p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
              <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">₹6L</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Auction Purse</div>
            </div>
            <div className="text-center space-y-2 p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
                <Medal className="h-8 w-8 mx-auto" />
              </div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">State Recognition</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-bold">
              Ready to Showcase Your Talent?
            </h2>
            <p className="text-body-lg text-blue-100 max-w-2xl mx-auto">
              Join Bihar's biggest cricket movement. Register now and get a chance to play in the state-level league with professional standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-6 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl motion-safe:hover:scale-105"
                onClick={handleRegisterClick}
              >
                Register Now
                <Target className="h-5 w-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 text-lg px-10 py-6 font-semibold transition-all duration-300"
                onClick={() => navigate({ to: '/how-it-works' })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
