export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050A30] via-[#0000FF]/60 to-[#050A30] flex items-center justify-center p-4">
      {children}
    </div>
  );
}
