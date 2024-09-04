//TODO: Fix div text highlight issue. Currently disabled

class Content {
    
    constructor(bounds, load, unload, update, draw, layer) {
        this.bounds = bounds;
        this.load = load;
        this.data = null;
        this.unload = unload;
        this.update = update;
        this.draw = draw;
        this.layer = layer;
    }
}

class ImageContent extends Content {
    constructor(path, layer, x, y, w, h) {

        let imgBounds = new Bounds(x, y, w, h);
        let imgLoad = function() {
            this.data = {
                'img': null,
            }

            this.data.img = loadImage(path);
        }
        let imgUnload = function() {
            this.data = null;
        }
        let imgUpdate = function() {}
        let imgDraw = function() {
            image(this.data.img, 0, 0, this.bounds.w, this.bounds.h);
        }

        super(imgBounds, imgLoad, imgUnload, imgUpdate, imgDraw, layer);
    }
}

class DivContent extends Content {
    constructor(path, layer, x, y, w, h) {
        let divBounds = new Bounds(x, y, w, h);
        let divLoad = async function() {
            this.data = {
                'div': null,
            }
            
            const file = await fetch(path);
            this.data.div = document.createElement("div");
            this.data.div.innerHTML = await file.text();
            this.data.div.style.position = 'absolute';
            this.data.div.style.overflow = 'hidden';
            this.data.div.style.width = this.bounds.w + 'px';
            this.data.div.style.height = this.bounds.h + 'px';
            this.data.div.style.transformOrigin = 'top left';

            const loadedContent = document.getElementById("loadedContent");
            loadedContent.append(this.data.div);
        }
        let divUnload = function() {
            this.data.div.remove();
            this.data = null;
        }
        let divUpdate = function() {
            if (this.data.div != null) {
                this.data.div.style.left = (viewer.x + (centerOffset.x + this.bounds.x) * scl.value) + 'px';
                this.data.div.style.top = (viewer.y + (centerOffset.y + this.bounds.y) * scl.value) + 'px';
                this.data.div.style.transform = "scale(" + scl.value + "," + scl.value + ")";
            }
        }
        let divDraw = function() {}

        super(divBounds, divLoad, divUnload, divUpdate, divDraw, layer);
    }
}