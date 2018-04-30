import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    data: {},
    images: {},
  }
  componentDidMount() {
    this.fetchFile()
  }
  fetchFile() {
    const fileId = "R5INIZqBn1LRwg5EPv05zcvq";
    const figmaToken = "988-b6e6e4f8-1705-4bcf-bcd6-0a62de9776e7";
    fetch(`https://api.figma.com/v1/files/${fileId}`, {
      headers: {
        "X-FIGMA-TOKEN": figmaToken
      }
    })
      .then(response => response.json())
      .then(res => {
        console.log(res)
        this.setState({ data: res})
      });
    // fetch(`https://api.figma.com/v1/images/${fileId}`, {
    //   headers: {
    //     "X-FIGMA-TOKEN": figmaToken
    //   }
    // })
    //   .then(response => response.json())
    //   .then(res => {
    //     this.setState({ images: res });
    //   });
  }

  rgbaConvert = (fill) => {
    if (fill.type === 'SOLID') {
      const { r, g, b, a } = fill.color
      return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
    } else {
      return 'none'
    }
  }

  renderFigmaFrame = (parent) => {
    return parent.children.map((child) => {
      const {
        id,
        name,
        type,
        children,
        absoluteBoundingBox,
        backgroundColor,
        fills,
        constraints
      } = child
      if (!children) {
        
        if (type === 'RECTANGLE') {
          if (parent.type !== 'FRAME') {
            return null
          }
          let verticalStyle = {}
          switch (constraints.vertical) {
            case 'TOP':
              verticalStyle = {
                height: absoluteBoundingBox.height,
                top: -parent.absoluteBoundingBox.y + absoluteBoundingBox.y
              };
              break;
            case 'BOTTOM':
              verticalStyle = {
                height: absoluteBoundingBox.height,
                bottom: (
                  parent.absoluteBoundingBox.y +
                  parent.absoluteBoundingBox.height +
                  -absoluteBoundingBox.y +
                  -absoluteBoundingBox.height
                )
              };
              break;
            case 'CENTER':
              verticalStyle = {
                height: absoluteBoundingBox.height,
                left: `calc(50% - ${absoluteBoundingBox.height}px/2 - ${
                  -absoluteBoundingBox.y +
                  -parent.absoluteBoundingBox.height / 2
                }px)`
              };
              break;
            case 'TOP_BOTTOM':
              verticalStyle = {
                top: (-parent.absoluteBoundingBox.y + absoluteBoundingBox.y),
                bottom: (
                  parent.absoluteBoundingBox.y +
                  parent.absoluteBoundingBox.height +
                  -absoluteBoundingBox.y +
                  -absoluteBoundingBox.height
                )
              }
              break;
            case 'SCALE':
              verticalStyle = {
                top: (-parent.absoluteBoundingBox.y + absoluteBoundingBox.y)/parent.absoluteBoundingBox.height * 100 + '%',
                bottom: (
                  (
                    parent.absoluteBoundingBox.y +
                    parent.absoluteBoundingBox.height +
                    -absoluteBoundingBox.y +
                    -absoluteBoundingBox.height
                   )/parent.absoluteBoundingBox.height * 100 + '%'
                )
              }
              break;
            default:
              break;
          }

          let horizontalStyle = {}
          switch (constraints.horizontal) {
            case 'LEFT':
              horizontalStyle = {
                left: -parent.absoluteBoundingBox.x + absoluteBoundingBox.x,
                width: absoluteBoundingBox.width,
              }
              break;
            case 'RIGHT':
              horizontalStyle = {
                right: (
                  parent.absoluteBoundingBox.x +
                  parent.absoluteBoundingBox.width +
                  -absoluteBoundingBox.x +
                  -absoluteBoundingBox.width
                ),
                width: absoluteBoundingBox.width,
              }
              break;
            case 'CENTER':
              horizontalStyle = {
                width: absoluteBoundingBox.width,
                left: `calc(50% - ${absoluteBoundingBox.width}px/2 - ${
                  parent.absoluteBoundingBox.x +
                  parent.absoluteBoundingBox.width / 2 +
                  -absoluteBoundingBox.x +
                  -absoluteBoundingBox.width / 2
                }px)`
              };
              break;
            case 'LEFT_RIGHT':
              horizontalStyle = {
                left: -parent.absoluteBoundingBox.x + absoluteBoundingBox.x,
                right: (
                  parent.absoluteBoundingBox.x +
                  parent.absoluteBoundingBox.width +
                  -absoluteBoundingBox.x +
                  -absoluteBoundingBox.width
                ),
              }
              break;
            case 'SCALE':
              horizontalStyle = {
                left: (
                  (-parent.absoluteBoundingBox.x + absoluteBoundingBox.x)/parent.absoluteBoundingBox.width * 100 + '%'
                ),
                right: (
                  (
                    parent.absoluteBoundingBox.x +
                    parent.absoluteBoundingBox.width +
                    -absoluteBoundingBox.x +
                    -absoluteBoundingBox.width
                  )/parent.absoluteBoundingBox.width * 100 + '%'
                )
              }
              break;
          
            default:
              break;
          }
          console.log(fills)
          return (
            <div
              key={id}
              className='rectangle'
              style={{
                position: 'absolute',
                ...verticalStyle,
                ...horizontalStyle,
                background: this.rgbaConvert(fills[0])
              }}
            />
          )
        }
      } else if (type === 'CANVAS') {
        return (
          <div
            key={id}
            className='canvas'
            style={{
              position: 'relative',
              background: '#eee'
            }}
          >
            {this.renderFigmaFrame(child)}
          </div>
        )
      } else if (type === 'FRAME') {
        return (
          <div
            key={id}
            className="frame"
            style={{
              position: "absolute",
              width: '100%',
              height: 'calc(100vh - 50px)',
              background: this.rgbaConvert(backgroundColor)
            }}
          >
            {this.renderFigmaFrame(child)}
          </div>
        );
      }
    })
    return null
  }
  render() {
    const { document } = this.state.data
    if (!document) {
      return null
    }
    return (
      <div>
        <button onClick={() => this.fetchFile()}>re-retch</button>
        <hr />
        {this.renderFigmaFrame(document)}
      </div>
    );
  }
}

export default App;
