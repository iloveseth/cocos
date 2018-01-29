// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        barCode: cc.Sprite,
        graphics: cc.Graphics,
        btnTest: cc.Button,
        showShot:cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var self =  this.barCode;
        cc.loader.loadRes('1.png', cc.SpriteFrame, function (err, spriteFrame) {
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
        qrcode.addData('iloveseth');
        qrcode.make();

        var ctx = this.graphics.getComponent(cc.Graphics);

        // compute tileW/tileH based on node width and height
        var tileW = this.graphics.node.width / qrcode.getModuleCount();
        var tileH = this.graphics.node.height / qrcode.getModuleCount();

        // draw in the Graphics
        for (var row = 0; row < qrcode.getModuleCount(); row++) {
            for (var col = 0; col < qrcode.getModuleCount(); col++) {
                // ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
                if (qrcode.isDark(row, col)) {
                    ctx.fillColor = cc.Color.BLACK;
                } else {
                    ctx.fillColor = cc.Color.WHITE;
                }
                var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
                ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                ctx.fill();
            }

        }
        cc.log(cc.sys.os);
        cc.log(cc.sys.language);
        cc.log(cc.sys.browserType);

        this.btnTest.node.on('click', 
            ()=>{
                cc.log('lzh love seth!');
                //if(CC_JSB) {
                    //如果待截图的场景中含有 mask，请使用下面注释的语句来创建 renderTexture
                    // var renderTexture = cc.RenderTexture.create(1280,640, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
                    var renderTexture = cc.RenderTexture.create(200,200);
        
                    //实际截屏的代码
                    renderTexture.begin();
                    //this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
                    this.barCode._sgNode.setAnchorPoint(0,0);
                    this.barCode._sgNode.visit();
                    this.barCode._sgNode.setAnchorPoint(0.5,0.5);
                    renderTexture.end();

                    var nowFrame = renderTexture.getSprite().getSpriteFrame();
                    this.showShot.spriteFrame = nowFrame;

                    var action = cc.flipY(true);
                    this.showShot.node.runAction(action);
                    cc.log("capture screen successfully!");
                    if(cc.sys.isNative ){
                        renderTexture.saveToFile("demo.png",cc.ImageFormat.PNG, true, function () {
                            cc.log(jsb.fileUtils.getWritablePath());
                        });
                    }
                    // renderTexture.saveToFile("demo.png",cc.ImageFormat.PNG, true, function () {
                    //     cc.log("capture screen successfully!");
                    // });
                    //打印截图路径

                //}
            },
            this);
    },

    // update (dt) {},
});
