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

(function( $ ){

  $.fn.formatValidate = function( options ) {  

    //Default settings
    var settings = $.extend( {
        'invalidClass': 'warning',
        'keepFocus': true,
        'showConsoleMessages': true
    }, options);
    
    //Set the default messages and add them to the settings object
    var defaultMessages = {
        'fvCurrency': 'Not a valid amount',
        'fvRequired': 'This field is required',
        'fvMustMatch': 'Fields must match',
        'fvEmail': 'Not a valid email address',
        'fvMinLength': 'Not long enough',
        'fvPostalCode': 'Invalid postal code, must be in A0A 0A0 format',
        'fvPhone': 'Invalid phone number, must be in (000)000-0000 format'
    };
    settings.validationMessages = defaultMessages;
    
    //Various functions for this plugin
    var processes = {
        //Is triggered when an element is not valid
        invalidElement: function(el, className) {
            //Get the error message
            var keepFocus = this.getParam(el, className, 'keepFocus');

            //Add the invalid messages
            this.addInvalid(el, className)

            //Set the form element as invalid
            el.addClass('invalidFormElement');
            //Set focus back if needed (except for fvMustMatch fields)
            if(keepFocus && className != 'fvMustMatch') {
                el.focus();
            }
        },
        //Adds the invalid classes and messages
        addInvalid: function(el, className) {
            //Get parameters
            var invalidClass = this.getParam(el, className, 'invalidClass');
            var errorMessage = this.getParam(el, className, 'message');

            //Add error messages
            el.parent().append(
                    $('<span>').addClass('help-inline').addClass(invalidClass).html(errorMessage)
                );
            el.parent().parent().addClass(invalidClass);            
        },
        //Removes the invalid classes and messages
        removeInvalid: function(el, className) {
            //Get parameters
            var invalidClass = this.getParam(el, className, 'invalidClass');
            //Remove all error messages added by addInvalid()
            el.siblings('span.' + invalidClass).remove();
            el.parent().parent().removeClass(invalidClass);
            el.removeClass('invalidFormElement');            
        },
        //Get the value of a given parameter.  Will start by looking for a 
        //data-className-parameter attribute and if not found, will look in the
        //settings
        getParam: function(el, className, paramName) {
            //Check for the data-attribute
            var param = el.attr('data-' + className + '-' + paramName);
            //If the attribute had true or false, convert from string to bool
            if(param == "false") param = false;
            if(param == "true") param = true;
            //If nothing was found, fetch the default
            if(param == undefined) {
                //Messages are treated differently
                if(paramName == 'message') {
                    param = settings.customMessages[className];
                    if(param == undefined) param = settings.validationMessages[className];
                } else {
                    param = settings[paramName];
                }
            }
            
            return param;
        },
        //Check if a parameters is a function
        isFunction: function(functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        }
    };

    //Check if the isValid and isInvalid parameters were passed to the settings
    //If they were, override the default functionalities
    if(settings.isValid && processes.isFunction(settings.isValid)) {
        processes.removeInvalid = settings.isValid;
    }
    if(settings.isInvalid && processes.isFunction(settings.isInvalid)) {
        processes.addInvalid = settings.isInvalid;
    }
    
    //Various conversions
    var to = {
        //Converts the value to a currency (no whitespace and no cash sign, commas converted to periods)
        Currency: function(val) {
            //Remove cash signs
            val = this.NoWhiteSpace(val.replace('$', ''));
            //Replace commas with dots
            val = val.replace(',', '.');
            //Add trailing zeros
            var lastThree = val.substr(-3,3);
            if (lastThree.length < 3) {
                lastThree.length == 2 ? lastThree = "0" + lastThree : lastThree = "00" + lastThree;
            }
            var digitPos = lastThree.indexOf(".");
            if(digitPos == -1) {
                val+=".";
                digitPos = 2;
            }
            for (var i = 0; i < digitPos; i++) {val += "0";}
            
            return val;
        },
        //Capitalize the first letter of each word
        Capitalize: function(val) {
            val = val.split(' ');
            var formattedArray = [];
            for(var i = 0; i < val.length; i++) {
                formattedArray[i] = to.CapitalizeFirst(to.NoWhiteSpace(val[i]));
            }
            return formattedArray.join(' ');            
        },
        //Removes trailing or starting whitespaces
        NoWhiteSpace: function(val) {
            return val.replace(/(^\s*)|(\s*$)/g, "");
        },
        //Capitalize the first letter of a string
        CapitalizeFirst: function(val) {
            return val.substr(0, 1).toUpperCase() + val.substr(1).toLowerCase();
        },
        //Convert the string to all upper case
        Upper: function(val) {
            return val.toUpperCase();
        },
        //Format the postal code with a space in the middle
        PostalCode: function(val) {
            val = to.Upper(val);
            if(val.indexOf(" ") < 0) val = val.substr(0,3) + " " + val.substr(-3, 3);  
            return val;
        },
        //Format the phone in a (xxx)xxx-xxxx format
        Phone: function(val) {
            //Remove spaces, parenthesis and dashes
            val = val.replace(' ', '');
            val = val.replace('(', '');
            val = val.replace(')', '');
            val = val.replace('-', '');
            //Add the parenthesis and dashes at the right places
            val = '(' + val.substr(0,3) + ')' + val.substr(3, 3) + '-' + val.substr(6, 4);
            return val;
        }
    }
    
    //Check all elements of the form
    return this.each(function() {   
        var currentForm = $(this);
        
        //Look for the fields that need formatting or validation
        
        //Required
        $('.fvRequired').each(function() {
            $(this).blur(function() {
                //Remove error classes
                processes.removeInvalid($(this), 'fvRequired');
                
                //Validation
                if(to.NoWhiteSpace($(this).val()) != "") {
                    //Valid
                    //No reformatting ...   Do nothing
                } else {
                    //Invalid
                    processes.invalidElement($(this), 'fvRequired');
                }
            })
        });
        
        //Minimum Length
        $('.fvMinLength').each(function() {
            $(this).blur(function() {
                processes.removeInvalid($(this), 'fvMinLength');
                var minLength = processes.getParam($(this), 'fvMinLength', 'length');
                
                if(minLength == undefined) {
                    console.log('#' + $(this).attr('id') + ': Missing data attribute data-fvMinLength-length');
                } else {
                    if(to.NoWhiteSpace($(this).val()).length >= minLength) {
                        //Valid
                        //No formatting...  Do nothing
                    } else {
                        //Invalid
                        processes.invalidElement($(this), 'fvMinLength');
                    }
                }
            });
        });
        
        //Postal Code (Canadian)
        $('.fvPostalCode').each(function() {
            $(this).blur(function() {
                processes.removeInvalid($(this), 'fvPostalCode');
                
                if($(this).val().match( /([A-Z][0-9][A-Z])\ ?[0-9][A-Z][0-9]/i )) {
                    //Valid
                    //Switch to upper case and add a space after the third character
                    $(this).val(to.PostalCode($(this).val()));
                } else {
                    //Invalid
                    processes.invalidElement($(this), 'fvPostalCode');
                }
            });
        });
        
        //Phone number (North America)
        $('.fvPhone').each(function() {
            $(this).blur(function() {
                processes.removeInvalid($(this), 'fvPhone');
                if($(this).val().match( /(\(?)([0-9]{3})(\-| |\))?([0-9]{3})(\-)?([0-9]{4})/ )) {
                    //Valid
                    //Reformat as (000)000-0000
                    $(this).val(to.Phone($(this).val()));
                } else {
                    //Invalid
                    processes.invalidElement($(this), 'fvPhone');
                }
            });
        });
        
        //Must match another field
        $('.fvMustMatch').each(function() {
            $(this).blur(function() {
                processes.removeInvalid($(this), 'fvMustMatch');
                
                //Get the other field
                var otherField = processes.getParam($(this), 'fvMustMatch', 'other');
                if(otherField == undefined || $(otherField).length <= 0) {
                    //Give a warning to the web site designer
                    //Leave this message
                    console.log('#' + $(this).attr('id') + ': You seem to be missing a data-fvMustMatch-other or the other field was not found');
                } else {
                    //Also remove invalid messages for the other field
                    processes.removeInvalid($(otherField), 'fvMustMatch');
                    
                    //Validation
                    if($(otherField).val() == $(this).val()) {
                        //Valid
                        //No reformatting...  Do nothing
                    } else {
                        //Invalid
                        processes.invalidElement($(this), 'fvMustMatch');
                        //Also add the message to the other field
                        processes.invalidElement($(otherField), 'fvMustMatch');
                    }
                }
                
            });
        });
        
        //Currency
        $('.fvCurrency').each(function() {
            $(this).blur(function() {
                //Remove error classes
                processes.removeInvalid($(this), 'fvCurrency');
                
                //Validation
                if(to.NoWhiteSpace($(this).val()).match( /^\$?([0-9]{1,3}(,| )([0-9]{3}(,| ))*[0-9]{3}|[0-9]+)((.|,)[0-9]{0,2})?$/ )) {
                    //Valid
                    //Replace current value with formatted value
                    $(this).val(to.Currency($(this).val()));
                } else {
                    //Invalid
                    //Get the error message
                    processes.invalidElement($(this), 'fvCurrency');
                }
            });
        });
        
        //Email
        $('.fvEmail').each(function() {
            $(this).blur(function() {
                processes.removeInvalid($(this), 'fvEmail');
                //Validation
                if(to.NoWhiteSpace($(this).val()).match( /[0-9a-z]+\@([0-9a-z]{3,64}).[a-z]{2,4}(.[a-z]{2,4}){0,2}/ )) {
                    //Valid
                    $(this).val(to.NoWhiteSpace($(this).val()));
                } else {
                    //Invalid
                    processes.invalidElement($(this), 'fvEmail');
                }
            });
        });
        
        //Formatting only, no validation

        //Capitalize
        $('.fvCapitalize').each(function() {
            $(this).blur(function() {
                $(this).val(to.Capitalize($(this).val()));
            });
        });        

        //No White space
        $('.fvNoWhiteSpace').each(function() {
            $(this).blur(function() {
                $(this).val(to.NoWhiteSpace($(this).val()));
            });
        });
        
        //Upper case
        $('.fvUpperCase').each(function() {
            $(this).blur(function() {
                $(this).val(to.Upper($(this).val()));
            });
        });
        
        currentForm.submit(function(e) {
            if(currentForm.find('.invalidFormElement').length) (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
        });
    });

  };
})( jQuery );
