<template>
	<v-container fluid>
		<v-row justify="center">
			<v-col md="8">
				<div class="action-bar">
					<v-btn depressed color="primary" @click="reLoad"
						>重新加载</v-btn
					>
					<v-btn
						depressed
						color="primary"
						v-if="dp"
						@click="mute = !mute"
						>{{ mute ? '取消静音' : '静音' }}</v-btn
					>
					<v-btn
						depressed
						color="primary"
						v-if="dp"
						@click="dp.fullScreen.request('web')"
						>网页全屏</v-btn
					>
				</div>
				<div class="video" ref="video"></div>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import api from '../api'
import DPlayer from 'dplayer'

const MIME = {
	mp4: 'video/mp4',
}
function checkExists(url) {
	const ct = new AbortController()
	return api
		.get(url, {
			signal: ct.signal,
		})
		.then((r) => {
			ct.abort()
			return r.status === 200
		})
		.catch(() => false)
}
const srt2vtt = (s) =>
	'WEBVTT FILE\r\n\r\n' +
	s
		.replace(/\{\\([ibu])\}/g, '</$1>')
		.replace(/\{\\([ibu])1\}/g, '<$1>')
		.replace(/\{([ibu])\}/g, '<$1>')
		.replace(/\{\/([ibu])\}/g, '</$1>')
		.replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
		.concat('\r\n\r\n')
export default {
	data() {
		return {
			dp: null,
			mute: false,
			dpOptions: {},
		}
	},
	watch: {
		mute(val) {
			this.dp.volume(val ? 0 : 1, true, false)
		},
	},
	mounted() {
		this.init()
	},
	methods: {
		async init() {
			const { video } = this.$refs
			this.dpOptions = {
				container: video,
			}
			const url = new URL(atob(this.$route.query.urlBase64))
			const toks = url.pathname.split('.')
			const pathSansExt = toks.slice(0, -1).join('.')
			const ext = toks.slice(-1)[0].toLowerCase()
			this.dpOptions.video = {
				url: url.href,
			}
			let num = url.href.lastIndexOf('/') + 1
			let name = url.href.substring(num)
			let fileName = decodeURI(name)
			this.$store.commit('SET_fileName', fileName)
			// 字幕
			// const srtUrl = new URL(url)
			// srtUrl.pathname = pathSansExt + '.srt'
			// const hasSrt = await checkExists(srtUrl)
			// if (hasSrt) {
			// 	const srt = await api.get(srtUrl).text()
			// 	const blob = new Blob([srt2vtt(srt)], { type: 'text/vtt' })
			// 	const subUrl = URL.createObjectURL(blob)
			// 	this.dpOptions.subtitle = {
			// 		url: subUrl,
			// 	}
			// }
			this.dp = new DPlayer(this.dpOptions)
		},
		reLoad() {
			this.dp.destroy()
			this.dp = null
			this.init()
		},
	},
	beforeDestroy() {
		this.dp.destroy()
		this.$store.commit('SET_fileName', null)
	},
}
</script>
<style scoped>
.action-bar {
	margin-bottom: 10px;
}
.action-bar button {
	margin-right: 15px;
	margin-bottom: 5px;
	min-width: 95px !important;
}
.video {
	width: 100%;
	max-height: 80vh;
	object-fit: cover;
}
.dplayer-fulled {
	max-height: 100vh;
}
</style>
