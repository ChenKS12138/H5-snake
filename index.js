const cav=document.querySelector('#cav');
const up=document.querySelector('#up');
const right=document.querySelector('#right');
const down=document.querySelector('#down');
const left=document.querySelector('#left');
const box=cav.getContext('2d');
const scoreRowText="SCORE:";
const backGroundColor="Snow";
const snackColor="#008B00";
const canvasBackGroundColor="snow";
const foodColor="#FFD700";
const speed=200;

let size=400;//canvas的宽度和长度
let cellNum=20;//canvas 中一行的格子数
let edgeSize=1;//格子间的缝的大小

const start=true;

cav.width=size;
cav.height=size;

function draw(point,color){
    // point 取值0-624
    //  每行有25个格子
    // 0-24 为第一行,以此类推
    box.fillStyle=color;
    box.fillRect((point%cellNum)*(size/cellNum)+1,(~~(point/cellNum))*(size/cellNum)+edgeSize,(size/cellNum)-2*edgeSize,(size/cellNum)-2*edgeSize);
}

(function ready(){
    cav.style.backgroundColor=canvasBackGroundColor;
    for(let i=0;i<Math.pow(cellNum,2);i++){
        draw(i,backGroundColor);
    }
})();

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
        // this.position=(~~(Math.random()*1000)%(cellNum*cellNum-2));
        this.position=randPosition;
        draw(this.position,foodColor);
    }
    return{
        foodExist:foodExist,
        createFood:createFood,
        position:position,
    }
}


let snake=new Snake();
let food=new Food();
let score=0;

(function(){
    food.foodExist=false;
    let pop;
    document.querySelector('#score').innerText=scoreRowText+String(score);
    if(start){
        let t=setInterval(function(){
        
            if(!food.foodExist){
                food.createFood(snake.body);
                food.foodExist=true;
            }
            if(snake.getFood(food.position)){
                score++;
                food.foodExist=false;
                document.querySelector('#score').innerText=scoreRowText+String(score);
            };
            
    
            
    
            if(snake.crash()){
                clearInterval(t);
                alert('你输了!\n刷新网页以重新开始');
            }
            pop=snake.move();
    
            snake.body.map(function(value,index){
                draw(value,snackColor);
            });
            draw(pop,backGroundColor);
        },speed);
    }
    document.addEventListener('keydown',function(e){
        switch(e.keyCode){
            case 38:
            case 87:
                snake.changeDirection('up');
                break;
            case 40:
            case 83:
                snake.changeDirection('down');
                break;
            case 37:
            case 65:
                snake.changeDirection('left');
                break;
            case 39:
            case 68: 
                snake.changeDirection('right');
        }
    });
    up.addEventListener('click',function(){
        snake.changeDirection('up');
    });
    right.addEventListener('click',function(){
        snake.changeDirection('right');
    });
    down.addEventListener('click',function(){
        snake.changeDirection('down');
    });
    left.addEventListener('click',function(){
        snake.changeDirection('left');
    });
})();