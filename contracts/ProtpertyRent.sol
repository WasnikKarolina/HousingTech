// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyToken is ERC20, Ownable {
    constructor() ERC20("Property Token", "PROP") {}

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }
}

contract RentalMarketplace {
    enum PropertyStatus { Available, Rented }

    struct Property {
        address owner;
        string location;
        uint256 pricePerDay;
        PropertyStatus status;
    }

    mapping(uint256 => Property) public properties;
    PropertyToken public propertyToken;

    event PropertyListed(uint256 indexed id, string location, uint256 pricePerDay);
    event PropertyRented(uint256 indexed id, address renter, uint256 days);

    constructor(address _propertyToken) {
        propertyToken = PropertyToken(_propertyToken);
    }

    function listProperty(string memory _location, uint256 _pricePerDay) external {
        uint256 tokenId = propertyToken.totalSupply();
        properties[tokenId] = Property(msg.sender, _location, _pricePerDay, PropertyStatus.Available);
        propertyToken.mint(msg.sender, 1);
        emit PropertyListed(tokenId, _location, _pricePerDay);
    }

    function rentProperty(uint256 _tokenId, uint256 _days) external payable {
        Property storage property = properties[_tokenId];
        require(property.status == PropertyStatus.Available, "Property not available");
        uint256 totalPrice = property.pricePerDay * _days;
        require(msg.value >= totalPrice, "Insufficient funds");

        address payable owner = payable(property.owner);
        owner.transfer(totalPrice);
        property.status = PropertyStatus.Rented;

        emit PropertyRented(_tokenId, msg.sender, _days);
    }
}
