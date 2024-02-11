var enableDebugMode = function (game, enable) {
    if (!enable) {
        return
    }
    window.paused = false
    window.addEventListener('keydown', function (event) {
        var k = event.key
        if (k === 'p') {
            //pause
            window.paused = !window.paused
        } else if ('1234567'.includes(k)) {

        }
    })
    //control game speed
    document.querySelector('#id-input-speed').addEventListener('input', function (event) {
        var input = event.target
        // log(event.target.parentNode, input.value)
        var fatherNode= event.target.parentNode
        var spanEle = fatherNode.querySelector('span')
        spanEle.innerHTML = input.value + 'fps'
        window.fps = Number(input.value)
    })
}

var _main = function () {
    var images = {
        //flappy bird images
        bg: 'img/bird/bg.png',
        pipe: 'img/bird/pipe.png',
        ground: 'img/bird/ground.png',
        b1: 'img/bird/b1.png',
        b2: 'img/bird/b2.png',
        b3: 'img/bird/b3.png',
        start: 'img/bird/getready.png',
        over: 'img/bird/gameover.png',
    }
    var game = Gua_game.instance(30, images, function(g) {
        //var s = Scene.new(g)
        var s = GameStart.new(g)
        g.runWithScene(s)
    })

    enableDebugMode(game,true)
}

_main()