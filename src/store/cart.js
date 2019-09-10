import axios from 'axios'
export default {
    state: {
        //存数据定义一个空数组
        cartlist: [
            //     {
            //     ID:1,
            //     ProductName:'53度 珍酒 珍品 1975 500ml',
            //     qty:1,
            //     APPPrice:198.0,
            //     Pic:"2019/0816/731da146152b4ebe85b32e2bfd761141.jpg"
            // },

            // {
            //     ID : 2,
            //     ProductName : "53度 茅台 飞天带杯（ 2019年产 ）500ml",
            //     APPPrice: 2799.0,
            //     Pic: "2019/0813/94ff85adea814fd89cce17556bbce5dd.jpg",
            //     qty:2,
            // }
        ]
    },
    getters: {
        totalPrice: function (state) {
            return state.cartlist.reduce(function (prev, item) {
                // prev：前一次reduce的返回值
                return prev + item.APPPrice * item.qty
            }, 0)
        }
    },
    mutations: {
        addItem(state, detail) {
            state.cartlist.push(detail)
        },
        removeItem(state, ID) {
            state.cartlist = state.cartlist.filter(item => item.ID != ID);
        },
        changeQty(state, {
            qty,
            ID
        }) {
            state.cartlist = state.cartlist.map(item => {
                if (item.ID === ID) {
                    item.qty = qty;
                }
                return item;
            })
        },
    },
    actions: {
        //查询所有商品
        saveForm(context) {
            axios.post('http://localhost:1906/cart', context.state.cartlist).then(res => { // 调用接口
                context.commit('changeQty', res.data)
                // 通过接口获取的后台数据保存到store中，等待组件取用              
                context.state.cartlist = res.data.data;


            })

        },
        //删除商品
        removeForm(context, id) {
            axios.post('http://localhost:1906/cart/delete', {
                ID: id
            }).then(res => {
                context.commit('removeItem', res.data);


            })
        },
        updateForm(context, {
            ID,
            qty
        }) {
            // context.state.cartlist
            axios.post('http://localhost:1906/cart/updata', {
                ID: ID,
                qty: qty
            }).then(res => {
                context.commit('changeQty', res.data);

            })
        }


    }

}