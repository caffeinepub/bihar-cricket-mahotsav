import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Mail, MessageCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ContactPage() {
  const whatsappNumber = '919876543210';
  const email = 'info@biharcricketmahotsav.com';

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Have questions? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <div className="bg-saffron/10 p-4 rounded-full mb-4">
                  <MapPin className="h-8 w-8 text-saffron" />
                </div>
                <CardTitle>Location</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">Bihar, India</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <div className="bg-saffron/10 p-4 rounded-full mb-4">
                  <Mail className="h-8 w-8 text-saffron" />
                </div>
                <CardTitle>Email</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <a href={`mailto:${email}`} className="text-saffron hover:underline">
                {email}
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <div className="bg-saffron/10 p-4 rounded-full mb-4">
                  <MessageCircle className="h-8 w-8 text-saffron" />
                </div>
                <CardTitle>WhatsApp</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-saffron hover:underline"
              >
                Chat with us
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Quick Contact Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Get in Touch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">For Player Registration Queries</h3>
              <p className="text-muted-foreground">
                If you have questions about player registration, trials, or the tournament format, please contact us
                via WhatsApp or email. We typically respond within 24 hours.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">For Sponsorship Inquiries</h3>
              <p className="text-muted-foreground">
                Interested in sponsoring Bihar Cricket Mahotsav? Submit your inquiry through our{' '}
                <a href="/sponsorship" className="text-saffron hover:underline">
                  sponsorship page
                </a>{' '}
                or contact us directly via email for a customized proposal.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">For Team Owner Opportunities</h3>
              <p className="text-muted-foreground">
                If you're interested in owning a team in Bihar Cricket Mahotsav, please reach out to us via email with
                your details and we'll share the team ownership opportunities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">For Media & Press</h3>
              <p className="text-muted-foreground">
                Media professionals can contact us for press releases, interviews, and coverage opportunities. We're
                always happy to share our story and vision.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Disclaimer:</strong> Bihar Cricket Mahotsav is organised by Yuva Khel Abhiyaan – a youth sports
            development initiative. This is not a government-owned event. We are an independent organization committed
            to promoting cricket in Bihar.
          </AlertDescription>
        </Alert>

        {/* Organization Info */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/yka-logo-transparent.dim_150x150.png"
                  alt="Yuva Khel Abhiyaan"
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <CardTitle>Yuva Khel Abhiyaan</CardTitle>
                  <p className="text-sm text-muted-foreground">Youth Sports Development Initiative</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yuva Khel Abhiyaan is dedicated to creating opportunities for young athletes in Bihar. Through
                professional tournaments, training programs, and development initiatives, we aim to nurture talent and
                promote sports culture across the state.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
