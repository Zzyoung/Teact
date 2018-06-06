interface props {
  children?: TeactElement[];
  [key: string]: any;
}

interface TeactElement {
  type: string;
  props: props;
  nodeValue?: string;
  [event: string]: any;
}

interface instance {
  dom: HTMLElement | Text;
  element: TeactElement;
  childInstances?: instance[];
}

const TEXTELEMENT = 'TEXT ELEMENT';
type TEXTELEMENT = typeof TEXTELEMENT;
// start
let rootInstance: instance | null = null;

function render(element: TeactElement, container: HTMLElement) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance;
}

function reconcile(parentDom: HTMLElement, prevInstance: instance | null, element: TeactElement): instance|null {
  const newInstance = instantiate(element); // element -> instance
  // 初始化时虚拟主干dom为null
  if (prevInstance === null) {
    parentDom.appendChild(newInstance.dom);
  } else if (element === null) {
    parentDom.removeChild(prevInstance.dom);
    return null;
  } else if(prevInstance.element.type === element.type){
    // same type, update props
    updateDomProperties(prevInstance.dom, prevInstance.element.props, element.props);
    prevInstance.element = element;
    prevInstance.childInstances = reconcileChildren(prevInstance, element);

    return prevInstance;
  } else {
    parentDom.replaceChild(newInstance.dom, prevInstance.dom);
  }

  return newInstance;
}
// end

function reconcileChildren(prevInstance:instance, element: TeactElement) {
  const prevChildInstances = prevInstance.childInstances || [];
  const nextChildElements = element.props.children || [];
  const newChildInstances:instance[] = [];
  const count = Math.max(prevChildInstances.length, nextChildElements.length);

  for(let i = 0; i < count; i++) {
    const prevChildInstance = prevChildInstances[i];
    const childElement = nextChildElements[i];

    const newChildInstance = reconcile(prevInstance.dom as HTMLElement, prevChildInstance, childElement)!;
    newChildInstances.push(newChildInstance);
  }
  return newChildInstances.filter(instance => instance != null);
}

// 递归instantiate
function instantiate(element:TeactElement): instance {
  const { type, props } = element;
  
  // create DOM element
  const isTextElement = type === TEXTELEMENT;
  const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
  let instance: instance = { dom, element };

  // 更新dom属性，避免创建新dom
  updateDomProperties(dom, {}, props);

  // Render children
  const childElements = props.children;
  
  if (typeof childElements !== 'undefined') {
    const childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map(childInstance => childInstance.dom);

    childDoms.forEach(childDom => dom.appendChild(childDom));
    instance.childInstances = childInstances;
  }

  return instance;
}

function updateDomProperties(dom:HTMLElement|Text, prevProps: props, nextProps: props) {
  const isEvent = (name: string) => name.startsWith('on');
  const isAttribute = (name: string) => !isEvent(name) && name !== 'children';

  
  if (dom instanceof HTMLElement) {
    Object.keys(prevProps).filter(isEvent).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    })

    Object.keys(nextProps).filter(isEvent).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
  }
  
  // remove previous props
  Object.keys(prevProps).filter(isAttribute).forEach(name => {
    dom[name] = null;
  });

  // add next props
  Object.keys(nextProps).filter(isAttribute).forEach(name => {
    dom[name] = nextProps[name];
  });
}

function createTextElement(value:string):TeactElement {
  return createElement(TEXTELEMENT, { nodeValue: value });
}

function isTeactElement(c: TeactElement | string): c is TeactElement {
  return typeof (<TeactElement>c).type === 'string';
}

function createElement(type: string, config: props, ...args: Array<TeactElement | string>): TeactElement {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const defaultArray: Array<TeactElement|string> = [];
  const rawChildren = hasChildren ? defaultArray.concat(...args) : defaultArray;
  props.children = rawChildren.map(c => isTeactElement(c) ? c : createTextElement(c));

  return {
    type,
    props
  };
}

window.Teact = {
  render,
  createElement
}

// export default {
//   render,
//   createElement
// }