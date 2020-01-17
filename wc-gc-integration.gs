// Updated code to v2 Woocommerce API
function start_syncv2() {

    var sheet_name = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
    fetch_orders(sheet_name)

}


function fetch_orders(sheet_name) {

    var ck = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name).getRange("B4").getValue();

    var cs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name).getRange("B5").getValue();

    var website = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name).getRange("B3").getValue();
  
    var manualDate = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name).getRange("B6").getValue(); // Set your order start date in spreadsheet in cell B6

    var m = new Date(manualDate).toISOString();

    


    var surl = website + "/wp-json/wc/v2/orders?consumer_key=" + ck + "&consumer_secret=" + cs + "&after=" + m + "&per_page=100"; 

    var url = surl
    //Logger.log(url)

    var options =

        {
            "method": "GET",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "muteHttpExceptions": true,

        };

    var result = UrlFetchApp.fetch(url, options);

    Logger.log(result.getResponseCode())
    if (result.getResponseCode() == 200) {

        var params = JSON.parse(result.getContentText());
      //Logger.log(params);

    }

    var doc = SpreadsheetApp.getActiveSpreadsheet();

    var temp = doc.getSheetByName(sheet_name);

    var consumption = {};

    var arrayLength = params.length;
  
    for (var i = 0; i < arrayLength; i++) {
        var a, c, d;
        var container = [];
        a = container.push(params[i]["billing"]["first_name"]);

        a = container.push(params[i]["billing"]["last_name"]);

        a = container.push(params[i]["billing"]["address_1"]+ " "+ params[i]["billing"]["postcode"]+ " "+ params[i]["billing"]["city"]);

        a = container.push(params[i]["shipping"]["first_name"] + " "+ params[i]["shipping"]["last_name"]+" "+ params[i]["shipping"]["address_1"]+" "+params[i]["shipping"]["postcode"]+" "+params[i]["shipping"]["city"]+" "+params[i]["shipping"]["state"]+" "+params[i]["shipping"]["country"]); 

        a = container.push(params[i]["billing"]["phone"]);

        a = container.push(params[i]["billing"]["email"]);
      
        a = container.push(params[i]["customer_note"]);
      
        a = container.push(params[i]["payment_method_title"]);
      
        c = params[i]["line_items"].length;

        var items = "";
        var total_line_items_quantity = 0;
        for (var k = 0; k < c; k++) {
          var item, item_f, qty, meta;

            item = params[i]["line_items"][k]["name"];

            qty = params[i]["line_items"][k]["quantity"];

            item_f = qty + " x " + item;

            items = items + item_f + ",\n";

            total_line_items_quantity += qty;
        }
      

        a = container.push(items);
      
        a = container.push(total_line_items_quantity); // Quantity

        a = container.push(params[i]["total"]); //Price
        
        a = container.push(params[i]["discount_total"]); // Discount
        
        d = params[i]["refunds"].length;
      
        var refundItems = "";
      
        var refundValue = 0.0;
      
        for (var r = 0; r < d; r++) {
          var item, item_f, value;

            item = params[i]["refunds"][r]["reason"];

            value = params[i]["refunds"][r]["total"];
            
            refundValue += parseFloat(value);

            item_f = value +" - "+ item;

            refundItems += item_f + ",\n";

        }
      
        
      
        a = container.push(refundValue); //Refunded value from order
      
        a = container.push(parseFloat(container[10]) + refundValue); // Total minus refund
      
        a = container.push(refundItems); //Refunded items from order

        a = container.push(params[i]["id"]); 

        a = container.push(params[i]["date_created"]);
      
        a = container.push(params[i]["date_modified"]);
      
        a = container.push(params[i]["status"]);
      
        a = container.push(params[i]["order_key"]);


        var doc = SpreadsheetApp.getActiveSpreadsheet();

        var temp = doc.getSheetByName(sheet_name);

        temp.appendRow(container);
     
        Logger.log(params[i]);

        removeDuplicates(sheet_name);
    }
}

function removeDuplicates(sheet_name) {

    var doc = SpreadsheetApp.getActiveSpreadsheet();

    var sheet = doc.getSheetByName(sheet_name);

    var data = sheet.getDataRange().getValues();

    var newData = new Array();

    for (i in data) {

        var row = data[i];
      /*  TODO feature enhancement in de-duplication
        var date_modified =row[row.length-2];
      
        var order_key = row[row.length];
      
        var existingDataSearchParam = order_key + "/" + date_modified; 
       */

        var duplicate = false;

        for (j in newData) {
          
          var rowNewData = newData[j];
          
          var new_date_modified =rowNewData[rowNewData.length-2];
          
          var new_order_key = rowNewData[rowNewData.length];
          
          //var newDataSearchParam = new_order_key + "/" + new_date_modified; // TODO feature enhancement in de-duplication

          if(row.join() == newData[j].join()) {
                duplicate = true;

            }
          
          // TODO feature enhancement in de-duplication
          /*if (existingDataSearchParam == newDataSearchParam){
            duplicate = true;
          }*/

        }
        if (!duplicate) {
            newData.push(row);
        }
    }
    sheet.clearContents();
    sheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData);
}
