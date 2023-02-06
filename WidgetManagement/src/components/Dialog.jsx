import React from "react";

class Dialog extends React.Component {
  constructor() {
    super();

    this.state = { show: true };
    this.close = this.close.bind(this);
  }

  componentDidUpdate(_, prevState) {
    if (!prevState.show) this.setState({ show: true });
  }

  close() {
    this.setState({ show: false });
    this.props.close();
  }

  render() {
    return !this.state.show ? null : (
      <div
        ref="dialog"
        className="jazz-ui-StyledBox sbBlue sbDark shadow jazz-ui-Dialog-absolute"
        style={{
          width: "80%",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)"
        }}
      >
        <div className="border">
          <div className="top left corner"></div>
          <div className="top right corner"></div>
          <div className="bottom left corner"></div>
          <div className="bottom right corner"></div>
          <div className="dock-north horizontal">
            <div className="top center"></div>
          </div>
          <div className="dock-south horizontal">
            <div className="bottom center">
              <div className="line"></div>
            </div>
          </div>
          <div className="shift down vertical horizontal">
            <div className="shift up vertical horizontal">
              <div className="left side vertical"></div>
              <div className="right side vertical">
                <div className="vertical line"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="background">
          <div className="jazz-ui-StyledBox-header hover">
            {this.props.title}
            <div className="jazz-ui-SimpleToolbar jazz-ui-StyledBox-buttons jazz-ui-SimpleToolbar-none">
              <div className="jazz-ui-SimpleToolbar-item">
                <a
                  className="jazz-ui-SimpleToolbar-button close"
                  title="Close"
                  onClick={this.close}
                >
                  <img
                    src="/ccm/web/dojo/resources/blank.gif?etag=bOoQXoE"
                    alt="Close"
                  />
                </a>
              </div>
            </div>
          </div>
          <div style={{ padding: "10px" }}>
            <iframe
              title="widget"
              frameBorder="0"
              width="100%"
              src={this.props.src}
              style={{ height: "80vh" }}
            ></iframe>
          </div>
        </div>
      </div>
    );
  }
}

export default Dialog;
