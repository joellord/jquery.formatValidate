<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
        
        <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
        <script type="text/javascript" src="jquery.formatvalidate.js"></script>
        <script>
        $(document).ready(function() {
            $('#myForm').formatValidate({
                keepFocus: true,
                customMessages: {
                    fvCurrency: 'Not valid',
                    fvRequired: 'Rqeuired !'
                }
            });    
        });
        </script>
        
    </head>
    <body>
        <form id="myForm">
            <div class="control-group">
                <label class="control-label" for="inputName">
                    Text Input
                </label>
                <div class="controls">
                    <input type="text" id="inputName" placeholder="Text" class="fvEmail fvRequired"/>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="second">
                    Text Input
                </label>
                <div class="controls">
                    <input type="text" id="second" placeholder="Text" class="fvRequired fvCapitalize" data-fvcurrency-message="Error!"/>
                </div>
            </div>            

            <div class="control-group">
                <label class="control-label" for="third">
                    Text Input
                </label>
                <div class="controls">
                    <input type="text" id="third" placeholder="Text" class="fvPhone" data-fvMinLength-length="4" data-fvMustMatch-other="#fourth" data-fvMustMatch-message="No match"/>
                </div>
            </div>            

            <div class="control-group">
                <label class="control-label" for="foruth">
                    Text Input
                </label>
                <div class="controls">
                    <input type="text" id="fourth" placeholder="Text" class="fvPostalCode" data-fvMustMatch-other="#third" data-fvMustMatch-message="No match"/>
                </div>
            </div>  
            
            <input type="submit" value="Send">
        </form>
    </body>
</html>
