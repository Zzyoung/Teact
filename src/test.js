const randomLikes = () => Math.ceil(Math.random() * 100);

const stories = [
  {
    name: "Teact introduction",
    url: "http://www.baidu.com",
    likes: randomLikes()
  },
  {
    name: "Rendering DOM elements ",
    url: "http://www.baidu.com",
    likes: randomLikes()
  },
  {
    name: "Element creation and JSX",
    url: "http://www.baidu.com",
    likes: randomLikes()
  },
  {
    name: "Instances and reconciliation",
    url: "http://www.baidu.com",
    likes: randomLikes()
  },
  {
    name: "Components and state",
    url: "http://www.baidu.com",
    likes: randomLikes()
  }
];

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Teact$Component) {
  _inherits(App, _Teact$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return Teact.createElement(
        "div",
        null,
        Teact.createElement(
          "h1",
          null,
          "Teact Stories"
        ),
        Teact.createElement(
          "ul",
          null,
          this.props.stories.map(function (story) {
            return Teact.createElement(Story, { name: story.name, url: story.url });
          })
        )
      );
    }
  }]);

  return App;
}(Teact.Component);

var Story = function (_Teact$Component2) {
  _inherits(Story, _Teact$Component2);

  function Story(props) {
    _classCallCheck(this, Story);

    var _this2 = _possibleConstructorReturn(this, (Story.__proto__ || Object.getPrototypeOf(Story)).call(this, props));

    _this2.state = { likes: Math.ceil(Math.random() * 100) };
    return _this2;
  }

  _createClass(Story, [{
    key: "like",
    value: function like() {
      this.setState({
        likes: this.state.likes + 1
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _props = this.props,
        name = _props.name,
        url = _props.url;
      var likes = this.state.likes;

      var likesElement = Teact.createElement("span", null);
      return Teact.createElement(
        "li",
        null,
        Teact.createElement(
          "button",
          {
            onClick: function onClick(e) {
              return _this3.like();
            }
          },
          likes,
          Teact.createElement(
            "b",
            null,
            "\u2764\uFE0F"
          )
        ),
        Teact.createElement(
          "a",
          { href: url },
          name
        )
      );
    }
  }]);

  return Story;
}(Teact.Component);

Teact.render(Teact.createElement(App, { stories: stories }), document.getElementById("root"));

/*
var appElement = function appElement() {
  return Teact.createElement(
    "div",
    null,
    Teact.createElement(
      "ul",
      null,
      stories.map(storyElement)
    )
  );
};

function storyElement(story) {
  return Teact.createElement(
    "li",
    null,
    Teact.createElement(
      "button",
      {
        onClick: function onClick(e) {
          return handleClick(story);
        }
      },
      story.likes,
      Teact.createElement(
        "b",
        null,
        "\u2764\uFE0F"
      )
    ),
    Teact.createElement(
      "a",
      { href: story.url },
      story.name
    )
  );
}

function handleClick(story) {
  story.likes += 1;
  Teact.render(appElement(), document.getElementById("root"));
}

Teact.render(appElement(), document.getElementById("root"));
*/