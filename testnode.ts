import http from 'node:http'
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";


const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
/**
 * 创建办事处
 * req:浏览器传过来的所有消息（地址是什么，传了什么参数，浏览器版本等）
 * res:你要给回浏览器的东西（图片，网页，文字）
 */
const PORt=3000
const HOST='127.0.0.1'
const server=http.createServer((req,res)=>{

    let filePath=path.jion(__dirname,req.url==='/'?'index.html':req.url)

    fs.access(filePath,fs.constants.F_ok,err=>{
        if(err){
            res.statusCode=404;
            res.end('404 Not Found')
            return
        }
        const fileStream=fs.createReadStream(filePath);
        const ext=path.extname(filePath)
        if (ext === '.html')res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        if (ext === '.jpg')res.setHeader('Content-Type', 'image/jpeg');
        fileStream.pipe(res);
    })
    //像是贴标签，告诉浏览器这是什么，渲染成什么，处理为什么样的数据

    const url=req.url
    // if(url==='/'){
    //     //代表成功返回值
    //     res.statusCode=200;
    //     res.end('欢迎来到node.js服务器')
    // }else if(url==='/api/users'){
    //     res.statusCode=200;
    //     res.end('这是用户列表')
    // }else {
    //     res.statusCode=404;
    //     res.end('404 Not Found')
    // }


})
//开始执行，监听地址端口
server.listen(PORt,HOST,()=>{
    console.log(`服务器运行在http://${HOST}:${PORt}`)
})