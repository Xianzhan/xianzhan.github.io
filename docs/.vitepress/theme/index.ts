import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import 'viewerjs/dist/viewer.css'
import './index.css'
import { useImageViewer } from 'vitepress-plugin-viewerjs'

export default {
    extends: DefaultTheme,
    setup() {
        // 默认扫描 .vp-doc 内图片，自动支持点击放大/拖动/缩放/翻页
        useImageViewer({
            selector: '.vp-doc',
            cursor: 'zoom-in',
            viewer: {
                zoomable: true,
                movable: true,      // 放大后可拖拽移动
                rotatable: true,
                scalable: true,
                toolbar: {
                    zoomIn: 1,
                    zoomOut: 1,
                    oneToOne: 1,
                    reset: 1,
                    prev: 1,
                    next: 1,
                    rotateLeft: 1,
                    rotateRight: 1,
                },
            },
        })
    },
} satisfies Theme