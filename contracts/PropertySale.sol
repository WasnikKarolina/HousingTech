// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PropertySale {
    address public seller;
    address public buyer;
    uint public price;
    bool public offerAccepted;

    event OfferInitiated(address indexed _buyer, uint _price);
    event OfferAccepted(address indexed _seller, address indexed _buyer, uint _price);

    constructor() {
        seller = msg.sender;
    }

    function initiateOffer(uint _price) external {
        require(msg.sender != seller, "Seller cannot initiate an offer.");
        require(!offerAccepted, "An offer has already been accepted.");

        buyer = msg.sender;
        price = _price;
        emit OfferInitiated(buyer, price);
    }

    function acceptOffer() external {
        require(msg.sender == seller, "Only the seller can accept the offer.");
        require(buyer != address(0), "No offer has been initiated yet.");

        offerAccepted = true;
        emit OfferAccepted(seller, buyer, price);
    }
}
