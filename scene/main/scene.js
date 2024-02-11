const randomBetween = function(start, end) {
    var n = Math.random() * (end - start + 1)
    return Math.floor(n + start)
}



var aInb = function (x, x1, x2) {
    return x >= x1 && x <= x2
}

class Pipes {
    constructor(game) {
        this.game = game
        this.life = true
        this.pipes = []
        this.pipeSpace = 200
        this.pipeGap = 220
        this.columsOfPipe = 3
        for (var i = 0; i <  this.columsOfPipe; i++) {
            var p1 = GuaImage.new(game, 'pipe')
            p1.flipY = true
            p1.x = 500 + i * this.pipeGap
            var p2 = GuaImage.new(game, 'pipe')
            p2.x = p1.x
            this.resetPipePosition(p1, p2)
            this.pipes.push(p1)
            this.pipes.push(p2)
        }
    }
    static new(game) {
        return new this(game)
    }
    resetPipePosition(p1, p2) {
        p1.y = randomBetween(-200, 0)
        p2.y = p1.y + p1.h + this.pipeSpace
    }
    debug() {
        this.pipeGap = config.pipeGap.value
        this.pipeSpace = config.pipe_space.value
    }
    update() {
        for (var i = 0; i < this.pipes.length / 2; i += 2) {
            var p1 = this.pipes[i]
            var p2 = this.pipes[i + 1]
            p1.x -= 5
            p2.x -= 5
            if (p1.x < -100) {
                p1.x += this.pipeGap *  this.columsOfPipe
            }
            if (p2.x < -100) {
                p2.x += this.pipeGap *  this.columsOfPipe
                this.resetPipePosition(p1, p2)
            }

        }
    }
    draw() {
        var context = this.game.context

        for (var p of this.pipes) {
            context.save()
            var w2 = p.w / 2
            var h2 =p.h / 2
            context.translate(p.x + w2, p.y + h2)
            var scaleX = p.flipX ? -1 : 1
            var scaleY = p.flipY ? -1 : 1
            context.scale(scaleX,scaleY)

            context.rotate(p.rotation * Math.PI / 180)
            context.translate(-w2, -h2)
            context.drawImage(p.texture, 0, 0, p.w, p.h)

            context.restore()
        }
    }
    collide(a, b) {
        if (aInb(a.x, b.x, b.x + b.w) || aInb(b.x, a.x, a.x + a.w)) {
            if (aInb(a.y, b.y, b.y + b.h) || aInb(b.y, a.y, a.y + a.h)) {
                return true
            }
        }
        return false


        // return this.life && (recIntersects(a, b) || recIntersects(b, a))
    }
}

class GameOver {
    constructor(game) {
        this.gg = GuaImage.new(game, 'over')
        this.game =game

    }
    static new(game) {
        return new this(game)
    }
    update() {

    }
    draw() {
        var context = this.game.context
        context.drawImage(this.gg.texture, 90, 200, this.gg.w, this.gg.h)
    }
}

class SceneTitle extends GuaScene {
    constructor(game) {
        super(game)
        // var label = GuaLabel.new(game, 'hello from game')
        // this.addElement(label)

        //bg
        var bg = GuaImage.new(game, 'bg')
        bg.x = 0
        bg.y = 0
        bg.w = 288 * 1.5
        bg.h = 512 * 1.5
        log('bg: ', bg)
        this.addElement(bg)
        //add pipes
        this.pipe = Pipes.new(game)
        this.addElement(this.pipe)
        //ground looping
        this.grounds = []
        for (var i = 0; i < 30; i++) {
            var g = GuaImage.new(game, 'ground')
            g.x = i * 19
            g.y = 550
            this.addElement(g)
            this.grounds.push(g)
        }
        this.skipCount = 4
        //player
        this.birdSpeed = 2
        var bird = GuaAnimation.new(game)
        bird.x = 180
        bird.y = 200
        bird.w = 34 * 1.2
        bird.h = 24 * 1.2
        this.bird = bird
        this.addElement(bird)



        this.setupInputs()
    }
    debug() {
        // this.birdSpeed = config.bird_speed.value
    }
    update() {
        super.update()
        //ground moving
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

        //-------------------
        for (var i = 0; i < this.pipe.pipes.length; i++) {
            var p = this.pipe.pipes[i]
            if (this.pipe.collide(p, this.bird)) {
                log('collide')
                var game = this.game
                var end = SceneEnd.new(this.game)
                var s = GameStart.new(this.game)
                this.bird.life = false
                var over = GameOver.new(game)
                this.addElement(over)
                if (this.bird.life === false) {
                    game.registerAction('r', function () {
                        game.replaceScene(s)
                    })
                }
                function ends (game, end) {
                    setTimeout(function () {
                        //game.replaceScene(end)
                    }, 0)
                }
                ends(game, end)
            }
        }
        //-------------------

    }

    setupInputs() {
        var self = this
        var b = this.bird

        this.game.registerAction('a', function (keyStatus) {
            if (b.life === true) {
                b.move(-self.birdSpeed, keyStatus)
            }
        })
        this.game.registerAction('d', function (keyStatus) {
            if (b.life === true) {
                b.move(self.birdSpeed, keyStatus)
            }
        })
        this.game.registerAction('j', function (keyStatus) {
            //log('b.life: ', b.life)
            if (b.life === true) {
                b.jump()
            }
        })
    }
}