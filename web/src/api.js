import xf from './xfetch'

const headers = {}
if (localStorage.token) {
	headers.Authorization = 'Basic ' + localStorage.token
}
let env = process.env.NODE_ENV
if (env == 'development') {
	window.props = {
		api: 'https://ppan.wdd-gd.workers.dev',
		default_root_id: 'root',
		title: 'GDPAN',
		upload: true,
	}
}
export default xf.extend({
	baseURI: window.props.api,
	headers,
})
