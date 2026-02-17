import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { usePaymentSuccessQuery } from '../hooks/useQueries';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('sessionId') || '';
  const accountId = params.get('accountId') || '';
  const caffeineCustomerId = params.get('caffeineCustomerId') || '';

  const { data, isLoading, isError } = usePaymentSuccessQuery(sessionId, accountId, caffeineCustomerId);

  useEffect(() => {
    if (!sessionId || !accountId || !caffeineCustomerId) {
      navigate({ to: '/' });
    }
  }, [sessionId, accountId, caffeineCustomerId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <p className="text-lg">Processing your payment...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-destructive">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-destructive">Payment Verification Failed</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                We couldn't verify your payment. Please contact support if you were charged.
              </p>
              <Button onClick={() => navigate({ to: '/' })}>Back to Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-saffron">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-20 w-20 text-saffron" />
            </div>
            <CardTitle className="text-3xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg mb-2">Thank you for registering for Bihar Cricket Mahotsav!</p>
              <p className="text-muted-foreground">Your registration has been confirmed.</p>
            </div>

            {data && (
              <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-semibold">
                    {data.payment.currency.toUpperCase()} {(Number(data.payment.amount) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-semibold">
                    {data.payment.paymentMethod.brand} •••• {data.payment.paymentMethod.last4}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-green-600">{data.payment.status}</span>
                </div>
              </div>
            )}

            <div className="bg-saffron/10 rounded-lg p-6">
              <h3 className="font-bold mb-2">What's Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ You will receive a confirmation email/SMS shortly</li>
                <li>✓ Trial dates and venue will be communicated soon</li>
                <li>✓ Keep your contact details updated</li>
                <li>✓ Prepare for the trials and showcase your talent!</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate({ to: '/player-registration' })} className="w-full">
                View Registration Details
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
