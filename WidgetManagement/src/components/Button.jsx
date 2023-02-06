import React from "react";
import Bookmark from "../utils/bookmark";

const ACTIONS = {
  BOOKMARK: 0,
  OPENLINK: 1,
  COPYLINK: 2
};

export default class WidgetButton extends React.Component {
  constructor(props) {
    super(props);

    const wmTools = Bookmark.get();
    this.state = { isAdded: wmTools.includes(props.tool.id) };
  }

  navigate(event, action, params) {
    event.stopPropagation();
    const { BOOKMARK, OPENLINK, COPYLINK } = ACTIONS;
    switch (action) {
      case BOOKMARK:
        this.bookmark(params.id);
        params.bookmark();
        break;
      case OPENLINK:
        window.top.open(params.link, "_blank");
        break;
      case COPYLINK:
        window.top.navigator.clipboard.writeText(params.link).then(() => {
          const { alert } = this.refs;
          alert.style.top = 0;
          setTimeout(() => (alert.style.top = ""), 1000);
        });
        break;
      default:
    }
  }

  bookmark(toolId) {
    const _wmTools = Bookmark.get().slice(0);
    const index = _wmTools.indexOf(toolId);

    if (index > -1) _wmTools.splice(index, 1);
    else _wmTools.push(toolId);

    Bookmark.save(_wmTools);
    this.setState({ isAdded: _wmTools.includes(toolId) });
  }

  render() {
    const {
      state: { isAdded },
      props: {
        tool: { id, name, url, version, description, wiki },
        click,
        bookmark
      }
    } = this;
    return (
      <div className="widget" onClick={click}>
        {!bookmark ? null : (
          <div
            title={!isAdded ? "Add to Favorite" : "Remove from Favorite"}
            className={`widget__bookmark${isAdded ? " active" : ""}`}
            onClick={event =>
              this.navigate(event, ACTIONS.BOOKMARK, { id, bookmark })
            }
          ></div>
        )}
        <div className="widget__name">{name}</div>
        <div className="widget__version">{version}</div>
        <div className="widget__options">
          <div
            className="options__wiki"
            title="Wiki page"
            onClick={event =>
              this.navigate(event, ACTIONS.OPENLINK, { link: wiki })
            }
          ></div>
          <div
            className="options__link"
            title="Copy Widget URL"
            onClick={event =>
              this.navigate(event, ACTIONS.COPYLINK, { link: url })
            }
          ></div>
          {/* <div className="options__vers" title="Older versions"></div> */}
        </div>
        <div className="widget__desc">{description}</div>
        <div className="widget__alert alert alert--success" ref="alert">
          Copied to clipboard
        </div>
      </div>
    );
  }
}
