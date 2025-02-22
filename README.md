# TODO
- Cache result of persisted test-data
- Allow uploading of new data by end users with or without persisting 

# monieshop-analytics
Monieshop is a supermarket that sells different products to its customers. It uses a digital accounting system to track its sales transactions.
The digital accounting system uses text files to store transaction data. Here is a brief description of the file format:

Each text file contains the transaction data for 1 day.

A single line in a transaction file stores information related to 1 transaction in a comma-separated format. The information present is: 
- salesStaffId
- transaction time
- The products sold. (format “[productId1:quantity|productId2:quantity]”)
- sale amount

Example for a line in a transaction file: “4,2025-01-01T16:58:53,[726107:5|553776:5],2114.235”

### You’re asked to write analytics software that reads through 2024 transactions’ files and reports the following metrics:
- Highest sales volume in a day
- Highest sales value in a day
- Most sold product ID by volume
- Highest sales staff ID for each month.
- Highest hour of the day by average transaction volume
