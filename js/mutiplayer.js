let controller1=new Controller({
    snackColor:"#008B00",
    foodColor:"#FFD700",
},true);
let controller2=new Controller({
    snackColor:"#6E8B3D",
    foodColor:"#CD8500",
},true);
controller1.setCompetitorBody(controller2.body);
controller2.setCompetitorBody(controller1.body);
(function main(){
    document.addEventListener('keydown',function(e){
        switch(e.keyCode){
            case 87:
                controller1.direction('up');
                break;
            case 83:
                controller1.direction('down');
                break;
            case 65:
                controller1.direction('left');
                break;
            case 68:
                controller1.direction('right');
                break;
            case 37:
                controller2.direction('left');
                break;
            case 38:
                controller2.direction('up');
                break;
            case 39:
                controller2.direction('right');
                break;
            case 40:
                controller2.direction('down');
                break;
            case 80:
            case 32:
            case 13:
                controller1.pause();
                controller2.pause();
                e.returnValue=false;
                break;
            case 82:
                window.location.reload();
        }
    })
})()
