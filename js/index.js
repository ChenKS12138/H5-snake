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
const snackColor="#008B00";
const canvasBackGroundColor="snow";
const foodColor="#FFD700";

let size=400;//canvas的宽度和长度
let cellNum=20;//canvas 中一行的格子数
let edgeSize=1;//格子间的缝的大小

(function init(){
    let width=window.screen.width;
    if(width<1000){
        size=300;
        cellNum=20;
    }

    cav.width=size;
    cav.height=size;

    spText.innerText='START';
    resetText.innerText='RESET';
})()

function draw(point,color){
    // point 取值0-624
    //  每行有25个格子
    // 0-24 为第一行,以此类推
    box.fillStyle=color;
    box.fillRect((point%cellNum)*(size/cellNum)+1,(~~(point/cellNum))*(size/cellNum)+edgeSize,(size/cellNum)-2*edgeSize,(size/cellNum)-2*edgeSize);
}

function Snake() {
    let body= new Array(23,22,21);//第一个元素为蛇的头
    //point 表示蛇的头
    let direction=1;// 1为向右，-1为向左，25为向下，-25为向上
    let pop;
    let point;


    function move(){
        let body=this.body;
        let direction=this.direction;
        let point=body[0];
        this.pop=body.pop();
        body.unshift(point+direction);
        this.point=body[0];
        return this.pop;
    }
    function crash(){
        let body=this.body;
        let point=body[0];
        let direction=this.direction;
        if((direction===-cellNum&&point>-1&&point<cellNum)||(direction===cellNum&&point>(cellNum*cellNum-cellNum-1)&&point<(cellNum*cellNum))||(direction===-1&&(point)%cellNum===0)||(direction===1&&(point+1)%cellNum===0)){
            return 2;
        }
        if(body.lastIndexOf(point)!==0){
            return 1; 
        }
        else{
            return 0;
        }
    }
    function getFood(position){
        let body=this.body;
        let pop=this.pop;
        let point=body[0];
        if(position===point){
            snake.body.push(pop);
            return 1;
        }
        else{
            return 0;
        }
    }
    function changeDirection(dir){
        switch(dir){
            case 'up': 
                if(this.direction!==cellNum){
                    this.direction=-cellNum;
                };
                break;
            case 'down':
                if(this.direction!==-cellNum){
                    this.direction=cellNum;
                }
                break;
            case 'left':
                if(this.direction!==1){
                    this.direction=-1;
                }
                break;
            case 'right':
                if(this.direction!==-1){
                    this.direction=1;
                }
                break;
        }
    }

    return {
        body:body,
        direction:direction,
        move:move,
        crash:crash,
        getFood:getFood,
        changeDirection:changeDirection,
    }
}
function Food(){
    let foodExist;
    let position;
    function createFood(snakeBody){
        foodExist=this.foodExist;
        let randPosition=(~~(Math.random()*1000)%(cellNum*cellNum-2));
        while(snakeBody.indexOf(randPosition)!==-1){
            randPosition=(~~(Math.random()*1000)%(cellNum*cellNum-2));
        }
        this.position=randPosition;
        draw(this.position,foodColor);
    }
    return{
        foodExist:foodExist,
        createFood:createFood,
        position:position,
    }
}

function Controller(snake,food){
    let work=true;
    let pop;
    let t;
    let speed=200;
    function pause(changeContent){
        work=!work;
        if(!changeContent){
            spText.innerText=spTextContent[~~work];
        }
    }
    function direction(direc){
        if(work){
            snake.changeDirection(direc);
        }
    }
    function Speed(value){
        if(value){
            speed=value;
        }
        return speed;
    }
    function Render(){
        draw(pop,backGroundColor);
        snake.body.map(function(value,index){
            draw(value,snackColor);
        });
    }
    function action(){
        
        if(work){
            if(snake.crash()){
                clearTimeout(t);
                work=!work;
                setTimeout(function(){
                    alert('HAHAHAHAHA你输了!');
                },200);
            }
            else{
                Render();
                pop=snake.move();
            }
            if(!food.foodExist){
                food.createFood(snake.body);
                food.foodExist=true;
            }
            if(snake.getFood(food.position)){
                score++;
                speed=Speed(speed*0.97);
                console.log(Speed());
                food.foodExist=false;
                scoreText.innerText=scoreRowText+String(score);
            }
        }
        Render();
        t=setTimeout(action,Speed());        
    }
    function interval(){
        t=setTimeout(action,Speed());
        pause(true);
    }
    return{
        interval:interval,
        pause:pause,
        direction:direction,
        Speed:Speed,
    }
}

(function ready(){
    cav.style.backgroundColor=canvasBackGroundColor;
    for(let i=0;i<cellNum*cellNum;i++){
        draw(i,backGroundColor);
    }
})();

let snake=new Snake();
let food=new Food();
let controller=new Controller(snake,food);
let score=0;

(function main(){
    food.foodExist=false;
    scoreText.innerText=scoreRowText+String(score);

    controller.interval();

    document.addEventListener('keydown',function(e){
        switch(e.keyCode){
            case 38:
            case 87:
                controller.direction('up');
                e.returnValue=false;
            case 40:
            case 83:
                controller.direction('down');
                e.returnValue=false;
                break;
            case 37:
            case 65:
                controller.direction('left');
                e.returnValue=false;
                break;
            case 39:
            case 68: 
                controller.direction('right');
                e.returnValue=false;
                break;
            case 80:
            case 32:
            case 13:
                spButton.click();
                e.returnValue=false;
                break;
            case 82:
                resetButton.click();
                e.returnValue=false;
        }
    });
    
    up.addEventListener('click',function(){
        controller.direction('up');
    });
    right.addEventListener('click',function(){
        controller.direction('right');
    });
    down.addEventListener('click',function(){
        controller.direction('down');
    });
    left.addEventListener('click',function(){
        controller.direction('left');
    });

    spButton.addEventListener('click',function(){
        controller.pause();
    })
    resetButton.addEventListener('click',function(){
        window.location.reload();
    })
})();

(function dev(){
    let li=document.querySelectorAll('li');
    li.forEach(function(value){
        value.addEventListener('click',function(){
            alert('开发中!\n敬请期待');
        })
    })
})()
