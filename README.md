# woocommerce-google-sheets-integration
Sync order data from your WooCommerce store to Google sheets automatically. Free alternative to Zapier-WooCommerce integration.

The sheet uses the WooCommerce Rest API to connect to the WooCommerce store and sync the order data to the google sheet. The sheet will fetch order details like First Name, Last Name, Address, Post code, City, Country, Phone, Email, Price, Payment methode, Items, Quantity	OrderId, Notes, Date.

Below are the steps to set up the sheet:


# 1. Set up WooCommerce REST API in your wordpress website:

Steps can be found here : https://github.com/woocommerce/woocommerce/wiki/Getting-started-with-the-REST-API#generate-keys . You need to provide the API key and API secret generated from this step in the Google sheet.

# 2. Click on the google sheets link : 

The sheet is view only - request an edit permission - The sheet is kept as read only so that no one make changes in the original sheet / accidently enter their API credentials in this sheet accessible to the public. YOU SHOULD ALWAYS KEEP YOUR API CREDENTIALS as secret.

IMPORTANT : Once you get the edit permission, go to File > Make a copy and save the copy to your google drive. Now this copy can be accessed only by you. Do not make any modifications / enter your API credentials in the orginal sheet as any one can see the data in the public sheet.



