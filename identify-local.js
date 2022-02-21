$("document").ready(function () {
    //do something
    $("#inputImage").change(function(e){
        processImage(e.target.files[0]);
    });
});

const subscriptionKey = "145686b14e0d45059c69bf80fb6b9cb6";

function processImage(imageObj) {
    
    //Prediction API
    var urlBase = "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/2679db1e-f715-486c-a14c-0c3f5a664a34/classify/iterations/Iteration2/image";

    var params = {
    };
    //Display the uploaded image
    var sourceImageUrl = URL.createObjectURL(imageObj);
    document.querySelector("#sourceImage").src = sourceImageUrl;
    //Upload the image
    $.ajax({
        url: urlBase + "?" + $.param(params),
        // Request header
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");
            xhrObj.setRequestHeader("Prediction-Key", subscriptionKey);
        },
        type: "POST",
        processData: false,
        contentType:false,
        // Request body
        data: imageObj
    })
    .done(function (data) {
       
        //展示JSON內容
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        var max = 0;
        var x = 0;
        data.predictions[max].probability = data.predictions[x].probability;
        for (x = 0; x < data.predictions.length; x++) {
        
            if (data.predictions[x].probability >= data.predictions[max].probability) {
                max = x;
                
            }
        }
        $("#picDescription").text(data.predictions[max].tagName + "奥运会的吉祥物");
        
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        //抛出错误
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};