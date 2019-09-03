import React, { Component } from 'react';

import classnames from 'classnames';
import delay    from 'lodash.delay';
import debounce from 'lodash.debounce';

class Accordion extends Component {
  render() {

    const { data, showBellow, slideDuration } = this.props;
    let i = 0;

    const bellows = data.map((bellow) => {
      i ++;
      let openOnLoad = false;

      switch(typeof showBellow) {
        case 'number':
          openOnLoad = i === showBellow;
          break;
        case 'object':
          openOnLoad = showBellow.includes(i);
          break;
        case 'string':
          openOnLoad = showBellow === 'all';
          break;
        default:
          break;
      }

      return (
        <Bellow
          key={bellow.id}
          openOnLoad={openOnLoad}
          slideDuration={slideDuration}
          title={bellow.title}
          image={bellow.image}
          text={bellow.text}
          />
      )
    });

    return(
      <div className="accordion">
        { bellows }
      </div>
    )
  }
}

export default Accordion;

class Bellow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isMeasuring: false,
      isAnimating: false,
      elementHeight: 0,
      inlineStyle: {}
    }

    this.measureElement = this.measureElement.bind(this);
    this.openBellowOnLoad = this.openBellowOnLoad.bind(this);
    this.imageOnLoad = this.imageOnLoad.bind(this);
    this.toggleBellow = this.toggleBellow.bind(this);
    this.measureAfterResize = debounce(this.measureAfterResize, 500);
  }

  componentDidMount() {
    this.measureElement();
    this.openBellowOnLoad();

    window.addEventListener('resize', this.measureAfterResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureAfterResize);
  }

  measureElement() {
    if(this.bellow === null || this.bellow === undefined) {
      return;
    }

    this.setState({ isMeasuring: true, elementHeight: {} });

    // delay of 1 millisecond because bellow has to be rendered in open state before measuring it
    delay(() => {
      this.setState({ isMeasuring: false, elementHeight: Math.round(this.bellow.clientHeight) });
      if(this.state.isOpen) {
        this.setState({ inlineStyle: { maxHeight : this.state.elementHeight }})
      }
    }, 1);
  }

  measureAfterResize = () => {
    this.measureElement();
  }

  // in case bellow is meant to be opened on page load
  openBellowOnLoad () {
    if(this.props.openOnLoad) {
      this.setState({ isOpen: true, isAnimating: false, inlineStyle: { maxHeight: this.state.elementHeight } });
    }
  }

  // in case the bellows contain images, do the measurements again after image has been loaded
  // the bellows will most likely have different measurements now
  imageOnLoad() {
    delay(() => {
      this.measureElement();
      this.openBellowOnLoad();
    }, 10);
  }

  toggleBellow() {

    const slideDuration = this.props.slideDuration || 900;

    // refuse to slide up or down if the bellow is animating or being measured
    if(this.state.isAnimating || this.state.isMeasuring) {
      return;
    }

    if(this.state.isOpen) {
      this.setState({ isOpen: false, isAnimating: true, inlineStyle: { maxHeight: 0 } });
    }
    else {
      this.setState({ isOpen: true, isAnimating: true, inlineStyle: { maxHeight: this.state.elementHeight } });
    }

    // animation is done.
    delay(() => {
      this.setState({ isAnimating: false });
    }, slideDuration);
  }

  render() {

    const { title, text, image } = this.props;
    const { isOpen, isMeasuring, isAnimating } = this.state;

    return (
      <div className="accordion__bellow">
        <div className="accordion__title" onClick={this.toggleBellow}>{ title }
          <span className={classnames({ 'accordion__arrow': true, 'accordion__arrow--toggled': isOpen })} />
        </div>
        <div className={classnames({ 'accordion__content': true,
                                     'accordion__content--measuring': isMeasuring,
                                     'accordion__content--open': isOpen,
                                     'accordion__content--closed': !isOpen && !isMeasuring,
                                     'accordion__content--animating': isAnimating})}
             ref={el => this.bellow = el}
             style={this.state.inlineStyle}>
          <div className="accordion__text">{ text }</div>
          { image
            ? <div className="accordion__image">
                 <img src={image} alt={title} onLoad={this.imageOnLoad} />
              </div>

            : null
          }
        </div>
      </div>
    )
  }
}
