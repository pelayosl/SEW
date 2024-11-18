class Fondo {

    constructor(){
        this.getImage()
    }

    getImage(){
        var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
            $.getJSON(flickrAPI, 
                    {
                        tags: "Mercedes AMG Petronas",
                        tagmode: "any",
                        format: "json"
                    })
                .done(function(data) {
                        var image = data.items[2].media.m.replace("_m.jpg", "_b.jpg");
                        $("body").css({
                            "background-image": `url(${image})`,
                            "background-size": "cover",          
                            "background-position": "center",    
                            "background-repeat": "no-repeat",  
                        });
                       
            });
        
        
    }

}

const fondo = new Fondo();