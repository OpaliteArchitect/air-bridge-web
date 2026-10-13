import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Wifi, Loader2 } from "lucide-react";

interface PinGatewayProps {
  pin: string;
  setPin: (pin: string) => void;
  errorMessage: string;
  isLoadingAuth: boolean;
  onLogin: (e: React.SubmitEvent) => void;
}

export function PinGateway({
  pin,
  setPin,
  errorMessage,
  isLoadingAuth,
  onLogin,
}: PinGatewayProps) {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <Wifi className="size-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Air Bridge</h1>
          <p className="text-sm text-muted-foreground">
            Secure Offline File Sharing Hub
          </p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="size-5 text-muted-foreground" /> Enter Access PIN
            </CardTitle>
            <CardDescription>
              Enter the PIN provided by the host device to view files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="••••"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="text-center text-lg tracking-widest"
                  autoFocus
                />
                {errorMessage && (
                  <p className="text-xs text-destructive text-center">
                    {errorMessage}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoadingAuth}>
                {isLoadingAuth ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : null}
                Access Files
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
