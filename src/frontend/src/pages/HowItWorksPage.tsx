import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: 'Player Registration',
      description: 'Register online by paying a non-refundable fee of ₹1,499',
      details: [
        'Fill the registration form with your cricket experience',
        'Pay the registration fee securely online',
        'Receive confirmation and trial details via email/SMS',
        'Registration fee is non-refundable',
      ],
      image: '/assets/generated/cricket-player-action.dim_400x400.jpg',
    },
    {
      number: 2,
      title: 'Open Trials',
      description: 'Showcase your skills in front of selectors and team owners',
      details: [
        'Attend trials at designated venues across Bihar',
        'Demonstrate your batting, bowling, and fielding skills',
        'Get evaluated by professional cricket coaches',
        'Trial dates and venues will be communicated after registration',
      ],
      image: '/assets/generated/cricket-ground-aerial.dim_800x500.jpg',
    },
    {
      number: 3,
      title: 'Player Auction',
      description: '6 teams bid for players with ₹1,00,000 purse each',
      details: [
        'Selected players enter the auction pool',
        'Each team has ₹1,00,000 to build their squad',
        'Minimum bid: ₹1,000 | Maximum bid: ₹40,000 per player',
        'Unsold players get free trial for next season',
      ],
      image: '/assets/generated/auction-scene.dim_600x400.jpg',
    },
    {
      number: 4,
      title: 'League Matches',
      description: 'Teams compete in round-robin format followed by playoffs',
      details: [
        'All 6 teams play against each other',
        'Top 4 teams qualify for playoffs',
        'Professional umpiring and match management',
        'Live scoring and match updates',
      ],
      image: '/assets/generated/team-celebration.dim_600x400.jpg',
    },
    {
      number: 5,
      title: 'Grand Final',
      description: 'Championship match with massive prizes and recognition',
      details: [
        'Winner: ₹5,00,000 cash prize',
        'Runner-up: ₹2,00,000 cash prize',
        'Man of the Series: Bike + ₹10,000',
        'Trophy and certificates for all participants',
      ],
      image: '/assets/generated/cricket-trophy.dim_300x400.jpg',
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How It Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your journey from registration to becoming a champion - explained step by step
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-saffron text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">{step.title}</CardTitle>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-saffron flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Important Note */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-saffron/10 border-saffron">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-3">Important Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-saffron flex-shrink-0 mt-0.5" />
                  <span>Registration fee of ₹1,499 is non-refundable under any circumstances</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-saffron flex-shrink-0 mt-0.5" />
                  <span>Players unsold in auction get free trial for the next season</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-saffron flex-shrink-0 mt-0.5" />
                  <span>All participants receive certificates of participation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-saffron flex-shrink-0 mt-0.5" />
                  <span>Tournament follows professional cricket rules and regulations</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
