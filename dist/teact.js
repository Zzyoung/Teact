var TEXTELEMENT = 'TEXT ELEMENT';
function render(element, parentDom) {
    var type = element.type, props = element.props;
    // create DOM element
    var isTextElement = type === TEXTELEMENT;
    var dom = isTextElement ? document.createTextNode('') : document.createElement(type);
    // Add event listeners
    var isListener = function (name) { return name.startsWith('on'); };
    Object.keys(props).filter(isListener).forEach(function (name) {
        var eventType = name.toLowerCase().substring(2);
        // Type Guards
        if (dom instanceof HTMLElement) {
            dom.addEventListener(eventType, props[name]);
        }
    });
    // Set properties
    var isAttribute = function (name) { return !isListener && name !== 'children'; };
    Object.keys(props).filter(isAttribute).forEach(function (name) {
        dom[name] = props[name];
    });
    // Render children
    var childElements = props.children;
    if (typeof childElements !== 'undefined') {
        childElements.forEach(function (childElement) { return render(childElement, dom); });
    }
    // append to parent
    parentDom.appendChild(dom);
}
function createTextElement(value) {
    return createElement(TEXTELEMENT, { nodeValue: value });
}
function createElement(type, config) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var props = Object.assign({}, config);
    var hasChildren = args.length > 0;
    var rawChildren = hasChildren ? args.slice() : [];
    props.children = rawChildren.map(function (c) { return typeof c === 'string' ? createTextElement(c) : c; });
    return {
        type: type,
        props: props
    };
}
