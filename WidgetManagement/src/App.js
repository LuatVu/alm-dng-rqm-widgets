import React from "react";
import ReactDOM from "react-dom";
import Tabber from "./components/Tabber";
import Button from "./components/Button";
import Dialog from "./components/Dialog";
import Bookmark from "./utils/bookmark";
import "./App.css";

const Tools = window.wmTools;
const { origin, pathname } = window.top.location;
// const ENVIRONMENTS = ["non-ps-ec","ps-ec", "ps-xs", "_cc"];
const SERVERS = [
  { path: "/ccm", name: "RTC" },
  { path: "/rm", name: "DNG" },
  { path: "/qm", name: "RQM" },
  { path: "/gc", name: "GCM" }
];
const CURRENT_SERVER = SERVERS.find(server => pathname.includes(server.path));

class App extends React.Component {
  initTools = Tools.filter(tool =>
    tool.tags.includes(CURRENT_SERVER.name.toLowerCase())
  );
  holderId = "wm-dialogHolder";

  constructor() {
    super();
    this.reload = this.reload.bind(this);
    this.search = this.search.bind(this);
    this.open = this.open.bind(this);
    this.back = this.back.bind(this);
    this.load = this.load.bind(this);
    this.updateFavorite = this.updateFavorite.bind(this);

    // Initialize dialog holder
    const { body } = window.top.document;
    if (!body.querySelector(`#${this.holderId}`)) {
      const dialogHolder = document.createElement("div");
      dialogHolder.id = this.holderId;
      dialogHolder.style.cssText = [
        "display: none; position: fixed",
        "top: 0; bottom: 0",
        "left: 0; right: 0",
        "background: rgba(0, 0, 0, 0.3)",
        "z-index: 9999"
      ].join(";");
      body.appendChild(dialogHolder);
    }

    // Version checking
    const KEY = "wmVersions";
    const cachedVersions = localStorage.getItem(KEY);
    const parsedVersions = cachedVersions ? JSON.parse(cachedVersions) : [];
    const index = parsedVersions.findIndex(version =>
      this.initTools.find(
        tool => tool.id === version.key && tool.version !== version.value
      )
    );

    // Cache versions
    const versions = this.initTools.map(tool => {
      return { key: tool.id, value: tool.version };
    });
    localStorage.setItem(KEY, JSON.stringify(versions));

    this.state = {
      isLatest: index === -1,
      // tools: this.initTools.filter(tool => tool.tags.includes(ENVIRONMENTS[0])),
      tools: this.initTools,
      favTools: this.initTools.filter(tool => Bookmark.get().includes(tool.id))
    };
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    gadgets.window.adjustHeight();
  }

  componentDidUpdate() {
    // eslint-disable-next-line no-undef
    gadgets.window.adjustHeight();
  }

  search() {
    this.setState({
      tools: this.initTools.filter(
        tool =>
          tool.tags.toLowerCase().includes(this.refs.environment.value) &&
          tool.name.toLowerCase().includes(this.refs.search.value)
      )
    });
  }

  open(tool) {
    const src = [
      `${origin +
        CURRENT_SERVER.path}/gadgetRender?container=default`,
      `parent=${encodeURIComponent(origin)}`,
      `url=${encodeURI(tool.url)}`,
      "lang=default",
      "country=default",
      "view=default",
      "nocache=true",
      "st=HGH81HC%3Anull"
      // `time=${Date.now()}` // for clearing cache
    ].join("&");

    if (tool.dialogSupport) {
      const { body } = window.top.document;
      const dialogHolder = body.querySelector(`#${this.holderId}`);
      ReactDOM.render(
        <Dialog
          title={tool.name}
          src={src}
          close={() => {
            this.back();
            dialogHolder.style.display = "none";
          }}
        />,
        dialogHolder
      );
      dialogHolder.style.display = "";
    }

    this.setState({
      activeTool: {
        id: tool.id,
        name: tool.name,
        dialogSupport: tool.dialogSupport,
        src
      }
    });
  }

  back() {
    clearInterval(this.state.activeTool.interval);
    this.setState({ activeTool: null });
  }

  reload() {
    const { widget } = this.refs;
    if (widget) {
      clearInterval(this.state.activeTool.interval);
      this.refs.loading.style.display = "";
      widget.contentWindow.location.reload();
    } else window.location.reload();
  }

  load({ target }) {
    this.refs.loading.style.display = "none";
    const { contentWindow, contentDocument } = target;
    // window.top.onhashchange = () => contentWindow.location.reload();
    window.top.addEventListener("hashchange", () => { 
      contentWindow.location.reload();
    });

    // trick for fitting iframe height to content
    let lastHeight;
    const interval = setInterval(() => {
      const height = contentDocument.body.scrollHeight;
      if (height !== lastHeight) {
        target.style.height = height;
        lastHeight = height;
        this.setState({
          activeTool: { ...this.state.activeTool, interval }
        });
      }
    }, 1);
  }

  updateFavorite() {
    this.setState({
      favTools: this.initTools.filter(tool => Bookmark.get().includes(tool.id))
    });
  }

  render() {
    const { isLatest, tools, favTools, activeTool } = this.state;
    return (
      <div>
        <div className="header">
          {activeTool ? (
            <div>{activeTool.name}</div>
          ) : (
            <div> 
              {/* Environment:&nbsp;
              <select onChange={this.search} ref="environment">
                {ENVIRONMENTS.map((env, i) => (
                  <option key={i} value={env}>
                    {env.toUpperCase()}
                  </option>
                ))}
              </select> */}
              Server: <strong>{CURRENT_SERVER.name}</strong>
            </div>
          )}
          <div className="controls">
            <button
              className="control control--back"
              title="Back"
              disabled={activeTool === null}
              onClick={this.back}
            ></button>
            <button
              className="control control--refresh"
              title="Reload widget"
              onClick={this.reload}
            ></button>
          </div>
        </div>
        {!isLatest ? (
          <div className="alert alert--warning">
            You are not using the latest version of the Widget Management.
            Please clear browser cache to receive update (
            <a
              href="https://inside-docupedia.bosch.com/confluence/x/beE_Sg"
              rel="noopener noreferrer"
              target="_blank"
            >
              How-to
            </a>
            )
          </div>
        ) : null}
        {activeTool ? (
          activeTool.dialogSupport ? (
            <div className="alert alert--info">
              Widget is opened in a Dialog
            </div>
          ) : (
            <div>
              <div ref="loading" className="alert alert--info">
                Loading widget...
              </div>
              <iframe
                ref="widget"
                frameBorder="0"
                width="100%"
                title={activeTool.name}
                src={activeTool.src}
                onLoad={this.load}
              ></iframe>
            </div>
          )
        ) : (
          <Tabber>
            <div title="Favorites">
              {favTools.length > 0 ? (
                favTools.map((tool, i) => (
                  <Button key={i} tool={tool} click={() => this.open(tool)} />
                ))
              ) : (
                <div className="muted">No widget added</div>
              )}
            </div>
            <div title="All Tools" default={!favTools.length ? true : false}>
              <input
                className="search"
                placeholder="Search..."
                ref="search"
                style={{ width: "100%" }}
                onKeyUp={this.search}
              />
              {tools.map((tool, i) => (
                <Button
                  key={i}
                  tool={tool}
                  click={() => this.open(tool)}
                  bookmark={this.updateFavorite}
                />
              ))}
            </div>
          </Tabber>
        )}
      </div>
    );
  }
}

export default App;
