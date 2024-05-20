import { VxeGlobalConfig } from '../../../types'

const globalConfigStore: Required<VxeGlobalConfig> = {
  size: '',
  theme: '',
  version: 1,
  zIndex: 999,
  emptyCell: '　',
  loadingText: '',
  resizeInterval: 500,

  i18n: (key: string) => key,

  anchor: {},
  anchorLink: {},
  breadcrumb: {
    separator: '/'
  },
  breadcrumbItem: {},
  button: {},
  buttonGroup: {},
  checkbox: {},
  checkboxGroup: {},
  col: {},
  drawer: {
    // size: null,
    showHeader: true,
    lockView: true,
    mask: true,
    showTitleOverflow: true,
    showClose: true
  },
  form: {
    // preventSubmit: false,
    // size: null,
    // colon: false,
    validConfig: {
      showMessage: true,
      autoPos: true
    },
    tooltipConfig: {
      enterable: true
    },
    titleAsterisk: true
  },
  formDesign: {
    formConfig: {
      vertical: true
    }
  },
  formGather: {},
  formItem: {},
  icon: {},
  input: {
    // size: null,
    // transfer: false
    // parseFormat: 'yyyy-MM-dd HH:mm:ss.SSS',
    // labelFormat: '',
    // valueFormat: '',
    startDate: new Date(1900, 0, 1),
    endDate: new Date(2100, 0, 1),
    startDay: 1,
    selectDay: 1,
    digits: 2,
    controls: true
  },
  layoutAside: {},
  layoutBody: {},
  layoutContainer: {},
  layoutFooter: {},
  layoutHeader: {},
  listDesign: {},
  list: {
    // size: null,
    scrollY: {
      enabled: true,
      gt: 100
      // oSize: 0
    }
  },
  loading: {},
  modal: {
    // size: null,
    top: 15,
    showHeader: true,
    minWidth: 340,
    minHeight: 140,
    lockView: true,
    mask: true,
    duration: 3000,
    marginSize: 0,
    dblclickZoom: true,
    showTitleOverflow: true,
    animat: true,
    showClose: true,
    draggable: true,
    showConfirmButton: null,
    // storage: false,
    storageKey: 'VXE_MODAL_POSITION'
  },
  optgroup: {},
  option: {},
  pager: {
    // size: null,
    // autoHidden: false,
    // perfect: true,
    // pageSize: 10,
    // pagerCount: 7,
    // pageSizes: [10, 15, 20, 50, 100],
    // layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
  },
  pulldown: {},
  radio: {
    strict: true
  },
  radioButton: {
    strict: true
  },
  radioGroup: {
    strict: true
  },
  row: {},
  select: {
    multiCharOverflow: 8
  },
  switch: {},
  tabPane: {},
  tabs: {},
  textarea: {},
  tooltip: {
    // size: null,
    trigger: 'hover',
    theme: 'dark',
    enterDelay: 500,
    leaveDelay: 300
  }
}

export default globalConfigStore
