interface RepoHeaderProps {
  ownerUsername: string;
  nodeName: string;
}

export function RepoHeader({ ownerUsername, nodeName }: RepoHeaderProps) {
  return (
    <h3 className="font-medium text-sm sm:text-base truncate">
      {`${ownerUsername}/${nodeName}`}
    </h3>
  );
}
