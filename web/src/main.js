import './style.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import PortalVue from 'portal-vue'
import Vuex from 'vuex'

let env = process.env.NODE_ENV
if (env != 'development' && window.props.defaultRootId) {
	// backward compability
	window.props.default_root_id = window.props.defaultRootId
}

Vue.use(Vuex)
Vue.use(PortalVue)

let store = new Vuex.Store({
	state: {
		fileName: null,
	},
	getters: {
		getFileName(state) {
			return state.fileName
		},
	},
	mutations: {
		SET_fileName(state, flag) {
			state.fileName = flag
		},
	},
	actions: {},
	modules: {},
})
Vue.config.productionTip = false

window.app = new Vue({
	router,
	store,
	vuetify,
	i18n,
	render: (h) => h(App, { props: window.props }),
}).$mount('#app')
