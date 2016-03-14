$(document).ready(function(){
    showModalVideo();
    closeModalVideo();
    nextPageEvent();
    prevPageEvent();
});

var nextPageToken = "";
var prevPageToken = "";


// After the API loads, call a function to enable the search box.
function handleAPILoaded() {

 var query = getParameterByName("query");
 var pageToken = getParameterByName("pageToken");
    if(query != null && query != ""){
        searchData(query, pageToken);
    }
  $('.search-button').attr('disabled', false);
    $(".search-button").click(function (){
        var q = $(this).parent().prevAll(".query").val();
        if(q != null && q != ""){
            insertParam("query", q);
        }else{
            alert("Please input anything..");
        }
    }
    );
}

function searchData(query, token){
     //if (token != null) token
     $(".query").val("");
          var request = gapi.client.youtube.search.list({
            q: query,
            part: 'snippet',
            pageToken: token,
            type: 'video',
            maxResults: '20'
          });

          request.execute(function(response) {
            renderData(response, query);
          });
}

function renderData(response ,keyword){
    //var str = JSON.stringify(response.result);
              //console.log(response.result);
              $("#video-container").empty();
              var rowCount = 0;
              var rowString = "";
              for(var i = 0; i < response.items.length ; i++){
                 rowCount++;
                var str = $("#video-template").html();
                if(rowCount == 1){
                    str = "<div class = 'row'>" + str; 
                }
                var item = response.items[i];
                str =  str.replace(/{video-thumb-default}/g, item.snippet.thumbnails.medium.url);
                str =  str.replace(/{video-name}/g, item.snippet.title);
                str =   str.replace(/{video-description}/g, item.snippet.description);
                str =   str.replace(/{video-id}/g, item.id.videoId);
                rowString = rowString + str;
                 
                  if(rowCount >= 3){
                      rowCount = 0;
                      rowString = rowString + "</div>";
                      $("#video-container").append(rowString);
                      rowString = "";
                  }
              }
    $("#search-header").addClass("hidden");
    $("#about").removeClass("hidden");
    $("#search-keyword").text(keyword);
    nextPageToken = response.nextPageToken;
    prevPageToken = response.prevPageToken;
    
    if(nextPageToken == undefined || nextPageToken == "" ){
        $("#next-cont").addClass("hidden");
    }
     if(prevPageToken == undefined || prevPageToken == "" ){
        $("#prev-cont").addClass("hidden");
    }
}

function showModalVideo(){
    $("body").on("click", ".modal-show-trigger", function(event){
        $("#iframe-container").empty();
        var iframeStr = $("#iframe-template").html();
        iframeStr = iframeStr.replace(/{{video-url}}/g, $(this).attr("id"));
         $("#iframe-container").append(iframeStr);
        $("#video-modal").modal("show");
        $(".modal-title").text($(this).text());
    });
}

function closeModalVideo(){
    $("#video-modal").on("hidden.bs.modal", function(event){
        $("#iframe-container").empty();
    });
}

function nextPageEvent(){
    $("body").on("click", ".next", function(event){
        insertParam("pageToken", nextPageToken);
    });
}

function prevPageEvent(){
    $("body").on("click", ".prev", function(event){
        insertParam("pageToken", prevPageToken);
    });
}


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
   // url = url.toLowerCase(); // This is just to avoid case sensitiveness
    name = name.replace(/[\[\]]/g, "\\$&"); //.toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function insertParam(key, value)
{
    key = encodeURI(key); value = encodeURI(value);

    var kvp = document.location.search.substr(1).split('&');
    var i=kvp.length; var x; while(i--) 
    {
        x = kvp[i].split('=');

        if (x[0]==key)
        {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }

    if(i<0) {kvp[kvp.length] = [key,value].join('=');}

    //this will reload the page, it's likely better to store this until finished
    document.location.search = kvp.join('&'); 
}
