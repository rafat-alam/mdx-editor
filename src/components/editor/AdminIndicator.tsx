interface AdminIndicatorProps {
  isAdmin: boolean;
  loading: boolean;
}

export function AdminIndicator({ isAdmin, loading }: AdminIndicatorProps) {
  return (
    <div className='w-32 text text-red-500 text-center'>
      {isAdmin || loading ? `` : `Read Only`}
    </div>
  );
}
