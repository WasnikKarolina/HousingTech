export type Users = {
    id: string;
    email: string;
    isOnboarded?: boolean;
    phone: string;
    isActive: Boolean;
};

export type Bid = {
    id: string;
    userId: string;
    itemId: string;
    bidAmount: number;
    bidTime: Date;
};
export type Item = {
    id: string;
    userId: string;
    isActive: boolean;
    creationDate: Date;
    name: string;
    nameLowercased: string;
    quantity: number;
    startDate: Date;
    endDate: string;
    startingPrice: number;
    currentPrice: number;
    category: string;
    condition: string;
    shippingMethod: string;
    shippingCost: number;
    estimatedDeliveryTime: string;
    images: string[];
    description: string;
    status: string;
    bids: Bid[];
    winningUser?: string | null;
};

export type Category = {

    id: string;
    userId: string;
    creationDate: Date;
    description?: string;
    icon?: string;
    name: string;
    items: string[];
}
