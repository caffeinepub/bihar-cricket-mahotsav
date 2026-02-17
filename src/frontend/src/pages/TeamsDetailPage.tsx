import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, DollarSign, Users, Trophy } from 'lucide-react';
import { useGetTeams } from '../hooks/useQueries';

export default function TeamsDetailPage() {
  const { data: teams, isLoading } = useGetTeams();

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

  // Team descriptions
  const getTeamDescription = (teamName: string): string => {
    const descriptions: Record<string, string> = {
      'Magadh United': 'Representing the historic Magadh region, this team brings together the rich cricket heritage and competitive spirit of South Bihar.',
      'Mithila Pride': 'Showcasing the cultural pride of Mithila, this team combines traditional values with modern cricket excellence.',
      'Seemanchal Riser': 'Rising from the eastern region of Bihar, this team represents the emerging cricket talent and determination of Seemanchal.',
      'Bhojpur Fighters': 'Known for their fighting spirit, this team embodies the resilience and passion of the Bhojpur region.',
      'Patliputra Leaders': 'Leading from the capital region, this team represents the administrative heart of Bihar with strategic gameplay.',
      'Tirhut Challengers': 'Challenging the status quo, this team from North Bihar brings fresh energy and competitive cricket to the tournament.',
    };
    return descriptions[teamName] || 'A competitive team ready to showcase Bihar\'s cricket talent.';
  };

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-6 py-2 rounded-full text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <Shield className="h-4 w-4" />
            <span>Official Teams</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            6 Official Teams <span className="text-gradient-premium">Competing</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Meet the six official teams of Bihar Cricket Mahotsav, each representing different regions of Bihar with ₹1,00,000 purse to build their dream squad
          </p>
        </div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <p className="text-lg font-semibold">Loading teams...</p>
            </div>
          </div>
        ) : teams && teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {teams.map((team, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-center mb-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={team.logo || getTeamLogo(team.name)}
                      alt={`${team.name} logo`}
                      className="h-32 w-32 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <CardTitle className="text-center text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {team.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-4">
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed text-center">
                    {getTeamDescription(team.name)}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm font-semibold">Base Purse</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="text-base font-bold bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400"
                      >
                        ₹{Number(team.purse).toLocaleString()}
                      </Badge>
                    </div>
                    
                    {team.owner && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm font-semibold">Team Owner</span>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white">{team.owner}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto border-slate-200 dark:border-slate-800">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Trophy className="h-12 w-12 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white">Teams Coming Soon</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                Team details will be announced soon. Stay tuned for updates on all six official teams!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Additional Info Section */}
        <div className="max-w-5xl mx-auto mt-16">
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-3xl font-black text-slate-900 dark:text-white text-center">
                About the Teams
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-lg">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Equal Opportunity</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Each team starts with ₹1,00,000 purse</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Regional Pride</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Teams represent different regions of Bihar</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-lg">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Competitive Spirit</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Professional league format with playoffs</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">State-Level Recognition</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Official Bihar Cricket Mahotsav teams</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                  Each team will compete in a professional league format, with the top teams advancing to playoffs. 
                  The winning team takes home ₹5,00,000 in prize money, while the runner-up receives ₹2,00,000.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
