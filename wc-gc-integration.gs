function start_sync() {

    var sheet_name = "OrderDetails"
    update_order_5_min(sheet_name)

}


function update_order_5_min(sheet_name) {

    var ck = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name).getRange("B4").getValue();

    var cs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name).getRange("B5").getValue();

    var website = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name).getRange("B3").getValue();

    var now = new Date();

    var website_t = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name).getRange("B6").getValue();

    var min = website_t * 60

    now.setMinutes(now.getMinutes() - min);

    var n = now.toISOString();

    var surl = website + "//wc-api/v3/orders?consumer_key=" + ck + "&consumer_secret=" + cs + "&filter[created_at_min]=" + n //"&after=2016-10-27T10:10:10Z"

    var url = surl
    Logger.log(url)

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

    }

    var doc = SpreadsheetApp.getActiveSpreadsheet();

    var temp = doc.getSheetByName(sheet_name);

    var consumption = {}

    arrayLength = params["orders"].length
    for (var i = 0; i < arrayLength; i++) {

        var container = [];

        a = container.push(params["orders"][i]["shipping_address"]["first_name"]);

        a = container.push(params["orders"][i]["shipping_address"]["last_name"]);

        a = container.push(params["orders"][i]["shipping_address"]["address_1"] + ", " + params["orders"][i]["billing_address"]["address_2"]);

        a = container.push("");

        a = container.push(params["orders"][i]["shipping_address"]["postcode"]);

        a = container.push(params["orders"][i]["shipping_address"]["city"]);

        a = container.push(params["orders"][i]["shipping_address"]["country"]);

        a = container.push(params["orders"][i]["billing_address"]["phone"]);

        a = container.push(params["orders"][i]["billing_address"]["email"]);

        a = container.push(params["orders"][i]["total"]); //price

        a = container.push(params["orders"][i]["payment_details"]["method_id"]);

        c = params["orders"][i]["line_items"].length;

        items = "";
        for (var k = 0; k < c; k++) {

            item = params["orders"][i]["line_items"][k]["name"];

            qty = params["orders"][i]["line_items"][k]["quantity"];

            meta = ""

            try {

                meta = params["orders"][i]["line_items"][k]["meta"][0]["value"];

                meta = " - " + meta
            } catch (err) {

                Logger.log("exeption")

                meta = ""
            }

            item_f = qty + " x " + item + meta

            items = items + item_f + ",\n"

        }

        a = container.push(items)

        a = container.push(params["orders"][i]["total_line_items_quantity"]); // Quantity

        a = container.push(params["orders"][i]["order_number"]); //

        a = container.push(params["orders"][i]["note"])

        a = container.push(params["orders"][i]["created_at"]);


        var doc = SpreadsheetApp.getActiveSpreadsheet();

        var temp = doc.getSheetByName(sheet_name);

        temp.appendRow(container);

        removeDuplicates(sheet_name)
    }
}

function removeDuplicates(sheet_name) {

    var doc = SpreadsheetApp.getActiveSpreadsheet();

    var sheet = doc.getSheetByName(sheet_name);

    var data = sheet.getDataRange().getValues();

    var newData = new Array();

    for (i in data) {

        var row = data[i];

        var duplicate = false;

        for (j in newData) {

            if (row.join() == newData[j].join()) {
                duplicate = true;

            }

        }
        if (!duplicate) {
            newData.push(row);
        }
    }
    sheet.clearContents();
    sheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData);
}
