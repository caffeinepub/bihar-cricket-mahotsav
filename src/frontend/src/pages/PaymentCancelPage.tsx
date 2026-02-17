import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-20 w-20 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl">Payment Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg mb-2">Your payment was cancelled.</p>
              <p className="text-muted-foreground">
                No charges were made to your account. You can try registering again when you're ready.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you encountered any issues during payment or have questions about registration, please contact us:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• WhatsApp: Use the floating button</li>
                <li>• Email: info@biharcricketmahotsav.com</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate({ to: '/player-registration' })}
                className="w-full bg-saffron hover:bg-saffron/90"
              >
                Try Again
              </Button>
              <Button onClick={() => navigate({ to: '/' })} variant="outline" className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
