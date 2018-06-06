var TEXTELEMENT = 'TEXT ELEMENT';
// start
var rootInstance = null;
function render(element, container) {
    var prevInstance = rootInstance;
    var nextInstance = reconcile(container, prevInstance, element);
    rootInstance = nextInstance;
}
function reconcile(parentDom, prevInstance, element) {
    var newInstance = instantiate(element); // element -> instance
    // 初始化时虚拟主干dom为null
    if (prevInstance === null) {
        parentDom.appendChild(newInstance.dom);
    }
    else if (element === null) {
        parentDom.removeChild(prevInstance.dom);
        return null;
    }
    else if (prevInstance.element.type === element.type) {
        // same type, update props
        updateDomProperties(prevInstance.dom, prevInstance.element.props, element.props);
        prevInstance.element = element;
        prevInstance.childInstances = reconcileChildren(prevInstance, element);
        return prevInstance;
    }
    else {
        parentDom.replaceChild(newInstance.dom, prevInstance.dom);
    }
    return newInstance;
}
// end
function reconcileChildren(prevInstance, element) {
    var prevChildInstances = prevInstance.childInstances || [];
    var nextChildElements = element.props.children || [];
    var newChildInstances = [];
    var count = Math.max(prevChildInstances.length, nextChildElements.length);
    for (var i = 0; i < count; i++) {
        var prevChildInstance = prevChildInstances[i];
        var childElement = nextChildElements[i];
        var newChildInstance = reconcile(prevInstance.dom, prevChildInstance, childElement);
        newChildInstances.push(newChildInstance);
    }
    return newChildInstances.filter(function (instance) { return instance != null; });
}
// 递归instantiate
function instantiate(element) {
    var type = element.type, props = element.props;
    // create DOM element
    var isTextElement = type === TEXTELEMENT;
    var dom = isTextElement ? document.createTextNode('') : document.createElement(type);
    var instance = { dom: dom, element: element };
    // 更新dom属性，避免创建新dom
    updateDomProperties(dom, {}, props);
    // Render children
    var childElements = props.children;
    if (typeof childElements !== 'undefined') {
        var childInstances = childElements.map(instantiate);
        var childDoms = childInstances.map(function (childInstance) { return childInstance.dom; });
        childDoms.forEach(function (childDom) { return dom.appendChild(childDom); });
        instance.childInstances = childInstances;
    }
    return instance;
}
function updateDomProperties(dom, prevProps, nextProps) {
    var isEvent = function (name) { return name.startsWith('on'); };
    var isAttribute = function (name) { return !isEvent(name) && name !== 'children'; };
    if (dom instanceof HTMLElement) {
        Object.keys(prevProps).filter(isEvent).forEach(function (name) {
            var eventType = name.toLowerCase().substring(2);
            dom.removeEventListener(eventType, prevProps[name]);
        });
        Object.keys(nextProps).filter(isEvent).forEach(function (name) {
            var eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, nextProps[name]);
        });
    }
    // remove previous props
    Object.keys(prevProps).filter(isAttribute).forEach(function (name) {
        dom[name] = null;
    });
    // add next props
    Object.keys(nextProps).filter(isAttribute).forEach(function (name) {
        dom[name] = nextProps[name];
    });
}
function createTextElement(value) {
    return createElement(TEXTELEMENT, { nodeValue: value });
}
function isTeactElement(c) {
    return typeof c.type === 'string';
}
function createElement(type, config) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var props = Object.assign({}, config);
    var hasChildren = args.length > 0;
    var defaultArray = [];
    var rawChildren = hasChildren ? defaultArray.concat.apply(defaultArray, args) : defaultArray;
    props.children = rawChildren.map(function (c) { return isTeactElement(c) ? c : createTextElement(c); });
    return {
        type: type,
        props: props
    };
}
window.Teact = {
    render: render,
    createElement: createElement
};
// export default {
//   render,
//   createElement
// }
