const cav=document.querySelector('#cav');
const up=document.querySelector('#up');
const right=document.querySelector('#right');
const down=document.querySelector('#down');
const left=document.querySelector('#left');
const spButton=document.querySelector('#sp-button');
const spText=document.querySelector('#sp-text');
const spTextContent=['CONTINUE','STOP'];
const resetButton=document.querySelector('#reset-button');
const resetText=document.querySelector('#reset-text');
const scoreText=document.querySelector('#score');
const box=cav.getContext('2d');
const scoreRowText="SCORE:";
const backGroundColor="Snow";
const canvasBackGroundColor="snow";

let size=480;//canvas的宽度和长度
let cellNum=20;//canvas 中一行的格子数
let edgeSize=-0.0001;//格子间的缝的大小

(function (){
    (function init(){
        let width = window.innerWidth;
        if (width < 600) {
            size = 300;
            cellNum = 20;
        }
        else{
            size = 480;
            cellNum=20;
        }

        cav.width = size;
        cav.height = size;

        spText.innerText = 'START';
        resetText.innerText = 'RESET';
        window.onresize=init;
    })();
    (function ready(){
        cav.style.backgroundColor=canvasBackGroundColor;
        for(let i=0;i<cellNum*cellNum;i++){
            draw(i,backGroundColor);
        }
    })();
}
)();