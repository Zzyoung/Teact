const randomLikes = () => Math.ceil(Math.random() * 100);

const stories = [
  {
    name: "Didact introduction",
    url: "http://bit.ly/2pX7HNn",
    likes: randomLikes()
  },
  {
    name: "Rendering DOM elements ",
    url: "http://bit.ly/2qCOejH",
    likes: randomLikes()
  },
  {
    name: "Element creation and JSX",
    url: "http://bit.ly/2qGbw8S",
    likes: randomLikes()
  },
  {
    name: "Instances and reconciliation",
    url: "http://bit.ly/2q4A746",
    likes: randomLikes()
  },
  {
    name: "Components and state",
    url: "http://bit.ly/2rE16nh",
    likes: randomLikes()
  }
];

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