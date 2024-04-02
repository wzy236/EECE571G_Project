export const mockData = [
    {
      ownerAddress: "0x1234567890123456789012345678901234567890",
      fundID: 1,
      goal: 1000,
      donation: 500,
      donationList: [100, 200, 200],
      deadLine: 1648896000, // Unix timestamp representing a deadline (e.g., April 2, 2022)
      storyTitle: "Helping Children in Need",
      storyText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      imageurl: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
      active: true
    },
    {
      ownerAddress: "0x0987654321098765432109876543210987654321",
      fundID: 2,
      goal: 500,
      donation: 250,
      donationList: [50, 100, 100],
      deadLine: 1648896000, // Unix timestamp representing a deadline (e.g., April 2, 2022)
      storyTitle: "Supporting Animal Welfare",
      storyText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      imageurl: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
      active: false
    },
    {
        ownerAddress: "0x0987654321098765432109876543210987654321",
        fundID: 2,
        goal: 500,
        donation: 250,
        donationList: [50, 100, 100],
        deadLine: 1648896000, // Unix timestamp representing a deadline (e.g., April 2, 2022)
        storyTitle: "Supporting Animal Welfare",
        storyText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        imageurl: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
        active: false
      }
  ];

  export const mockDonationHistory = [
    {
      fundID: 1,
      time: "2024-03-31T08:00:00Z", // Example timestamp in ISO 8601 format
      transAmount: 100,
      donator: "0xABCDEF1234567890ABCDEF1234567890ABCDEF12",
      fundraiser: "0x1234567890ABCDEF1234567890ABCDEF12345678",
      refund: false
    },
    {
      fundID: 1,
      time: "2024-03-31T09:30:00Z", // Example timestamp in ISO 8601 format
      transAmount: 50,
      donator: "0xABCDEF1234567890ABCDEF1234567890ABCDEF12",
      fundraiser: "0x1234567890ABCDEF1234567890ABCDEF12345678",
      refund: false
    },
    {
      fundID: 2,
      time: "2024-03-31T10:45:00Z", // Example timestamp in ISO 8601 format
      transAmount: 200,
      donator: "0x9876543210987654987654321098765498765432",
      fundraiser: "0x4567890ABCDEF1234567890ABCDEF1234567890",
      refund: false
    }
  ];