import {OrderItem} from '@/types/order-item'
export interface Order {
  id: number
  orderItems: OrderItem[]
  total: number
  transactionId: null | string
  code: string
  ambassadorEmail: string
  firstName: string
  lastName: string
  email: string
  address: null | string
  city: null | string
  country: null | string
  zipCode: null | string
  complete: boolean
  createdAt: string
  updatedAt: string
  user: number
}

