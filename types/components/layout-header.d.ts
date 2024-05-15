import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutHeader: defineVxeComponent<VxeLayoutHeaderProps, VxeLayoutHeaderEventProps>

export interface VxeLayoutHeaderConstructor extends VxeComponentBase, VxeLayoutHeaderMethods {
  props: VxeLayoutHeaderProps
  context: SetupContext<VxeLayoutHeaderEmits>
  reactData: LayoutHeaderReactData
  getRefMaps(): LayoutHeaderPrivateRef
  getComputeMaps(): LayoutHeaderPrivateComputed
  renderVN: RenderFunction
}

export interface LayoutHeaderPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeLayoutHeaderPrivateRef extends LayoutHeaderPrivateRef { }

export namespace VxeLayoutHeaderPropTypes {
  export type Fixed = boolean
}

export type VxeLayoutHeaderProps = {
  fixed?: VxeLayoutHeaderPropTypes.Fixed
}

export interface LayoutHeaderPrivateComputed {
}
export interface VxeLayoutHeaderPrivateComputed extends LayoutHeaderPrivateComputed { }

export interface LayoutHeaderReactData {
}

export interface LayoutHeaderMethods {
}
export interface VxeLayoutHeaderMethods extends LayoutHeaderMethods { }

export interface LayoutHeaderPrivateMethods { }
export interface VxeLayoutHeaderPrivateMethods extends LayoutHeaderPrivateMethods { }

export type VxeLayoutHeaderEmits = []

export namespace VxeLayoutHeaderDefines {
  export interface LayoutHeaderEventParams extends VxeComponentEvent {
    $layoutHeader: VxeLayoutHeaderConstructor
  }
}

export type VxeBLayoutHeaderEventProps = {}

export interface VxeLayoutHeaderListeners { }

export namespace VxeLayoutHeaderEvents { }

export namespace VxeLayoutHeaderSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeLayoutHeaderSlots {
  default: (params: VxeLayoutHeaderSlotTypes.DefaultSlotParams) => any
}

export const LayoutHeader: typeof VxeLayoutHeader
export default VxeLayoutHeader
