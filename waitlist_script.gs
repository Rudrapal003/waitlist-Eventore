function doPost(e) {
  // Set CORS headers
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  
  if (e.postData === undefined) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'No post data' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    var data = JSON.parse(e.postData.contents);
    var type = data.type; // 'planner' or 'vendor'
    
    // Connect to the active spreadsheet (the one this script is attached to)
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    
    if (type === 'planner') {
      var sheet = doc.getSheetByName('planner waitlist');
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Sheet "planner waitlist" not found' })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Planner fields: First Name, Last Name, Email, Instagram, YouTube, Timeline, Timestamp
      sheet.appendRow([
        data.firstName || "",
        data.lastName || "",
        data.email || "",
        data.instagram || "",
        data.youtube || "",
        data.timeline || "",
        new Date()
      ]);
      
    } else if (type === 'vendor') {
      var sheet = doc.getSheetByName('vendore waitlist');
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Sheet "vendore waitlist" not found' })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Vendor fields: First Name, Last Name, Email, Business Type, Business Name, Instagram, YouTube, Timeline, Timestamp
      sheet.appendRow([
        data.firstName || "",
        data.lastName || "",
        data.email || "",
        data.businessType || "",
        data.businessName || "",
        data.instagram || "",
        data.youtube || "",
        data.timeline || "",
        new Date()
      ]);
      
    } else {
      return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': 'Unknown type: ' + type })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'message': 'Data added successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  // Handle CORS preflight requests
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}
