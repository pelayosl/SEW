class Fondo {

    constructor(){
        this.getImage()
    }

    getImage(){
        var flickrAPI = "https://www.flickr.com/services/rest/?";
            $.getJSON(flickrAPI, 
                    {
                        method: "flickr.photos.search",
                        api_key:"d1bf36e5e293db8730851ba07d0cd7ce",
                        text: "Jeddah Corniche Circuit",
                        per_page:10,
                        page:1,
                        tags: "Saudi Arabia",
                        format: "json",
                        nojsoncallback:1
                    })
                .done(function(data) {
                        var image = data.photos.photo[0];
                        
                        var url = `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_b.jpg`
                        $("html").css("height", "100%")
                        $("body")
                            .css("background-image", `url('${url}')`)
                            .css("background-position","center")
                            .css("background-repeat","no-repeat")
                            .css("background-size","cover")
                       
            });
    }

}

const fondo = new Fondo();