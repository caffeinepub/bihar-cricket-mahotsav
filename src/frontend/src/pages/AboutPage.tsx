import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Trophy, CheckCircle, Shield } from 'lucide-react';

export default function AboutPage() {
  const visionPoints = [
    'Create a platform for aspiring cricketers across Bihar',
    'Provide professional-level cricket experience',
    'Discover and nurture hidden talent from rural areas',
    'Build a sustainable cricket ecosystem in Bihar',
  ];

  const missionPoints = [
    'Organize state-level cricket tournaments with professional standards',
    'Implement transparent player auction system',
    'Provide equal opportunities to players from all districts',
    'Create pathways for talented players to higher levels',
  ];

  const tournamentFeatures = [
    {
      icon: Users,
      title: 'Player Registration',
      description: 'Open registration for all aspiring cricketers aged 15-50 from Bihar',
    },
    {
      icon: Target,
      title: 'Trials & Selection',
      description: 'District-level trials to shortlist talented players for the auction',
    },
    {
      icon: Trophy,
      title: 'Player Auction',
      description: '6 teams with ₹1L purse each bidding for the best talent',
    },
    {
      icon: Shield,
      title: 'League Matches',
      description: 'Round-robin format followed by playoffs and grand final',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/generated/cricket-gradient-background.dim_1200x600.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-bold">
              About Bihar Cricket Mahotsav
            </h1>
            <p className="text-body-lg text-blue-100 max-w-3xl mx-auto">
              A revolutionary initiative by Yuva Khel Abhiyaan to transform Bihar's cricket landscape and provide a platform for aspiring cricketers across the state.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="border-2 border-blue-200 dark:border-blue-900 shadow-lg">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 mx-auto">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl md:text-4xl font-bold">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body-lg text-muted text-center mb-8 max-w-3xl mx-auto">
                  To establish Bihar as a prominent cricket hub in India by nurturing grassroots talent and providing world-class opportunities to aspiring cricketers from every corner of the state.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visionPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-body text-slate-700 dark:text-slate-300">{point}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="border-2 border-amber-200 dark:border-amber-900 shadow-lg">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4 mx-auto">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl md:text-4xl font-bold">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body-lg text-muted text-center mb-8 max-w-3xl mx-auto">
                  To create a transparent, merit-based platform that identifies, nurtures, and showcases cricket talent from Bihar through professional tournaments and systematic player development.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {missionPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-body text-slate-700 dark:text-slate-300">{point}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tournament Structure */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="font-bold">
                Tournament Structure
              </h2>
              <p className="text-body-lg text-muted max-w-3xl mx-auto">
                A comprehensive five-stage tournament designed to ensure fair play, transparency, and maximum opportunities for talented players.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tournamentFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-8 pb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-body-sm text-muted leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Credibility */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="font-bold">
                Trust & Credibility
              </h2>
              <p className="text-body-lg text-muted max-w-3xl mx-auto">
                Building Bihar's cricket future on the foundation of transparency, professionalism, and integrity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-2xl mx-auto">
              <Card className="border-2 border-green-200 dark:border-green-900">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-3 mx-auto">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Transparent Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-body text-muted text-center">
                    Every stage of the tournament follows transparent procedures with clear rules, fair selection criteria, and open communication with all participants.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Yuva Khel Abhiyaan */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 dark:border-blue-900 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl font-bold">About Yuva Khel Abhiyaan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-body-lg text-muted leading-relaxed">
                  Yuva Khel Abhiyaan is a youth-driven sports initiative dedicated to promoting cricket and other sports across Bihar. Our mission is to identify, nurture, and showcase sporting talent from every district of Bihar.
                </p>
                <p className="text-body-lg text-muted leading-relaxed">
                  Through Bihar Cricket Mahotsav, we aim to create a sustainable ecosystem that provides aspiring cricketers with professional-level opportunities, transparent selection processes, and a clear pathway to higher levels of competition.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h4 className="text-xl font-bold mb-3 text-center">Our Commitment</h4>
                  <p className="text-body text-muted text-center">
                    We are committed to maintaining the highest standards of professionalism, transparency, and fairness in all our tournaments and activities. Every player deserves a fair chance to showcase their talent.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
