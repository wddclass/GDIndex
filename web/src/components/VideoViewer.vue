<template>
	<v-container fluid>
		<v-row justify="center">
			<v-col md="8">
				<div class="action-bar">
					<v-btn depressed color="primary" @click="reLoad"
						>重新加载</v-btn
					>
					<v-btn depressed color="primary" @click="dp.volume(0, true, false)">静音</v-btn>
					<v-btn depressed color="primary" @click="dp.volume(1, true, false)">取消静音</v-btn>
					<v-btn
						depressed
						color="primary"
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
			dpOptions: {},
		}
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
			// 字幕
			const srtUrl = new URL(url)
			srtUrl.pathname = pathSansExt + '.srt'
			const hasSrt = await checkExists(srtUrl)
			if (hasSrt) {
				const srt = await api.get(srtUrl).text()
				const blob = new Blob([srt2vtt(srt)], { type: 'text/vtt' })
				const subUrl = URL.createObjectURL(blob)
				this.dpOptions.subtitle = {
					url: subUrl,
				}
			}
			this.dp = new DPlayer(this.dpOptions)
		},
		reLoad() {
			this.dp.destroy()
			this.init()
		},
	},
	beforeDestroy() {
		this.dp.destroy()
	},
}
</script>
<style scoped>
.action-bar {
	margin-bottom: 20px;
}
.action-bar button + button {
	margin-left: 10px;
}
.video {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
