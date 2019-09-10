import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
import cart from './cart';
import common from './common'

let store = new Vuex.Store({
    modules: {
        cart,
        common
    }
})



export default store