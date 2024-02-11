class GameStart extends GuaScene {
    constructor(game) {
        super(game)
        //var title = GuaImage.new(game, 'start')
        game.registerAction('k', function () {
            var s = SceneTitle.new(game)
            game.replaceScene(s)
        })
        var bg = GuaImage.new(game, 'bg')
        bg.x = 0
        bg.y = 0
        bg.w = 288 * 1.5
        bg.h = 512 * 1.5
        this.addElement(bg)
        //looping ground
        this.grounds = []
        for (var i = 0; i < 30; i++) {
            var g = GuaImage.new(game, 'ground')
            g.x = i * 19
            g.y = 550
            this.addElement(g)
            this.grounds.push(g)
        }
        this.skipCount = 4
        var ui = GameStartUI.new(game)
        this.addElement(ui)

    }
    update() {
        super.update()
        //ground move
        this.skipCount--
        var offset = -5
        if (this.skipCount == 0) {
            this.skipCount = 4
            offset = 15
        }
        for (var i = 0; i < 30; i++) {
            var g = this.grounds[i]
            g.x += offset
        }
    }
}

class GameStartUI {
    constructor(game) {
        this.gg = GuaImage.new(game, 'start')
        this.game =game

    }
    static new(game) {
        return new this(game)
    }
    update() {

    }
    draw() {
        var context = this.game.context
        context.drawImage(this.gg.texture, 75, 200, this.gg.w, this.gg.h)
    }
}