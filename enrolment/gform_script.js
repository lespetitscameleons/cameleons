// --------------------------------------------------------------------------------
// To activate: menu Resources > Current project's triggers: onFormSubmit | From spreadsheet | On form submit
// --------------------------------------------------------------------------------

// Google doc template: 'Inscription Petits Caméléons Doc Modèle'
var templateId = "1Qbcw65F8j5OyO9KNuu0sZmcSS-mLFEkTfj6QG7WOerw";

// Google doc calendar: 'Inscription Petits Caméléons Calendrier'
var calendarId = "1X4j05Al5j_5wBZa8p75RoU_6tWr4Q3Rm-hN239dvvX4";

// Google folder to store the enrolment forms
var folderId = "";

// Document prefix
var docPrefix = "201409_InscriptionPCam_";

// For testing form submission
function test_onFormSubmit() {
  var form = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getDataRange();
  var formData = form.getValues();
  var headers = formData[0];
  // Start at row 1, skipping headers in row 0
  //for (var row=1; row < data.length; row++) {
    var e = {};
    e.values = formData[1];
    e.range = form.offset(1,0,1,formData[0].length);
    e.namedValues = {};
    // Loop through headers to create namedValues object
    for (var col=0; col<headers.length; col++) {
      e.namedValues[headers[col]] = e.values[col];
    }
    // Pass the simulated event to onFormSubmit
    onFormSubmit(e, 12);
  //}
}

// Create var mapping
function getMapping() {
  // create mapping
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("VarMapping");
  var data = sheet.getDataRange().getValues();
  var mapping = [];
  mapping.indexes = {};
  for (var row=1; row < data.length; ++row) { // iterate rows
    if (data[row][2] != '') {
      mapping[row] = {index: data[row][1], name: data[row][0], vartemplate: data[row][2]};
      mapping.indexes[data[row][2]] = data[row][1];
     }
  }
  return mapping
}

// When Form Gets submitted
function onFormSubmit(e, iRow) {

  // e.values[] is the list of values from the responses form
  // the numbering starts from 0 for column A 'Timestamp' from 'Inscription Petits Caméléons (Responses)'

  // first sheet is 'Form Responses' which is the form sheet destination
  var form = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (typeof iRow == 'undefined' ) iRow = form.getLastRow();

  // get mapping
  var mapping = getMapping();

  // form values
  var varChildName         = form.getRange(iRow, Number(mapping.indexes['varChildName'])).getValue();
  var varChildSurname      = form.getRange(iRow, Number(mapping.indexes['varChildSurname'])).getValue();
  var varContact1Email     = form.getRange(iRow, Number(mapping.indexes['varContact1Email'])).getValue();

  // extra variables
  var child_id = varChildSurname + "_" + varChildName;
  var email_address = varContact1Email;

  // create google doc per student with form data
  var folder = DocsList.getFolderById(folderId);
  var rootFolder = DocsList.getRootFolder();
  var copy = DocsList.getFileById(templateId).makeCopy(docPrefix + child_id);
  copy.addToFolder(folder);
  copy.removeFromFolder(rootFolder);
  var copyId = copy.getId();
  var copyDoc = DocumentApp.openById(copyId);

  // document header
  var copyFooter = copyDoc.getFooter();

  copyFooter.replaceText('varChildName', varChildName);
  copyFooter.replaceText('varChildSurname', varChildSurname);

  // document body
  var copyBody = copyDoc.getActiveSection();

  for (var i=1; i < mapping.length; ++i) {
    if (mapping[i].vartemplate == 'varDOB') {
      copyBody.replaceText('varDOB', Utilities.formatDate(new Date(form.getRange(iRow, Number(mapping[i].index)).getValue()), "BST", "dd/MM/yyyy"));
    } else {
      copyBody.replaceText(mapping[i].vartemplate, form.getRange(iRow, Number(mapping[i].index)).getValue());
    }
  }

  copyDoc.saveAndClose();

  // create pdf for calendar
  var pdfCalendar = DocsList.getFileById(calendarId).getAs(MimeType.PDF);

  // create pdf for enrolment
  var pdf = DocsList.getFileById(copyId).getAs(MimeType.PDF);

  // create email
  var subject = "Confirmation d'inscription aux Petits Caméléons pour " + varChildName + " " + varChildSurname + "";
  var body = "Bonjour, <br />\n";
  body += "<br />\n";
  body += "Merci d'avoir inscrit <b>" + varChildName + " " + varChildSurname + "</b> aux Petits Caméléons pour l’année scolaire 2014-2015.<br />\n";
  body += "Vous trouverez en pièces jointes :<br />\n";
  body += "- le document PDF reprenant les informations que vous nous avez données. Veuillez nous contacter s’il s’avère que certaines informations sont erronées afin que nous puissions les corriger.<br />\n";
  body += "- le calendrier des séances ainsi que l'échéancier pour le règlement des frais d’inscription.<br />\n";
  body += "<br />\n";
  body += "Nous vous recontacterons avant la première séance pour vous confirmer le nom et les horaires de la classe de votre enfant.<br />\n";
  body += "<br />\n";
  body += "La première séance de la <b>formule samedi</b> aura lieu le <b>samedi 27 septembre 2014</b>.<br />\n";
  body += "La première séance de la <b>formule mardi</b> aura lieu le <b>mardi 30 septembre 2014</b>.<br />\n";
  body += "La première séance de la <b>formule club du mardi</b> aura lieu le <b>mardi 23 septembre 2014</b>.<br />\n";
  body += "<br />\n";
  body += "Votre inscription sera effective une fois que Les Petits Caméléons auront reçu un <b>acompte de £50</b> par enfant.<br />\n";
  body += "<br />\n";
  body += "Une <b>cotisation de £10</b> sera ajoutée au montant total comme frais d’adhésion à l’association des Petits Caméléons. Cette adhésion est annuelle et familiale. Quel que soit le nombre d’enfants, une seule cotisation sera demandée. Elle vous permettra notamment d’obtenir un vote à l’Assemblée Générale de l’association.<br />\n";
  body += "<br />\n";
  body += "Il est possible de nous régler:<br />\n";
  body += "- par <b>virement bancaire</b> sur le compte des Petits Caméléons, merci de ne pas oublier de mettre en référence le nom de votre enfant:<br />\n"
  body += "    The Co-operative Bank<br />\n";
  body += "    Sort code: 089299, Account number: 65633218<br />\n";
  body += "- par <b>chèque</b> à l'ordre de ‘Les Petits Caméléons’, merci d’inscrire le nom de votre enfant au dos du chèque à poster à l'adresse suivante:<br />\n";
  body += "    Jonathan Delahoche<br />\n";
  body += "    Trésorier des Petits Caméléons<br />\n";
  body += "    29 The Elms<br />\n";
  body += "    Milton<br />\n";
  body += "    Cambridge CB24 6ZQ<br />\n";
  body += "Nous n'acceptons malheureusement pas de paiement en liquide.<br />\n";
  body += "<br />\n";
  body += "Merci de votre confiance.<br />\n";
  body += "N’hésitez pas à nous contacter pour toute remarque ou question en répondant à ce courrier. Si votre demande est plus spécifique, vous pouvez aussi contacter directement le trésorier à l’adresse suivante tresorerie@petitscams.org.uk.<br />\n";
  body += "<br />\n";
  body += "Au plaisir de vous rencontrer très prochainement,<br />\n";
  body += "L'équipe des Petits Caméléons.<br />\n";
  body += "http://www.petitscams.org.uk/";

  // send email
  MailApp.sendEmail(email_address, subject, body, {htmlBody: body, attachments: [pdf, pdfCalendar]});

}

// Add extra menu
function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {name: "Re-send email", functionName: "reSubmit"},];
  ss.addMenu("PetitsCams", menuEntries);

}

// Menu to re-sent email using form data
function reSubmit() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ReGenerateDoc");
  var form = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  // fetch data
  var data = sheet.getDataRange().getValues();
  var formData = form.getDataRange().getValues();
  var headers = formData[0];

  // get mapping
  var mapping = getMapping();

  // iterate over data in sheet 'ReGenerateDoc'
  for (i=1;i<data.length;++i) {
    var processEntry = data[i][0].toLowerCase();
    if (processEntry == 'yes' || processEntry == 'oui' ) {
      var dataChildName = data[i][1].trim().toUpperCase();
      var dataChildSurname = data[i][2].trim().toUpperCase();
      var dataEmail = data[i][3].trim().toLowerCase();
      // iterate over 'Form Responses'
      for (j=1;j<formData.length;++j) { // iterate rows
        var formChildName = formData[j][Number(mapping.indexes['varChildName'])-1].trim().toUpperCase();
        var formChildSurname = formData[j][Number(mapping.indexes['varChildSurname'])-1].trim().toUpperCase();
        var formEmail = formData[j][Number(mapping.indexes['varContact1Email'])-1].trim().toLowerCase();
        if (dataChildName == formChildName && dataChildSurname == formChildSurname && dataEmail == formEmail) {
          // found in 'Form Responses'
          sheet.getRange(i+1, 5).setValue("oui");
          // simulate object created when form submitted
          var e = {};
          e.values = formData[j];
          e.range = form.getDataRange().offset(1,0,1,formData[j].length);
          e.namedValues = {};
          // Loop through headers to create namedValues object
          for (var col=0; col<headers.length; col++) {
            e.namedValues[headers[col]] = e.values[col];
          }
          // Pass the simulated event to onFormSubmit
          onFormSubmit(e, j+1);
          sheet.getRange(i+1, 6).setValue("oui");

        }
      }
    } else {
      sheet.getRange(i+1, 5).setValue("non");
      sheet.getRange(i+1, 6).setValue("non");
    }
  }
}
