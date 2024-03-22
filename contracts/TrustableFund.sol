pragma solidity ^0.8.24;

contract TrustableFund { 
    struct Fundraise {
        address ownerAddress;
        uint fundID;
       	uint goal;
        uint donation;
	    uint[] donationList;
        uint deadLine;
       	string storyTitle;
        string storyText;
       	string imageurl;
	    bool active;
    }

    struct DonationHistory {
        uint fundID;
        string time;
        uint transAmount;
        address donator;
        address fundraiser;
    }

    Fundraise[] fundingList;
    DonationHistory [] totalDonationList;

    // User address to user related transaction information
    mapping (address => uint[]) donationRecords;

    // User address to user created fundRecord information
    mapping(address => uint[] ) fundRecords;


    event CreateFundSuccess(uint fundID, string storyTitle,uint goal);
    event DonateSuccess(uint fundID, uint donateID, uint amout);


    modifier checkUniqueFunderaise() {
        //check if user only have one active funderaise
        uint length=fundRecords[msg.sender].length;
        uint latestID=donationRecords[msg.sender][length-1];

        require(fundingList[latestID].active == false,"You all ready have openning Fundraise");
            _;
    }

    function publishFundraise( 
            uint _goal, 
            string memory _storyTitle, 
            string memory _storyText, 
            string memory _imageurl,
            uint _deadline
        ) public checkUniqueFunderaise(){
        // Create a new Fundraise struct and push it to the fundingList
        uint fundID = fundingList.length;
        uint[] memory _donationList;
        fundingList.push(Fundraise({
            ownerAddress: msg.sender, // The address of the user who is creating the fundraise
            fundID: fundID, // Unique ID based on the length of the fundingList
            goal: _goal,
            donation: 0, // Initial donation is 0
            donationList: _donationList, // Initialize an empty array
            deadLine: _deadline,
            storyTitle: _storyTitle,
            storyText: _storyText,
            imageurl: _imageurl,
            active: true // Assuming a new fundraise is active by default
        }));
        // push the fundID to user's fund record
        fundRecords[msg.sender].push(fundID);

        emit CreateFundSuccess(fundID , _storyTitle, _goal);
    }

    function Donation( 
            uint _fundID,
            string memory _time
        ) public payable{
        // Create a new Fundraise struct and push it to the fundingList
        require(fundingList[_fundID].active==true, "fundraise is not active");

        // get the current total DonationList
        uint transID=totalDonationList.length;
        // get the current total donation history in total DonationList
        totalDonationList.push(DonationHistory({
            fundID: _fundID,
            time: _time,
            transAmount: msg.value, // the donation amount
            donator: msg.sender, 
            fundraiser: fundingList[_fundID].ownerAddress
        }));
        fundingList[_fundID].donation+= msg.value;
        fundingList[_fundID].donationList.push(transID);
        donationRecords[msg.sender].push(transID);

        emit DonateSuccess(_fundID, transID, msg.value);
    }

    function getfundingList() public view returns(Fundraise[] memory, bool) {
        return (fundingList, true);
    }



    

}


