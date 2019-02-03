function Controller(){
    let el;
    let platform={
        _data:{
            canv:document.querySelector(el),
            box:canv.getContext('2d'),
            snake:null,
            food:null,
            wall:null,
            pause:null,
            speed:null,
        },
        draw:function(){
            //绘制单个点
        },
        render:function(){
            //根据_data的值，再调用draw(),对canv进行更新，这需要是个setInterval，不管_data.pause的值，每隔一段时间执行
        },
        update:function(){
            //根据_pause的真假值，判断是否更新，若更新，则根据snake的direction改变snake.body，再根据food的position是否为null，createFood()
        },
    };
    let netController={
        //负责网络部分
    };
    function pause(){
        //调整platform._data.pause;
    };
    function Food(){
        //返回一个Food类
        let _score;
        let body;
        let length;
        let direction;
    };
    function Snake(){
        //返回一个Snake类
    };
    return{
        //返回一个类
    }
}