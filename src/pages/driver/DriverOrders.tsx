import { useState } from 'react'
import { Package, MapPin, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Delivery {
  id: string
  orderId: string
  customer: string
  address: string
  status: 'pending' | 'picked_up' | 'delivering' | 'delivered'
  items: string[]
  estimatedTime: string
}

const mockDeliveries: Delivery[] = [
  {
    id: 'del-1',
    orderId: 'ORD-001',
    customer: 'John Doe',
    address: '123 Main St, Paris',
    status: 'pending',
    items: ['Margherita Pizza', 'Coca-Cola'],
    estimatedTime: '15 min',
  },
  {
    id: 'del-2',
    orderId: 'ORD-002',
    customer: 'Jane Smith',
    address: '456 Oak Ave, Paris',
    status: 'picked_up',
    items: ['Sushi Combo', 'Miso Soup'],
    estimatedTime: '25 min',
  },
]

export default function DriverOrders() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries)

  const updateStatus = (id: string, status: Delivery['status']) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    )
  }

  const getStatusBadge = (status: Delivery['status']) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-blue-100 text-blue-800',
      delivering: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
    }
    return <Badge className={variants[status]}>{status.replace('_', ' ')}</Badge>
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Deliveries</h1>
      <div className="space-y-4">
        {deliveries.map((delivery) => (
          <Card key={delivery.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {delivery.orderId}
                </CardTitle>
                {getStatusBadge(delivery.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {delivery.address}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Est. {delivery.estimatedTime}
              </div>
              <div className="text-sm">
                <span className="font-medium">Items:</span> {delivery.items.join(', ')}
              </div>
              <div className="flex gap-2 pt-2">
                {delivery.status === 'pending' && (
                  <Button size="sm" onClick={() => updateStatus(delivery.id, 'picked_up')}>
                    Pick Up
                  </Button>
                )}
                {delivery.status === 'picked_up' && (
                  <Button size="sm" onClick={() => updateStatus(delivery.id, 'delivering')}>
                    Start Delivery
                  </Button>
                )}
                {delivery.status === 'delivering' && (
                  <Button size="sm" onClick={() => updateStatus(delivery.id, 'delivered')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Delivered
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
