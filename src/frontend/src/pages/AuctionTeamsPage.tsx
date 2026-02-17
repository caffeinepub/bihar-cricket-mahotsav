import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import { useGetTeams } from '../hooks/useQueries';

export default function AuctionTeamsPage() {
  const { data: teams, isLoading } = useGetTeams();

  const auctionRules = [
    {
      icon: DollarSign,
      title: 'Team Purse',
      description: 'Each team has ₹1,00,000 to build their squad',
    },
    {
      icon: TrendingUp,
      title: 'Bidding Range',
      description: 'Minimum bid: ₹1,000 | Maximum bid: ₹40,000 per player',
    },
    {
      icon: Users,
      title: 'Squad Size',
      description: 'Teams can have 15-20 players in their squad',
    },
    {
      icon: Award,
      title: 'Auction Format',
      description: 'Open bidding with team owners competing for players',
    },
  ];

  // Map team names to their logo paths
  const getTeamLogo = (teamName: string): string => {
    const logoMap: Record<string, string> = {
      'Magadh United': '/assets/generated/magadh-united-logo-transparent.dim_200x200.png',
      'Mithila Pride': '/assets/generated/mithila-pride-logo-transparent.dim_200x200.png',
      'Seemanchal Riser': '/assets/generated/seemanchal-riser-logo-transparent.dim_200x200.png',
      'Bhojpur Fighters': '/assets/generated/bhojpur-fighters-logo-transparent.dim_200x200.png',
      'Patliputra Leaders': '/assets/generated/patliputra-leaders-logo-transparent.dim_200x200.png',
      'Tirhut Challengers': '/assets/generated/tirhut-challengers-logo-transparent.dim_200x200.png',
    };
    return logoMap[teamName] || '/assets/generated/team-celebration.dim_600x400.jpg';
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Player Auction & Teams</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the thrill of professional cricket auction where teams compete to build their dream squad
          </p>
        </div>

        {/* Auction Image */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-16 shadow-xl">
          <img
            src="/assets/generated/auction-scene.dim_600x400.jpg"
            alt="Player Auction"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">The Auction Experience</h2>
              <p className="text-lg">Watch as team owners bid for the best talent in Bihar</p>
            </div>
          </div>
        </div>

        {/* Auction Rules */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Auction Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {auctionRules.map((rule, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-saffron/10 p-4 rounded-full mb-4">
                      <rule.icon className="h-8 w-8 text-saffron" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{rule.title}</h3>
                    <p className="text-muted-foreground text-sm">{rule.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Teams Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Participating Teams</h2>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading teams...</p>
            </div>
          ) : teams && teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-center mb-4">
                      <img
                        src={team.logo || getTeamLogo(team.name)}
                        alt={`${team.name} logo`}
                        className="h-32 w-32 object-contain"
                      />
                    </div>
                    <CardTitle className="text-center text-xl">{team.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Base Purse</span>
                        <Badge variant="secondary" className="text-base font-semibold">
                          ₹{Number(team.purse).toLocaleString()}
                        </Badge>
                      </div>
                      {team.owner && (
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground">Team Owner</p>
                          <p className="font-medium">{team.owner}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6 text-center">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Teams Coming Soon</h3>
                <p className="text-muted-foreground">
                  Team owners and their squads will be announced after the player auction. Stay tuned for updates!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* How Auction Works */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">How the Auction Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Player Pool Creation</h4>
                <p className="text-muted-foreground">
                  All players who clear the trials enter the auction pool. Players are categorized based on their
                  skills and experience.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Bidding Process</h4>
                <p className="text-muted-foreground">
                  Team owners bid for players in an open auction format. Bidding starts at the base price and teams
                  compete to acquire their preferred players.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Squad Formation</h4>
                <p className="text-muted-foreground">
                  Teams must stay within their ₹1,00,000 budget while building a balanced squad of 15-20 players.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4. Unsold Players</h4>
                <p className="text-muted-foreground">
                  Players who remain unsold will receive a free trial for the next season, giving them another
                  opportunity to showcase their talent.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
