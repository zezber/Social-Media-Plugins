    getInstagramPosts: function (showAll, callback) {
        if (!showAll) {
            socialMedia.makeDisplayNone();
            $("#InstagramAPICol").html("");
            $("#showInstagramTab").css("display", "block");
        }
        $.get(
           '/Home/GetInstagramPosts',
             function (result) {
                 result = JSON.parse(result);
                 debugger;
                 if (showAll) {
                     callback(result);
                 }
                 var postOrder = 0;
                 for (var i = 0; i < 8; i++) {
                     if (i === postOrder) {

                         //Lokasyon adı ve id si için null kontrolü
                         var locationName, locationId;
                         if (result.data[i].location != null) {
                             locationName = result.data[i].location.name;
                             locationId = result.data[i].location.id;
                         }
                         else {
                             locationName = " ";
                             locationId = "";
                         }

                         //Caption text i için null kontrolü
                         var captionText;
                         if (result.data[i].caption != null)
                             captionText = result.data[i].caption.text;
                         else
                             captionText = " ";

                         //Json data da text ve tag ler birleştirildiği için tag leri caption text den ayırıyoruz. 
                         var hashtagIndex = captionText.indexOf("#");
                         if (hashtagIndex !== -1) {
                             captionText = captionText.substring(0, hashtagIndex);
                         }

                         //Post a ait tag lere # ekliyoruz ve link veriyoruz.
                         var tag = "", tags = "";
                         for (j = 0; j < result.data[i].tags.length; j++) {
                             tag = "#" + result.data[i].tags[j];
                             tags = tags + '
                             <a target="_blank" href="https://www.instagram.com/explore/tags/' + 
                             result.data[i].tags[j] + '/">' + tag + '</a> ';
                         }

                         //Json data dan gelen sayısal veriyi tarih formatına dönüştürüyoruz.
                         var date = new Date(parseInt(result.data[i].created_time) * 1000);
                         date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + +date.getFullYear();

                         //Post görüntüsünü ve verileri yerleştirdiğimiz div i oluşturuyoruz.
                         captionText = captionText === "" ? "" : captionText.substring(0, 180) + '<br />';
                         var div = '<div class="item"><div class="well insta-media">
                         <div class="insta-container"><div class="insta-content">
                             <a target="_blank" href="' + result.data[i].link + '">
                                 <img src="' + result.data[i].images.standard_resolution.url + '" /></a>
                         <p>' + captionText + tags + '</p></div></div></div><div class="alt insta-alt">  
                             <img src="/Content/Images/genel-kullanim/instagran.svg"/><p>Shared</p></div>';

                         //Div'i ekrana basıyoruz. 
                         $("#InstagramAPICol").append(div);
                         postOrder = postOrder + 1;

                     }
                 }
             }
        );
    },
    getFacebookPosts: function (showAll, callback) {
        if (!showAll) {
            socialMedia.makeDisplayNone();
            $("#showFacebookPost").css("display", "block");
        }
        var fbRefreshTime, fbPostTime, fbToken, fbClientId, fbAppId;
        fbRefreshTime = 300;
        fbPostTime = 8;
        fbToken =
            "k|k";
        fbClientId = "k";
        fbAppId = "k";

        getFacebookPostv2(fbRefreshTime, fbPostTime, fbToken, fbClientId, fbAppId);

        function getFacebookPostv2(refreshTime, fbPostTime, fbToken, fbClientId, fbAppId) {

            //İlk kez çalıştırılır.
            runFacebookAPIv2(fbPostTime, fbToken, fbClientId, fbAppId);

        };

        //API fonksiyonu
        function runFacebookAPIv2(fbPostTime, fbToken, fbClientId, fbAppId) {

            var fbPosts = new Array();

            function init() {

                var j = 0;

                var token = fbToken;
                FB.api(
                    '/' + fbClientId + '/feed',
                    'GET',
                       { access_token: token, "fields": "message,permalink_url,picture,full_picture,created_time" },
                    function (response) {
                        var respo = [];

                        for (i = 0; i < 8; i++) {
                            respo.push(response.data[i]);
                            var message = response.data[i].message.length > 200 ? 
                                response.data[i].message.substring(0, 200) + "..." : response.data[i].message;
                            var url = response.data[i].permalink_url;
                            var pictureUrl = response.data[i].full_picture;
                            if (response.data[i].full_picture !== undefined) {
                                var div = '<div class="item"><div class="well facebook-media">
                                <div class="insta-content"><a target="_blank" href="' + url + '">
                                    <img src="' + pictureUrl + '"/></a><p>' + message + '</p></div></div>
                                        <div class="alt facebook-alt"><i class="fa fa-facebook"></i><p>Posted</p></div>';

                            }
                            else {
                                var div = '<div class="item">
                                <div class="well facebook-media"><div class="insta-content">
                                    <a target="_blank" href="' + url + '"></a><p>' + message + '</p></div></div>
                                        <div class="alt facebook-alt"><i class="fa fa-facebook"></i><p>Posted</p></div>';

                            }
                            $("#FacebookAPICol").append(div);
                        }
                        if (showAll) {
                            callback(respo);
                        }

                        FB.XFBML.parse();
                    }

                );
                //FB.api('/me/feed', 'post', { message: 'Eğitimlerimizi kaçırmayın!', access_token: "k" }, function (response) {
                //    console.log('API response', response);
                //});
            };

            window.fbAsyncInit = function () {

                FB.init({
                    appId: fbAppId,
                    xfbml: true,
                    version: 'v2.11'
                });

                init();

            };

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/tr_TR/sdk.js#xfbml=1&version=v2.11&appId=k";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

        };
    },
    getTwitterPosts: function (showAll, callback) {
        if (!showAll) {
            socialMedia.makeDisplayNone();
            $("#TwitterAPICol").html("");
            $("#showTwitterPosts").css("display", "block");
        }
        $.ajax({
            url: "/Egitim/GetUserTwits",
            type: "Post",
            success: function (response) {
                if (showAll) {
                    callback(response);
                }
                var postOrder = 0;
                for (var i = 0; i < response.length; i++) {
                    var div = '<div class="item"><div class="well twit-media">' +
                        response[i].Text.substring(0, 200)
                    +
                        '</div>
                    <div class="alt twit-alt"><i class="fa fa-twitter"></i><p>Tweeted</p></div>';

                    //Div'i ekrana basıyoruz. 
                    $("#TwitterAPICol").append(div);
                    postOrder = postOrder + 1;
                }
            }
        });
    },
    getLinkednPosts: function (showAll, callback) {
        if (!showAll) {
            socialMedia.makeDisplayNone();
            $("#LinkednAPICol").html("");
            $("#showLinkednPosts").css("display", "block");
        }
        $.ajax({
            url: "/Egitim/GetLinkedinPosts",
            type: "Get",
            success: function (responseFromServer) {
                var response = JSON.parse(responseFromServer);
                if (showAll) {

                    callback(response.values);
                }
                var postOrder = 0;
                for (var i = 0; i < response.values.length; i++) {
                    var div = '<div class="item">
                    <div class="well linkedin-media">' + 
                    response.values[i].updateContent.companyStatusUpdate.share.comment.substring(0, 200) + 
                        '</div>
                    <div class="alt linkedin-alt"><i class="fa fa-linkedin"></i><p>Shared</p></div>';
                    $("#LinkednAPICol").append(div);
                    postOrder = postOrder + 1;
                }
            }
        });
    },
    getYoutubePosts: function (showAll, callback) {
        if (!showAll) {
            socialMedia.makeDisplayNone();
            $("#YoutubeAPICol").html("");
            $("#showYoutubePosts").css("display", "block");
        }
        $.get(
            "/Egitim/GetYoutubeVideos",
            function (response) {
                response = JSON.parse(response);
                if (showAll) {
                    callback(response.items)
                }
                var postOrder = 0;
                for (var i = 0; i < response.items.length; i++) {
                    var div = '<div class="item"><div class="well youtube-media">
                    <a target="_blank" href="https://www.youtube.com/watch?v=' + response.items[i].id.videoId + '">
                        <img class="youtube-media-image" src="' + 
                    response.items[i].snippet.thumbnails.medium.url + '"/><p>' +
                    response.items[i].snippet.title + '</p>
                    <div class="play-video-homepage"></div></div></a>
                    <div class="alt youtube-alt"><i class="fa fa-youtube"></i><p>Shared</p></div>';
                    //Div'i ekrana basıyoruz. 
                    $("#YoutubeAPICol").append(div);
                    postOrder = postOrder + 1;
                }
            }
        );
    },
    getSlideSharePosts: function (showAll, callback) {
        if (!showAll) {
            socialMedia.makeDisplayNone();
            $("#SlideShareAPICol").html("");
            $("#showSlideSharePosts").css("display", "block");
        }
        $.ajax({
            url: "/Egitim/GetSlideShares",
            type: "Get",
            success: function (response) {
                var responses = JSON.parse(response);
                if (showAll) {
                    callback(responses);
                }
                var postOrder = 0;

                for (var i = 0; i < responses.User.Slideshow.length; i++) {
                    var div = '<div class="item"><div class="well slideshare-media">' + 
                        responses.User.Slideshow[i].Embed.replace("from", "") + 
                        '</div><div class="alt slideshare-alt"><i class="fa fa-slideshare"></i><p>Shared</p></div>';

                    $("#SlideShareAPICol").append(div);
                    postOrder = postOrder + 1;
                }
            },
            error: function () {
                console.log("bir hata oluştu")
            }
        });
    },
