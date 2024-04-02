const unixTimeToDate=(unixTime)=> {
    // Multiply Unix time by 1000 to convert from seconds to milliseconds
    const milliseconds = unixTime * 1000;
    
    // Create a new Date object using the milliseconds
    const date = new Date(milliseconds);
    
    // Use any method to get the desired date format
    // For example, using toLocaleString() to get the date in the local time zone
    return date.toLocaleDateString(); // Adjust format as needed
  }

  module.exports={unixTimeToDate}