import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Bike, Award } from 'lucide-react';

export default function PrizesPage() {
  const prizes = [
    {
      icon: Trophy,
      title: 'Winner',
      amount: '₹5,00,000',
      description: 'Championship trophy and cash prize',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Medal,
      title: 'Runner-up',
      amount: '₹2,00,000',
      description: 'Runner-up trophy and cash prize',
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10',
    },
    {
      icon: Bike,
      title: 'Man of the Series',
      amount: 'Bike + ₹10,000',
      description: 'Brand new bike and cash prize',
      color: 'text-saffron',
      bgColor: 'bg-saffron/10',
    },
    {
      icon: Award,
      title: 'All Participants',
      amount: 'Certificate',
      description: 'Certificate of participation',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Prizes & Recognition</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compete for prizes worth over ₹7 lakhs and get the recognition you deserve
          </p>
        </div>

        {/* Total Prize Pool */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="bg-gradient-to-r from-saffron/20 to-primary/20 border-saffron">
            <CardContent className="pt-6 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">Total Prize Pool</p>
              <p className="text-5xl font-bold text-primary mb-2">₹7,10,000+</p>
              <p className="text-muted-foreground">Plus bike and certificates for all participants</p>
            </CardContent>
          </Card>
        </div>

        {/* Prize Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {prizes.map((prize, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`${prize.bgColor} p-4 rounded-full w-fit mx-auto mb-4`}>
                  <prize.icon className={`h-12 w-12 ${prize.color}`} />
                </div>
                <CardTitle className="text-center text-xl">{prize.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-primary mb-2">{prize.amount}</p>
                <p className="text-sm text-muted-foreground">{prize.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Prize Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            <img
              src="/assets/generated/cricket-trophy.dim_300x400.jpg"
              alt="Championship Trophy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end">
              <p className="text-white font-bold text-xl p-4">Championship Trophy</p>
            </div>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            <img
              src="/assets/generated/prize-bike.dim_400x300.jpg"
              alt="Man of Series Prize"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end">
              <p className="text-white font-bold text-xl p-4">Man of Series - Bike</p>
            </div>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            <img
              src="/assets/generated/team-celebration.dim_600x400.jpg"
              alt="Victory Celebration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end">
              <p className="text-white font-bold text-xl p-4">Victory Celebration</p>
            </div>
          </div>
        </div>

        {/* Additional Recognition */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Additional Recognition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-5 w-5 text-saffron" />
                    Best Batsman
                  </h4>
                  <p className="text-muted-foreground text-sm">Special award for the highest run scorer</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-5 w-5 text-saffron" />
                    Best Bowler
                  </h4>
                  <p className="text-muted-foreground text-sm">Special award for the highest wicket taker</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-5 w-5 text-saffron" />
                    Best Fielder
                  </h4>
                  <p className="text-muted-foreground text-sm">Recognition for outstanding fielding performance</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-5 w-5 text-saffron" />
                    Emerging Player
                  </h4>
                  <p className="text-muted-foreground text-sm">Award for the most promising young talent</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">What You Get</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Trophy className="h-5 w-5 text-saffron flex-shrink-0 mt-0.5" />
                    <span>Physical trophies and medals for winners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trophy className="h-5 w-5 text-saffron flex-shrink-0 mt-0.5" />
                    <span>Certificates of participation for all players</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trophy className="h-5 w-5 text-saffron flex-shrink-0 mt-0.5" />
                    <span>Media coverage and recognition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trophy className="h-5 w-5 text-saffron flex-shrink-0 mt-0.5" />
                    <span>Opportunity to showcase talent to scouts and coaches</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
