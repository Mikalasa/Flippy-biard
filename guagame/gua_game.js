//Gua_game
class Gua_game {
    constructor(fps, images, runCallback) {
        window.fps = fps
        this.images = images
        this.runCallback = runCallback
        //
        this.scene = null
        this.actions = {}
        this.keydowns = {}
        this.canvas = document.querySelector('#id-canvas')
        this.context = this.canvas.getContext('2d')
        //events
        var self = this
        window.addEventListener('keydown', event => {
            this.keydowns[event.key] = 'down'
        })
        window.addEventListener('keyup', function (event) {
            self.keydowns[event.key] = 'up'
        })
        this.init()
    }

    static instance(...args) {
        this.i = this.i || new this(...args)
        return this.i
    }
    drawImage(img) {
        // img is a GuaImage
        //log('img.texture: ', img.texture)
        this.context.drawImage(img.texture, img.x, img.y, img.w, img.h)
    }
    //update
    update() {
        this.scene.update()
    }
    //draw
    draw() {
        this.scene.draw()
    }
    //
    registerAction(key, callback) {
        this.actions[key] = callback
    }
    runloop() {
        //log(window.fps)
        //events
        var g = this
        var actions = Object.keys(g.actions)
        for (var i = 0; i < actions.length; i++) {
            var key = actions[i]
            var status = g.keydowns[key]
            if (status == 'down') {
                g.actions[key]('down')
            } else if (status == 'up') {
                g.actions[key]('up')
                g.keydowns[key] = null
            }
        }
        //update
        this.update()
        //clean
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        //draw
        this.draw()
        //next run loop
        setTimeout(function () {
            g.runloop()
        }, 1000/window.fps)
    }
    textureByName(name) {
        var g = this
        //log('image by name', g.images)
        var img = g.images[name]
        // var image = {
        //     w: img.width,
        //     h: img.height,
        //     image: img,
        // }
        return img
    }

    runWithScene(scene) {
        var g = this
        this.scene = scene
        //start run
        setTimeout(function () {
            g.runloop()
        }, 1000/window.fps)
    }
    replaceScene(scene) {
        this.scene = scene
    }
    _star(scene) {
        this.runCallback(this)
    }

    init() {
        var g =this
        var loads = []
        //load images
        var names = Object.keys(this.images)
        for (var i = 0; i < names.length; i++) {
            let name = names[i]
            var path = this.images[name]
            let img = new Image()
            img.src = path
            img.onload = function () {
                //save to g.images
                g.images[name] = img
                //after images be loaded，invoke run
                loads.push(1)
                if (loads.length == names.length) {
                    //log('load images', g.images)
                    g._star()
                }
            }
        }
    }
}


