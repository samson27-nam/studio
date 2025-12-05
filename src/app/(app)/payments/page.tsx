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
                Renew your membership for the 2024-2025 academic year.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name on card</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card number</Label>
                <Input id="cardNumber" placeholder="**** **** **** 1234" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Expires</Label>
                  <Select>
                    <SelectTrigger id="month">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">January</SelectItem>
                      <SelectItem value="2">February</SelectItem>
                      <SelectItem value="3">March</SelectItem>
                      <SelectItem value="4">April</SelectItem>
                      <SelectItem value="5">May</SelectItem>
                      <SelectItem value="6">June</SelectItem>
                      <SelectItem value="7">July</SelectItem>
                      <SelectItem value="8">August</SelectItem>
                      <SelectItem value="9">September</SelectItem>
                      <SelectItem value="10">October</SelectItem>
                      <SelectItem value="11">November</SelectItem>
                      <SelectItem value="12">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">&nbsp;</Label>
                  <Select>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={`${new Date().getFullYear() + i}`}
                        >
                          {new Date().getFullYear() + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Pay $50.00</Button>
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
                      Bridge Building Competition ($10)
                    </SelectItem>
                    <SelectItem value="dinner">
                      Annual Society Dinner ($45)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Use saved payment method?</p>
                <p className="text-sm text-muted-foreground">
                  Card ending in 1234
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Confirm Registration</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
