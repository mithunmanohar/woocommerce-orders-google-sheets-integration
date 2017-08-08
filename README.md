# woocommerce-google-sheets-integration
Sync order data from your WooCommerce store to Google sheets automatically. A free alternative to Zapier-WooCommerce integration.

The sheet uses the WooCommerce Rest API to connect to the WooCommerce store and sync the order data to the google sheet. The sheet will fetch order details like First Name, Last Name, Address, Post code, City, Country, Phone, Email, Price, Payment method, Items, Quantity    OrderId, Notes, Date.

Below are the steps to set up the sheet:


# 1. Set up WooCommerce REST API in your WordPress website:

Steps can be found here: https://github.com/woocommerce/woocommerce/wiki/Getting-started-with-the-REST-API#generate-keys . You need to provide the API key and API secret generated from this step in the Google sheet.

# 2. Click on the google sheets link : https://goo.gl/jAqPMz

The sheet is view only - request an edit permission - The sheet is kept as read only so that no one makes changes in the original sheet / accidentally enter their API credentials in this sheet accessible to the public. YOU SHOULD ALWAYS KEEP YOUR API CREDENTIALS as secret.

IMPORTANT: Once you get the edit permission, go to File > Make a copy and save the copy to your google drive. Now, this copy can be accessed only by you. Do not make any modifications / enter your API credentials in the original sheet as any one can see the data in the public sheet.

# 3. Set up your google sheet

Enter your store URL (Should be in the format https://yourstore.com ), API Key, API secret in the sheet and click on the Update button. The google sheets will ask for permission for the app to run. The sheet requires permission to 1. View and manage your spreadsheets in Google Drive, 2. Connect to an external service. It will show the app as unverified - This is because it is tryingy to access an external url - the site you have given in the sheet in this case. Click on Adavanced and proceed. Please feel free to take a look at the code in script editor to see what the sheet is doing in case you are in doubt. 
If every thing is set up correctly, the sheet will update with the order details from your woocommerce store.

# 4. Set up automatic sync 

The sheet can be manually updated on click of the update button. If you want to the sheet to update automatically, you can set up a trigger for the sheet. 
Click on Tools > Script Editor. A new window will pop up. 

On that page, click on Edit > Current Projects Trigger. In the pop-up, give the name 'start_sync' in first field and time driven in the second field. You can set the update frequency also here. There is option to update sheet daily, hourly, monthly and even on opening the sheet.

'start_sync' is the function that invokes the script that sync data between the google sheets and your site. Setting a trigger will trigger this process periodically based on the preferences you set.

The field Fetch Data interval (hrs) can be used to control how much data will be fetched during each refresh. If you set this a 5 hours - All the order details from last 5 hours will be fetched. Rest assured, only unique orders will be shown in the sheet.

