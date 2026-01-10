import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authoptions';

import { HomeHeroSection } from './HomeHeroSection';
import { HomeFeaturesSection } from './HomeFeaturesSection';
import { HomeHowItWorksSection } from './HomeHowItWorksSection';
import { HomeGuideSection } from './HomeGuideSection';
import { HomeCTASection } from './HomeCTASection';
import { HomeFooter } from './HomeFooter';

export async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <HomeHeroSection session={session} />
      <HomeFeaturesSection />
      <HomeHowItWorksSection />
      <HomeGuideSection />
      <HomeCTASection session={session} />
      <HomeFooter />
    </div>
  );
}
