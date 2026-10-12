import { useState } from 'react'
import { DollarSign, TrendingUp, Calendar, Bike } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EarningRecord {
  id: string
  date: string
  amount: number
  deliveries: number
  tips: number
  bonus: number
}

const mockEarnings: EarningRecord[] = [
  { id: 'e1', date: '2024-06-01', amount: 145.50, deliveries: 12, tips: 23.00, bonus: 10.00 },
  { id: 'e2', date: '2024-06-02', amount: 198.00, deliveries: 18, tips: 35.00, bonus: 15.00 },
  { id: 'e3', date: '2024-06-03', amount: 120.00, deliveries: 10, tips: 18.00, bonus: 0.00 },
]

export default function DriverEarnings() {
  const [earnings] = useState<EarningRecord[]>(mockEarnings)
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0)
  const totalDeliveries = earnings.reduce((sum, e) => sum + e.deliveries, 0)
  const totalTips = earnings.reduce((sum, e) => sum + e.tips, 0)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Earnings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              €{totalEarnings.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Bike className="h-5 w-5 text-blue-500" />
              {totalDeliveries}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              €{totalTips.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-4">
          {earnings.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{record.date}</span>
                  </div>
                  <span className="font-bold">€{record.amount.toFixed(2)}</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {record.deliveries} deliveries · €{record.tips.toFixed(2)} tips · €{record.bonus.toFixed(2)} bonus
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
