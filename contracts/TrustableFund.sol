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
        bool refund;                        // donate: false, refund: true
    }

    Fundraise[] fundList;
    DonationHistory [] donationList;        // contains both donation and refund histories

    // User address to user related transaction information <address, donation index array>
    mapping (address => uint[]) donationRecords;

    // User address to user created fundRecord information <address, fund index array>
    mapping(address => uint[]) fundRecords;


    event CreateFundSuccess(uint fundID, string storyTitle,uint goal);
    event DonateSuccess(uint fundID, uint donateID, uint amout);
    event WithdrawSuccess(uint fundID, uint amount);
    event RefundSuccess(uint fundID, uint donateID, uint amount);
    event CancelSuccess(uint fundID, uint amount);


    modifier checkUniqueFunderaise() {
        //check if user only have one active funderaise
        uint length=fundRecords[msg.sender].length;
        uint latestID;
        if (length != 0)
            latestID = fundRecords[msg.sender][length-1];

        require(length == 0|| fundList[latestID].active == false,"You already have one openning Fundraise");
        _;
    }

    modifier canBeWithdrawed() {
        uint length=fundRecords[msg.sender].length;
        uint latestID=fundRecords[msg.sender][length-1];

        // deadline has passed || goal has reached
        require((fundList[latestID].active == true && fundList[latestID].deadLine < block.timestamp && fundList[latestID].donation > 0) || 
                (fundList[latestID].donation >= fundList[latestID].goal), "The deadline haven't passed and the goal hasn't been reached");
        _;
    }

    modifier canBeCancelled() {
        uint length=fundRecords[msg.sender].length;
        uint latestID=fundRecords[msg.sender][length-1];

        // active fund
        require(fundList[latestID].active == true, "The money has already been withdrawn");
        _;
    }

    function publishFundraise( 
            uint _goal, 
            string memory _storyTitle, 
            string memory _storyText, 
            string memory _imageurl,
            uint _deadline
        ) public checkUniqueFunderaise(){
        // Create a new Fundraise struct and push it to the fundList
        uint fundID = fundList.length;
        uint[] memory _donationList;
        fundList.push(Fundraise({
            ownerAddress: msg.sender, // The address of the user who is creating the fundraise
            fundID: fundID, // Unique ID based on the length of the fundList
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

    function donation( 
            uint _fundID,
            string memory _time
        ) public payable{
        // Create a new DonationHistory struct and push it to the fundList
        require(fundList[_fundID].active==true, "fundraise is not active");

        // get the current total DonationList
        uint transID=donationList.length;
        // get the current total donation history in total DonationList
        donationList.push(DonationHistory({
            fundID: _fundID,
            time: _time,
            transAmount: msg.value, // the donation amount
            donator: msg.sender, 
            fundraiser: fundList[_fundID].ownerAddress,
            refund: false
        }));
        fundList[_fundID].donation+= msg.value;
        fundList[_fundID].donationList.push(transID);
        donationRecords[msg.sender].push(transID);

        emit DonateSuccess(_fundID, transID, msg.value);
    }

    function getFundList() public view returns(Fundraise[] memory, bool) {
        return (fundList, true);
    }

    // get the donate history of a user
    function getDonationHistoryByUser() public view returns(DonationHistory[] memory, bool) {
        if (donationRecords[msg.sender].length == 0)
            // return false if there is no donation record
            return (new DonationHistory[](0), false);
        
        uint length = donationRecords[msg.sender].length;
        DonationHistory[] memory history = new DonationHistory[](length);
        for (uint i=0; i<length; i++) {
            history[i] = donationList[donationRecords[msg.sender][i]];
        }

        return (history, true);
    }

    // get all the fundraises of a user
    function getFundraiseByUser() public view returns(Fundraise[] memory, bool) {
        if (fundRecords[msg.sender].length == 0)
            // return false if there is no fundraise
            return (new Fundraise[](0), false);
        
        uint length = fundRecords[msg.sender].length;
        Fundraise[] memory history = new Fundraise[](length);
        for (uint i=0; i<length; i++) {
            history[i] = fundList[fundRecords[msg.sender][i]];
        }

        return (history, true);
    }

    // get all the donation histry of a fundraise
    function getDonationByFundraise(uint _fundID) public view returns(DonationHistory[] memory, bool) {
        if (fundList[_fundID].donationList.length == 0)
            // return false if there is no donation history for this fund
            return (new DonationHistory[](0), false);

        uint[] memory donationIndexes = fundList[_fundID].donationList;
        DonationHistory[] memory history = new DonationHistory[](donationIndexes.length);
        for (uint i=0; i<donationIndexes.length; i++) {
            history[i] = donationList[donationIndexes[i]];
        }

        return (history, true);
    }

    // withdraw the a fundraise when the deadline has passed or the goal is reached
    function withdrawFundraise() public canBeWithdrawed() payable {
        uint length=fundRecords[msg.sender].length;
        uint latestID=fundRecords[msg.sender][length-1];

        payable(msg.sender).transfer(fundList[latestID].donation);
        fundList[latestID].active = false;

        emit WithdrawSuccess(latestID, fundList[latestID].donation);
    }

    // cancel the fundraise
    function cancelFundraise(string memory _time) public canBeCancelled() payable {
        uint length=fundRecords[msg.sender].length;
        uint latestID=fundRecords[msg.sender][length-1];

        uint[] memory _transList = fundList[latestID].donationList;
        // haven't received any donations yet, just return
        if (donationList.length == 0) {
            fundList[latestID].active = false;
            emit CancelSuccess(latestID, fundList[latestID].donation);
            return;
        }

        for (uint i=0; i<_transList.length; i++) {
            DonationHistory memory _entry = donationList[_transList[i]];

            // add a new refund entry
            uint transID = donationList.length;
            donationList.push(DonationHistory({
            fundID: _entry.fundID,
            time: _time,
            transAmount: _entry.transAmount,
            donator: _entry.donator,
            fundraiser: _entry.fundraiser,
            refund: true
            }));

            fundList[latestID].donationList.push(transID);
            payable(_entry.donator).transfer(_entry.transAmount);

            emit RefundSuccess(latestID, transID, _entry.transAmount);
        }

        fundList[latestID].active = false;

        emit CancelSuccess(latestID, fundList[latestID].donation);
    }
    

}


