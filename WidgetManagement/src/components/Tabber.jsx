import React from "react";

class Tabber extends React.Component {
  constructor(props) {
    super(props);
    const defaultIndex = props.children.findIndex(elem => elem.props.default);
    this.handleClick = this.handleClick.bind(this);
    this.state = { active: defaultIndex > -1 ? defaultIndex : 0 };
  }

  componentDidUpdate() {
    // eslint-disable-next-line no-undef
    gadgets.window.adjustHeight();
  }

  handleClick(tabIndex) {
    this.setState({ active: tabIndex });
  }

  render() {
    const {
      props: { children },
      state: { active },
      handleClick
    } = this;
    return (
      <div className="tabber">
        <ul className="tab__nav">
          {children.map((elem, i) => (
            <li
              key={i}
              className={"tab " + (active === i ? "tab--active" : "")}
              onClick={() => handleClick(i)}
            >
              {elem.props.title}
            </li>
          ))}
        </ul>
        {children.map((elem, i) => {
          return (
            <div key={i} style={{ display: active === i ? "block" : "none" }}>
              {elem.props.children}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Tabber;
