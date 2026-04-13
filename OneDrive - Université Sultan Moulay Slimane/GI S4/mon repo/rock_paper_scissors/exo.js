function run(){
    console.log("hello");
    setTimeout(run,1);
}
setTimeout(run,1000);