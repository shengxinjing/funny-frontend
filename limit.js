async function sleep(n,name='test'){
  return new Promise(resolve=>{
    console.log(n,name,'start')
    setTimeout(()=>{
      console.log(n,name,'end','-------------')
      resolve({n,name})
    },n*1000)
  })
}
// 限制并发数 item是异步函数队列
async function asyncPool({limit,items}){
  const promises = []
  const pool = new Set()

  for(const item of items){
    const promise = item()
    promises.push(promise)
    pool.add(promise)
    const clean = ()=>pool.delete(promise)
    promise.then(clean, clean)
    if(pool.size>=limit){
      await Promise.race(pool)
    }
    // Promise.race
  }
  return Promise.all(promises)
}
async function start(){
  await asyncPool({
    limit: 2,
    items: [
      ()=> sleep(1,'吃饭'),
      ()=> sleep(3,'睡觉'),
      ()=> sleep(5,'打游戏'),
      ()=> sleep(3.5,'学习算法'),
      ()=> sleep(4,'学习Vue和React'),
    ]
  })
  console.log('结束啦')
}
start()










// @think1 如果任务有优先级呢
// @think2 如果用TS呢
// @think1 如果报错需要尝试2次呢
