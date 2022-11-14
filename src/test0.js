// ほんとにp5jsに依存しないで書けてるね
// よくできました

// だからといって速くなるわけじゃないけどな。

// objファイルのパースは...
// そしてsave機能は...

// fps120...そうなんだ。
// やっぱ機種依存みたいな感じなのね
// さしあたりこれをcopyPainterか何かで表示させたいわね
// 2D用意してちょ～

// 2DみたくpixelDensity = 2を使いたいけど使い方が謎
// まあぼちぼち学んでいくしかないね...

// https://maku77.github.io/js/canvas/size.html

// attributeとしてのwidth,heightとは別ってこと？？？

// あー、つまり描画バッファサイズは大きくとるけどstyleの方は
// 画面サイズに合わせてるのか。それにより相違が生じると。

const cvs = document.createElement('canvas');
cvs.id = 'defaultCanvas0';
cvs.classList.add('p5Canvas');
cvs.width = 256;
cvs.height = 256;
//cvs.elt.width = 256 * window.devicePixelRatio;
//cvs.elt.height = 256 * window.devicePixelRatio;
document.getElementsByTagName('main')[0].appendChild(cvs);
const ctx = cvs.getContext("webgl2");
const ex = wgex;
const _node = new ex.RenderNode(ctx);
const _timer = new ex.Timer();
// durationを1000に設定するとcheckがtrueを返すタイミングで
// タイマーがtrueを返しつつstumpを0にリセットする
// そのタイミングは最後にstumpを押してから1000ミリ秒後
// しかしpauseはどうしようね...
_timer.initialize("slot0", {duration:1000});
const vs =
`#version 300 es
in vec2 aPosition;
void main(){
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;
const fs =
`#version 300 es
precision highp float;
uniform float uTime;
out vec4 fragColor;
void main(){
  fragColor = vec4(0.5, uTime, 0.5, 1.0);
}
`;
_node.registPainter("paint", vs, fs);
let fps = 0;

let _pause = false;

function tick(timeStump){
  const currentTime = _timer.getDelta("slot0");
  _node.use("paint", "foxBoard")
       .setUniform("uTime", currentTime)
       .drawArrays("triangle_strip")
       .unbind()
       .flush();
  fps++;
  if(_timer.check("slot0")){
    console.log(fps);
    fps = 0;
  }
  if(_pause){ return; }
  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);

// 簡易的なnoLoop/loopの実装
// 単純に処理を止めたいならこんな感じになると思う
// ただまあ
// 使用中のタイマー全部に対してこれ止めるのめんどくさいわね...
// グループ化できればいいんだけど。もしくは全部とか。
// ていうかグループ化するためにクラスにしたんでしょうが（ねぇ）
// pauseAllとreStartAll実装しようかな。それでいける。
cvs.addEventListener("click", () => {
  _pause = !_pause;
  _timer.pause("slot0");
  if(!_pause){
    window.requestAnimationFrame(tick);
    _timer.reStart("slot0");
  }
});

// objファイルのパースは難しくないと思う（jsの文字列処理の
// 関数調べるのがめんどそうだけど）
// save機能...
// あーあとpixelDensityに相当するあれが...どうしようね。
