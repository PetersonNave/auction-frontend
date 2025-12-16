export interface User {
  id: string;
  username: string;
  displayName: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Item {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Auction {
  _id: string;
  item: Item | string; 
  price: number;
  highestBidder: string | null;
  expiresAt: string;
  isClosed: boolean;
  owner?: User | string;
  __v: number; 
}

export interface AuctionState {
  _id: string;
  price: number;
  highestBidder: string | null;
  expiresAt: string;
  isClosed: boolean;
  __v: number;
}

export interface Bid {
  _id: string;
  auctionId: string;
  bidder: string;
  amount: number;
  versionAtBidTime: number;
  createdAt: string;
  updatedAt?: string;
}