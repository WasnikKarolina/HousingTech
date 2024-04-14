# HousingTech
## The problem

Rising property prices make homeownership elusive for many, while escalating rents strain tenants' budgets. Additionally, concerns about landlord credibility compound the challenges renters face. </br>


The UK housing shortage crisis presents daunting affordability challenges for buyers. Skyrocketing property prices and stringent mortgage requirements make homeownership unattainable for many, forcing them into the rental market.</br>


In the rental sector, rising demand and limited supply drive up rents, placing additional financial strain on tenants. As rental costs escalate, many struggle to make ends meet, exacerbating the affordability crisis.</br>


Compounding the challenges, tenants face difficulties with landlord credibility, including issues with property maintenance, communication, and deposit handling. These concerns undermine tenant confidence and exacerbate housing insecurity.</br>


**Blockchain and XRP offer transformative solutions to address the UK housing crisis, promoting affordability, stability, trust in the housing market and plan to facilitate real considerations to stabilise rents, and enhance landlord credibility.** By implementing policies that prioritize affordable housing development, protect tenants' rights, and ensure landlord accountability, we can build a more equitable and sustainable housing future for all.</br>




## The solution</br>
Introducing HomePlan, our innovative startup leveraging blockchain and XRP to tackle the UK housing crisis. With a focus on transparency, decentralized funding, and tokenization, we're reshaping the housing market for affordability and accessibility.</br>

HomePlan ensures transparency in property ownership and transactions through blockchain technology, providing immutable records for increased trust and security.</br>

Our platform facilitates decentralized funding and investment, linking funds for buying/selling processes and supporting affordable housing projects, driving inclusivity and sustainability.</br>

Tokenization solutions are integrated into our processes, enabling fractional ownership and liquidity for buyers and investors, revolutionizing the buying/selling process.</br>

HomePlan streamlines rental management and tenancy agreements with blockchain-based smart contracts, ensuring efficiency and fairness for both landlords and tenants.</br>

With HomePlan, we're reshaping the UK housing market, fostering transparency, affordability, and efficiency through blockchain and XRP.</br>

## Smart contracts</br>
1. ### PropertySale</br>
- The seller is set as the deployer of the contract.</br>
- The initiateOffer function allows a buyer (any address other than the seller) to initiate an offer by specifying the price they are willing to pay.</br>
- The acceptOffer function allows the seller to accept the offer initiated by the buyer.</br>
- Events (OfferInitiated and OfferAccepted) are emitted to log the initiation and acceptance of offers, respectively.</br>
- This is a very basic example and would require additional functionalities and security measures (such as input validation, access control, and error handling) for a real-world application. Additionally, integrating this smart contract with other components of your system (such as a front-end user interface and backend services) would be necessary to create a fully functional platform for property buying/selling.</br>

2. ### ProtpertyRent</br>
This contract represents and initialises  an ERC-20 token named "Property Token".
It inherits from the Ownable contract and the ERC20 contract provided by the OpenZeppelin library. The contract includes a mint function that allows the contract owner to create new tokens and assign them to a specified account. </br>
RentalMarketplace Contract:</br>
This contract serves as a marketplace for renting properties.  The listProperty function allows property owners to list their properties for rent. 
The rentProperty function allows users to rent properties by paying the required amount of Ether for a specified number of days.</br>

### Future road map</br>
In the future, HomePlan aims to expand nationwide, offering seamless integration with real estate agencies and financial institutions. We'll continue enhancing our platform with advanced features like AI-driven property recommendations and community-driven investment opportunities. Our goal is to revolutionize the housing market, making homeownership more accessible and affordable for all.</br>
As we prpgress and **XRP is heard to be introducing a stable coin** as well that can make our project even useful and implemnted in real life because stable cin coin pace up the payments for property without the crypto voltility. </br>
