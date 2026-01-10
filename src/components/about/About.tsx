import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authoptions';
import teamMembersData from '@/data/team_members_data.json';

import { HeroSection } from './HeroSection';
import { StorySection } from './StorySection';
import { CoreValuesSection } from './CoreValuesSection';
import { TechnologySection } from './TechnologySection';
import { TeamSection } from './TeamSection';
import { CommunitySection } from './CommunitySection';

export async function About() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <HeroSection />
      <StorySection />
      <CoreValuesSection />
      <TechnologySection />
      <TeamSection teamMembers={teamMembersData} />
      <CommunitySection isAuthenticated={!!session} />
    </div>
  );
}
