jquery.formatValidate
=====================

A jQuery plugin that validates and formats data in a form.  Used with basically no javascript, this library is so easy that even a graphic designer could use it.

Usage
=====

Initialize the plugin on the form.  All the rest is managed via the classes and attributes.  

Basic Usage
-----------

< form id='myform'>
< input type='text' class='fvRequired'><br />
< input type='text' class='fvCurrency'><br />
< /form>

< script>
$('#myform').formatValidate();
< /script>

Override via an HTML attribute
------------------------------

< form id='myform'>
< input type='text' class='fvRequired'><br />
< input type='text' class='fvCurrency' data-fvcurrency-message='Please enter a valid number, I will format it for you'><br />
< /form>

< < script>
< $('#myform').formatValidate();

< //Or with options
< var options = {};
< $('#myform').formatValidate(options);

< //Test test if a form is valid (Returns a bool)
< alert $('#myform').formatValidate().isValid();
< < /script>

Currently supported classes
===========================

Validation Classes
------------------
These classes will validate and reformat the data:
 * fvCurrency:      A validation/formatting class for currencies
 * fvEmail:         A validation class for emails
 * fvMustMatch:     A validation for two matching fields.  data-fvMustMatch-other attribute must be specified
 * fvRequire:       A validation for empty (or whitespaces) field
 * fvMinLength:     A validation for mininum length string.  data-fvMinLength-length attribute must be specified
 * fvPostalCode:    A validation for Canadian postal codes.  Reformats as "A0A 0A0"
 * fvInteger:       A validation for numbers with no decimals
 * fvUrlNoHttp:     A validation for Urls, without the http:// prefix.  Reformats as lower case
 * fvUrl:           A validation for Urls, this one automatically adds the http:// prefix.  Reformats as lower case
 * fvSocialSec:     A validation/formatting class for Canadian Social Security number. Reformats as "000 000 000"

Reformatting Classes
--------------------
These classes will only reformat the data, they will not do any validation:
 * fvCapitalize:    Convert the first letter of each word to a capital letter
 * fvCapitalizeFirst:   Convert the first letter of the string to a capital letter
 * fvNoWhiteSpace:  Strips all white space on the right and left of the field
 * fvUpperCase:     Convert the string to upper case
 * fvLowerCase:     Convert the string to lower case

Options
=======
The following options can be passed as parameters when calling the script or they can be set using data-classname-option HTML attribute (except for custom message which can be overridden by using data-classname-message):

 * invalidClass:       Takes a string as a parameter.  This is the class that is used for error messages (typically 'warning' or 'error').  Default is 'warning'.
 * keepFocus:          Takes a boolean as a parameter.  Sets whether the input keeps the focus if invalid.  Default is true.
 * showConsoleMessages:Takes a boolean as a parameter.  If set to true, some console messages will be displayed what an error is detected.  For example, a missing data attribute.  Default is true.
 * customMessages      Takes an object as a parameter.  Each custom message must be in the "className": "Message" form.  These message will override the application default messages.
 * isValid             Takes a function as a parameter.  This is the function that will be executed if the field is valid (typically, this removes error messages)
 * isInvalid           Takes a function as a parameter.  This is the function that will be executed if the field is invvalid (typically, this adds error messages)