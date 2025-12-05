import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">
          Manage your membership fees and event registrations.
        </p>
      </div>

      <Tabs defaultValue="membership" className="w-full max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="membership">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Annual Membership</CardTitle>
              <CardDescription>
                Renew your membership for the 2024-2025 academic year. Amount:
                MWK 50,000.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm font-medium">
                Proceed to payment using PayChangu. You can use Airtel Money,
                TNM Mpamba, or Bank Transfer.
              </p>
              <div className="flex items-center justify-center gap-4 p-4 rounded-md bg-muted">
                  <Image src="https://paychangu.com/images/airtel-money.png" alt="Airtel Money" width={80} height={50} className="object-contain" />
                  <Image src="https://paychangu.com/images/mpamba.png" alt="TNM Mpamba" width={80} height={50} className="object-contain" />
                  <Image src="https://paychangu.com/images/standard-bank.png" alt="Standard Bank" width={80} height={50} className="object-contain" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Image
                  src="https://paychangu.com/images/pay_with_paychangu_blue.png"
                  alt="Pay with PayChangu"
                  width={150}
                  height={40}
                  className="object-contain"
                />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Event Registration</CardTitle>
              <CardDescription>
                Register for an upcoming event.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event">Select Event</Label>
                <Select>
                  <SelectTrigger id="event">
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="competition">
                      Bridge Building Competition (MWK 10,000)
                    </SelectItem>
                    <SelectItem value="dinner">
                      Annual Society Dinner (MWK 45,000)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm font-medium">
                Proceed to payment using PayChangu.
              </p>
               <div className="flex items-center justify-center gap-4 p-4 rounded-md bg-muted">
                  <Image src="https://paychangu.com/images/airtel-money.png" alt="Airtel Money" width={80} height={50} className="object-contain" />
                  <Image src="https://paychangu.com/images/mpamba.png" alt="TNM Mpamba" width={80} height={50} className="object-contain" />
                  <Image src="https://paychangu.com/images/standard-bank.png" alt="Standard Bank" width={80} height={50} className="object-contain" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                 <Image
                  src="https://paychangu.com/images/pay_with_paychangu_blue.png"
                  alt="Pay with PayChangu"
                  width={150}
                  height={40}
                  className="object-contain"
                />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
