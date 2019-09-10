const express = require('express');
const Router = express.Router();
const {
    find,
    remove,
    update
} = require('../db/mongo');
const{
    formatData
} = require('../utils');
//查找所有商品
Router.post ('/',async(req,res)=>{
    
    let data = await find('cart',);
    res.send(formatData({data}))
})
//删除商品
Router.post('/delete', (req, res) => {

    
    let {
        ID
    } = req.body;

    try {
        remove('cart', {
            //ID是一个字符串
            ID:ID*1
        })
        res.send(formatData())
    } catch (err) {
        res.send(formatData({
            code: 0
        }))
    }
})
//修改数量
Router.post('/updata', async(req, res) => {
    let {
        qty,
        ID
    
    } = req.body;
    console.log(req.body);
    let data = await update('cart', {
        ID:ID*1
    }, {
        $set: {
            qty:qty*1
        }
    });
    res.send(formatData({
        data
    }))
})
module.exports  = Router;