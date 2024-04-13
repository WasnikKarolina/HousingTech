// BiddingForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import { Item, Bid } from '@/components/types/types';
interface BiddingFormProps {
    item: Item;
    onBid: (item: Item, newBidAmount: number) => void;
}

const BiddingForm: React.FC<BiddingFormProps> = ({ item, onBid }) => {
    const [bidAmount, setBidAmount] = useState<number>(0);

    const handleBidSubmit = () => {
        // Call the onBid function to handle the bid submission
        onBid(item, bidAmount);
        // Reset the bid amount after submission
        setBidAmount(0);
    };

    return (
        <div>
            <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(parseInt(e.target.value))}
                placeholder="Enter bid amount"
            />
            <Button onClick={handleBidSubmit}>Place Bid</Button>
        </div>
    );
};

export default BiddingForm;
