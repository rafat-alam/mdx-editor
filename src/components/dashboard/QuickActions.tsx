import { Button } from '@/components/ui2/button';
import { FileText, BookOpen, Globe, Layers, ArrowRight } from 'lucide-react';

interface QuickActionsProps {
  onMDXEditorClick: () => void;
  onSeeProfilesClick: () => void;
}

export function QuickActions({ onMDXEditorClick, onSeeProfilesClick }: QuickActionsProps) {
  return (
    <>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Button
          asChild 
          variant="outline" 
          className="h-auto py-4 sm:py-6 justify-start"
          onClick={onMDXEditorClick}
        >
          <div className="flex flex-col items-start">
            <div className="flex items-center w-full">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="font-medium text-sm sm:text-base">MDX Editor</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">AI-powered MDX Editing</span>
          </div>
        </Button>

        <Button 
          asChild 
          variant="outline" 
          className="h-auto py-4 sm:py-6 justify-start"
          onClick={onSeeProfilesClick}
        >
          <div className="flex flex-col items-start">
            <div className="flex items-center w-full">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="font-medium text-sm sm:text-base">See Profiles...</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">Search by username.</span>
          </div>
        </Button>

        <Button 
          asChild 
          variant="outline" 
          className="h-auto py-4 sm:py-6 justify-start"
        >
          <a href="/public-repos" className="flex flex-col items-start">
            <div className="flex items-center w-full">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="font-medium text-sm sm:text-base">Public Repos...</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">See Public Repositories</span>
          </a>
        </Button>

        <Button 
          asChild 
          variant="outline" 
          className="h-auto py-4 sm:py-6 justify-start"
        >
          <a href="/settings" className="flex flex-col items-start">
            <div className="flex items-center w-full">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="font-medium text-sm sm:text-base">Profile Settings</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your account</span>
          </a>
        </Button>
      </div>
    </>
  );
}
