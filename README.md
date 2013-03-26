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

< script>
$('#myform').formatValidate();
< /script>

Full details
============
/**
 * This jQuery plugin is used for validation and reformatting
 * 
 * @author Joel Lord
 * @version 0.2.20130321
 * 
 * Basic Usage
 * $('#myForm').formatValidate();
 * 
 * This will start the validation for the form.  Validation is on a field level
 * Every input should have a validation class according to what needs to be validated
 * Some validation classes need some parameters which are passed as data attributes.
 * A message will be shown in the console when trying to validate an element with 
 * a missing tag.
 * 
 * Validation Classes:
 * fvCurrency:      A validation/formatting class for currencies
 * fvEmail:         A validation class for emails
 * fvMustMatch:     A validation for two matching fields.  data-fvMustMatch-other attribute must be specified
 * fvRequire:       A validation for empty (or whitespaces) field
 * fvMinLength:     A validation for mininum length string.  data-fvMinLength-length attribute must be specified
 * fvPostalCode:    A validation for Canadian postal codes.  Reformats as "A0A 0A0"
 * 
 * Formatting Classes
 * fvCapitalize:    Convert the first letter of each word to a capital letter
 * fvCapitalizeFirst:   Convert the first letter of the string to a capital letter
 * fvNoWhiteSpace:  Strips all white space on the right and left of the field
 * fvUpperCase:     Convert the string to upper case
 * 
 * Data Attributes
 * Parameters can be adjusted on a field level by using the following data attributes
 * data-ValidationClass-message:    Changes the message to be displayed when field value is not valid
 * data-ValidationClass-invalidClass:   The class to use when the data is invalid
 * data-ValidationCalss-keepFocus:  Will prevent the user to change field when data is invalid (when set to anything other than "false")
 * 
 * Parameters
 * Other parameters can be called when loading the plugin
 * $('#myForm').formatValidate({
 *   'invalidClass': 'error',       //Changes the class to use when data is invalid for all fields ('warning' by default)
 *   'keepFocus': true,             //Prevents the user to change field when data is invalid for all fields (true by default)
 *   'showConsoleMessages' true,    //Will show console messages when a required data-attribute is missing (true by default)
 *   'customMessages': {
 *      'ValidationClass': 'Message'    //Changes the invalid field message for the class 'ValidationClass'
 *   }
 * });
 * 
 * Future development (@TODO)
 * Allow override of addInvalid and removeInvalid functions
 * Add validation for: Numeric, NumericWith2Digits, maxLength
 */
