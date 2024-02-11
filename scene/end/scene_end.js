class SceneEnd extends GuaScene {
    constructor(game) {
        super(game)
        game.registerAction('r', function () {
            var s = SceneTitle.new(game)
            game.replaceScene(s)
        })
    }

    draw() {
        this.game.context.fillText('Game Over，Press r Back to Menu', 100, 290)
    }
}