# cameleons

Various scripts used for running 'Les Petits Caméléons'

_Enrolment_

We use google form, please find the link to our public copy of our google documents http://goo.gl/FIVh9N for reference.

1. First, you have to create a google form

Our model is https://docs.google.com/forms/d/1pz6RcB4ab6ONlVNiE4ZKg4X66w1OlAP98QXXGv7u0Bo/edit?usp=sharing

2. Then, link the form to a google spreadsheet (click on 'View responses' in google form). Each time a form is submitted, a row will be created in the spreadsheet.

Our spreadsheet is https://docs.google.com/spreadsheets/d/1ixviqX3OVZwEHRaeSbRowL9sC7srexJs-sRLwGDOgc8/edit?usp=sharing

3. Open the google spreadsheet to create a tab called 'VarMapping' where each field of the google form will be mapped to a variable name of your choice.
This table is used to map the spreadsheet form table (tab 'From responses ...') to a google document (Word document) that is used to summarise the enrolment which is then send by email as a PDF.

4. Create a google document for summarising the enrolment form which will be created and filled with information entered at submission.
For each submission a new google document will be created based on this template, it will be saved into a directory in your google drive of your choice.
We do also send a calendar with all the sessions for the year, as well as payment deadline and information.

Our model is https://docs.google.com/document/d/1Qbcw65F8j5OyO9KNuu0sZmcSS-mLFEkTfj6QG7WOerw/edit?usp=sharing.
Our calendar is https://docs.google.com/document/d/1X4j05Al5j_5wBZa8p75RoU_6tWr4Q3Rm-hN239dvvX4/edit?usp=sharing.

5. Add the javascript code from enrolment/gform_script.js into the google spreadsheet, by clicking on the menu Tools > Script editor...
A new file will open which is a javascript file. Paste the script in there.
The code will need to be changed to match your own google drive documents. You will need to edit these IDs:

```js
// Google doc template: 'Inscription Petits Caméléons Doc Modèle'
var templateId = "1Qbcw65F8j5OyO9KNuu0sZmcSS-mLFEkTfj6QG7WOerw";

// Google doc calendar: 'Inscription Petits Caméléons Calendrier'
var calendarId = "1X4j05Al5j_5wBZa8p75RoU_6tWr4Q3Rm-hN239dvvX4";

// Google folder to store the enrolment forms
var folderId = "";

// Document prefix
var docPrefix = "201409_InscriptionPCam_";
```

Change the body of the email in the method onFormSubmit() to fit your own needs.

To activate the script, click on menu Resources > Current project's triggers. Then click to add one, select Run 'onFormSubmit' and Run 'From spreadsheet' 'On form submit'.
Configure here the notifications as well to receive the error messages as they are generated instead of daily (Execution failure notifications: via email immediately).

6. Test the form by going back to the google form and click 'View live form', fill the form and submit it. Check that data is being entered in the spreadsheet, a new document is created in your google drive which matches your submission and that an email has been sent.
It is useful to also configure the notification in the spreadsheet to get a message each time someone enrol, it is done by going to the menu Tools > Notification rules... and by choosing the options.


