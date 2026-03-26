export interface Tire {
  id: string
  brand: string
  model: string
  width: string
  height: string
  radius: string
  season: string
  price: string
  priceNum: number
  seller: string
  url: string
  condition: string
}

export interface CartItem extends Tire {
  qty: number
}
