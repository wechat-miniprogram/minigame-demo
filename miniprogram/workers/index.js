worker.onMessage(res=>{
    function fabonacci(n) {
        return n < 2 ? n : fabonacci(n - 1) + fabonacci(n - 2);
    }
    worker.postMessage({
        msg: fabonacci(res.msg) 
    })
})