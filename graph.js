class Centroid{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.avgx =0;
        this.avgy =0;
        this.sizeAvg = 0;
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    set(x,y){
        this.x =x;
        this.y =y;
    }
    addAVG(x,y){
        this.avgy +=y;
        this.avgx +=x;
        this.sizeAvg +=1;
    }
    move(){
        if(this.sizeAvg ==0){
            return false;
        }
        this.x = this.avgx/this.sizeAvg;
        this.y = this.avgy/this.sizeAvg;
        this.avgx =0;
        this.avgy =0;
        this.sizeAvg =0;
        return true;
    }
}
class DataPoint{
// Holds data points
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.centroid = 0;
    }
    setCentroid(id){
        this.centroid = id;
    }
    getCentroid(){
        return this.centroid;
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    set(x,y){
        this.x =x;
        this.y =y;
    }
}
function createCentroids(centroids,width,height){
    let Cents = [];
    for(let i=0; i< centroids; i++){
        Cents.push(new Centroid(getRandomInt(width),getRandomInt(height)));
    }
    return Cents;
}
function createData(dataSize,width,height){
    let data = [];
    for(let i=0; i<dataSize; i++){
        data.push(new DataPoint(getRandomInt(width),getRandomInt(height)));
    }
    return data;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function sq(num){
    return num*num;
}
function relDist(cent,dataPoint){
    return sq(cent.getX()-dataPoint.getX())+sq(cent.getY()-dataPoint.getY());
}
function classifyPoints(Data,Cents,centroids,dataSize){
    for(let i=0; i< dataSize; i++){
        let centId =0;
        let best = relDist(Cents[0],Data[i]);
        for(let u=1; u<centroids; u++){
            let tmp = relDist(Cents[u],Data[i]);
            if(tmp <= best){
                best = tmp;
                centId = u;
            }
        }
        Data[i].setCentroid(centId);
        Cents[centId].addAVG(Data[i].getX(),Data[i].getY());
    }
}
function moveCentroids(Cents,centroids){
    for(let i=0; i<centroids; i++){
        if(!Cents[i].move()){
            Cents[i].set(getRandomInt(width),getRandomInt(height));
        }
    }
}
function drawLine(ctx, begin, end, stroke = 'black', width = 1) {
    if (stroke) {
        ctx.strokeStyle = stroke;
    }
    if (width) {
        ctx.lineWidth = width;
    }
    ctx.beginPath();
    ctx.moveTo(...begin);
    ctx.lineTo(...end);
    ctx.stroke();
}
function drawDot(ctx, begin,end, stroke = 'black', width = 10) {
    if (stroke) {
        ctx.fillStyle = stroke;
    }
    let offset = width/2;
    ctx.fillRect(begin-offset,end-offset,width,width)
    ctx.stroke();
}
function lerp(a,b,t){
    return a+(b-1)*t;
}
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
function kmean(ctx,centroids,dataSize,width,height){
    let scale = 4;
    let Cents = createCentroids(centroids,width,height);
    let Data = createData(dataSize,width,height);
    for(let runs =0; runs <4; runs++){
        classifyPoints(Data,Cents,centroids,dataSize);
        moveCentroids(Cents,centroids);
    }
        for(let i=0; i< dataSize; i++){
            drawLine(ctx,[Data[i].getX()*scale,Data[i].getY()*scale],[Cents[Data[i].getCentroid()].getX()*scale,Cents[Data[i].getCentroid()].getY()*scale]);
            drawDot(ctx,Data[i].getX()*scale,Data[i].getY()*scale,'red');
        }
        for(let i=0; i< centroids; i++){
            drawDot(ctx,Cents[i].getX()*scale,Cents[i].getY()*scale,'blue');
        }
}
function draw() {
    const canvas = document.querySelector('#canvas');
    if (!canvas.getContext) {
        return;
    }
    const ctx = canvas.getContext('2d');
    // set line stroke and line width
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    kmean(ctx,4,100,200,200);
}
draw();
