import { defineComponent, h, Teleport, ref, Ref, onUnmounted, reactive, inject, computed, nextTick, PropType, watch, createCommentVNode } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, globalEvents, createEvent, useSize, VxeComponentStyleType } from '../../ui'
import { getAbsolutePos, getEventTargetNode } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'

import type { VxePulldownConstructor, VxePulldownPropTypes, VxePulldownEmits, PulldownReactData, PulldownMethods, PulldownPrivateRef, VxePulldownMethods, VxeTableConstructor, VxeTablePrivateMethods, VxeFormConstructor, VxeFormPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxePulldown',
  props: {
    modelValue: Boolean as PropType<VxePulldownPropTypes.ModelValue>,
    disabled: Boolean as PropType<VxePulldownPropTypes.Disabled>,
    placement: String as PropType<VxePulldownPropTypes.Placement>,
    size: { type: String as PropType<VxePulldownPropTypes.Size>, default: () => getConfig().size },
    className: [String, Function] as PropType<VxePulldownPropTypes.ClassName>,
    popupClassName: [String, Function] as PropType<VxePulldownPropTypes.PopupClassName>,
    destroyOnClose: Boolean as PropType<VxePulldownPropTypes.DestroyOnClose>,
    transfer: {
      type: Boolean as PropType<VxePulldownPropTypes.Transfer>,
      default: null
    }
  },
  emits: [
    'update:modelValue',
    'hide-panel'
  ] as VxePulldownEmits,
  setup (props, context) {
    const { slots, emit } = context

    const $xeTable = inject<VxeTableConstructor & VxeTablePrivateMethods | null>('$xeTable', null)
    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const reactData = reactive<PulldownReactData>({
      inited: false,
      panelIndex: 0,
      panelStyle: null,
      panelPlacement: null,
      visiblePanel: false,
      animatVisible: false,
      isActivated: false
    })

    const refElem = ref() as Ref<HTMLDivElement>
    const refPulldowContent = ref() as Ref<HTMLDivElement>
    const refPulldowPnanel = ref() as Ref<HTMLDivElement>

    const computeTransfer = computed(() => {
      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().pulldown.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeForm) {
          return true
        }
      }
      return transfer
    })

    const refMaps: PulldownPrivateRef = {
      refElem
    }

    const $xepulldown = {
      xID,
      props,
      context,
      reactData,
      getRefMaps: () => refMaps
    } as unknown as VxePulldownConstructor & VxePulldownMethods

    let pulldownMethods = {} as PulldownMethods

    const updateZindex = () => {
      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const isPanelVisible = () => {
      return reactData.visiblePanel
    }

    /**
     * 手动更新位置
     */
    const updatePlacement = () => {
      return nextTick().then(() => {
        const { placement } = props
        const { panelIndex, visiblePanel } = reactData
        const transfer = computeTransfer.value
        if (visiblePanel) {
          const targetElem = refPulldowContent.value
          const panelElem = refPulldowPnanel.value
          if (panelElem && targetElem) {
            const targetHeight = targetElem.offsetHeight
            const targetWidth = targetElem.offsetWidth
            const panelHeight = panelElem.offsetHeight
            const panelWidth = panelElem.offsetWidth
            const marginSize = 5
            const panelStyle: VxeComponentStyleType = {
              zIndex: panelIndex
            }
            const { boundingTop, boundingLeft, visibleHeight, visibleWidth } = getAbsolutePos(targetElem)
            let panelPlacement = 'bottom'
            if (transfer) {
              let left = boundingLeft
              let top = boundingTop + targetHeight
              if (placement === 'top') {
                panelPlacement = 'top'
                top = boundingTop - panelHeight
              } else if (!placement) {
                // 如果下面不够放，则向上
                if (top + panelHeight + marginSize > visibleHeight) {
                  panelPlacement = 'top'
                  top = boundingTop - panelHeight
                }
                // 如果上面不够放，则向下（优先）
                if (top < marginSize) {
                  panelPlacement = 'bottom'
                  top = boundingTop + targetHeight
                }
              }
              // 如果溢出右边
              if (left + panelWidth + marginSize > visibleWidth) {
                left -= left + panelWidth + marginSize - visibleWidth
              }
              // 如果溢出左边
              if (left < marginSize) {
                left = marginSize
              }
              Object.assign(panelStyle, {
                left: `${left}px`,
                top: `${top}px`,
                minWidth: `${targetWidth}px`
              })
            } else {
              if (placement === 'top') {
                panelPlacement = 'top'
                panelStyle.bottom = `${targetHeight}px`
              } else if (!placement) {
                // 如果下面不够放，则向上
                if (boundingTop + targetHeight + panelHeight > visibleHeight) {
                  // 如果上面不够放，则向下（优先）
                  if (boundingTop - targetHeight - panelHeight > marginSize) {
                    panelPlacement = 'top'
                    panelStyle.bottom = `${targetHeight}px`
                  }
                }
              }
            }
            reactData.panelStyle = panelStyle
            reactData.panelPlacement = panelPlacement
          }
        }
        return nextTick()
      })
    }

    let hidePanelTimeout: number

    /**
     * 显示下拉面板
     */
    const showPanel = (): Promise<void> => {
      if (!reactData.inited) {
        reactData.inited = true
      }
      return new Promise(resolve => {
        if (!props.disabled) {
          clearTimeout(hidePanelTimeout)
          reactData.isActivated = true
          reactData.animatVisible = true
          setTimeout(() => {
            reactData.visiblePanel = true
            emit('update:modelValue', true)
            updatePlacement()
            setTimeout(() => {
              resolve(updatePlacement())
            }, 40)
          }, 10)
          updateZindex()
        } else {
          nextTick(() => {
            resolve()
          })
        }
      })
    }

    /**
     * 隐藏下拉面板
     */
    const hidePanel = (): Promise<void> => {
      reactData.visiblePanel = false
      emit('update:modelValue', false)
      return new Promise(resolve => {
        if (reactData.animatVisible) {
          hidePanelTimeout = window.setTimeout(() => {
            reactData.animatVisible = false
            nextTick(() => {
              resolve()
            })
          }, 350)
        } else {
          nextTick(() => {
            resolve()
          })
        }
      })
    }

    /**
     * 切换下拉面板
     */
    const togglePanel = () => {
      if (reactData.visiblePanel) {
        return hidePanel()
      }
      return showPanel()
    }

    const handleGlobalMousewheelEvent = (evnt: Event) => {
      const { disabled } = props
      const { visiblePanel } = reactData
      const panelElem = refPulldowPnanel.value
      if (!disabled) {
        if (visiblePanel) {
          if (getEventTargetNode(evnt, panelElem).flag) {
            updatePlacement()
          } else {
            hidePanel()
            pulldownMethods.dispatchEvent('hide-panel', {}, evnt)
          }
        }
      }
    }

    const handleGlobalMousedownEvent = (evnt: Event) => {
      const { disabled } = props
      const { visiblePanel } = reactData
      const el = refElem.value
      const panelElem = refPulldowPnanel.value
      if (!disabled) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          hidePanel()
          pulldownMethods.dispatchEvent('hide-panel', {}, evnt)
        }
      }
    }

    const handleGlobalBlurEvent = (evnt: Event) => {
      if (reactData.visiblePanel) {
        reactData.isActivated = false
        hidePanel()
        pulldownMethods.dispatchEvent('hide-panel', {}, evnt)
      }
    }

    pulldownMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $pulldown: $xepulldown }, params))
      },
      isPanelVisible,
      togglePanel,
      showPanel,
      hidePanel
    }

    Object.assign($xepulldown, pulldownMethods)

    watch(() => props.modelValue, (value) => {
      if (value) {
        showPanel()
      } else {
        hidePanel()
      }
    })

    nextTick(() => {
      globalEvents.on($xepulldown, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xepulldown, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xepulldown, 'blur', handleGlobalBlurEvent)
    })

    onUnmounted(() => {
      globalEvents.off($xepulldown, 'mousewheel')
      globalEvents.off($xepulldown, 'mousedown')
      globalEvents.off($xepulldown, 'blur')
    })

    const renderVN = () => {
      const { className, popupClassName, destroyOnClose, disabled } = props
      const { inited, isActivated, animatVisible, visiblePanel, panelStyle, panelPlacement } = reactData
      const transfer = computeTransfer.value
      const vSize = computeSize.value
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const dropdownSlot = slots.dropdown
      return h('div', {
        ref: refElem,
        class: ['vxe-pulldown', className ? (XEUtils.isFunction(className) ? className({ $pulldown: $xepulldown }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'is--visible': visiblePanel,
          'is--disabled': disabled,
          'is--active': isActivated
        }]
      }, [
        h('div', {
          ref: refPulldowContent,
          class: 'vxe-pulldown--content'
        }, defaultSlot ? defaultSlot({ $pulldown: $xepulldown }) : []),
        h(Teleport, {
          to: 'body',
          disabled: transfer ? !inited : true
        }, [
          h('div', {
            ref: refPulldowPnanel,
            class: ['vxe-table--ignore-clear vxe-pulldown--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $pulldown: $xepulldown }) : popupClassName) : '', {
              [`size--${vSize}`]: vSize,
              'is--transfer': transfer,
              'animat--leave': animatVisible,
              'animat--enter': visiblePanel
            }],
            placement: panelPlacement,
            style: panelStyle
          }, dropdownSlot
            ? [
                h('div', {
                  class: 'vxe-pulldown--panel-wrapper'
                }, !inited || (destroyOnClose && !visiblePanel && !animatVisible)
                  ? []
                  : [
                      headerSlot
                        ? h('div', {
                          class: 'vxe-pulldown--panel-header'
                        }, headerSlot({ $pulldown: $xepulldown }))
                        : createCommentVNode(),
                      h('div', {
                        class: 'vxe-pulldown--panel-body'
                      }, dropdownSlot({ $pulldown: $xepulldown })),
                      footerSlot
                        ? h('div', {
                          class: 'vxe-pulldown--panel-footer'
                        }, footerSlot({ $pulldown: $xepulldown }))
                        : createCommentVNode()
                    ])
              ]
            : [])
        ])
      ])
    }

    $xepulldown.renderVN = renderVN

    return $xepulldown
  },
  render () {
    return this.renderVN()
  }
})
