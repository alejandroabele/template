// import { ModeToggle } from '@/components/mode-toggle';
// import { ConfigMenu } from "@/components/config-menu"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      {/* Toggle positioned in the top-right corner */}
      <div className="absolute top-4 right-4">
        {/* <ConfigMenu /> */}
      </div>
      <div className="w-full max-w-sm md:max-w-3xl">
        {children}
      </div>
    </div>
  );
}
