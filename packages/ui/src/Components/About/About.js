import React, { Component } from 'react'
import { Accordion, Container, Header, Icon, Divider } from 'semantic-ui-react'
import '../Stylesheets/About.css'
import HomeLayout from '../Layouts/HomeLayout'
class About extends Component {
  state = {
    activeIndex: -1
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }
  render() {
    const { activeIndex } = this.state
    return (
      <HomeLayout>
        <div className="About">
          <Container>
            <div style={{ marginTop: '20px' }}>
              <Header as="h1">About Us</Header>
            </div>
            <Divider />
            <p>
              Ut et purus sapien. Nunc lacus elit, mollis vel eros non,
              consectetur faucibus magna. Pellentesque ornare dolor at sem
              commodo rutrum. Nunc nisl sapien, vulputate in massa et,
              vestibulum pharetra sapien. Pellentesque accumsan et nibh id
              aliquet. Vivamus finibus in urna vitae pharetra. Ut euismod neque
              euismod neque volutpat scelerisque. Ut feugiat fringilla viverra.
              Curabitur dui massa, facilisis eu pellentesque vel, viverra
              pharetra ex. Vestibulum porttitor quis sapien eget placerat.
              Quisque dignissim ultricies libero, sit amet dignissim nunc
              laoreet sed. Integer vitae aliquam dui, vitae efficitur sem. Nulla
              porta diam at lacus rutrum, id gravida ante euismod.
            </p>
            <Accordion>
              <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={this.handleClick}
              >
                <Icon name="dropdown" />
                Policies
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <p>
                  Ut dictum rhoncus mi. Sed venenatis tristique sem, sit amet
                  porta tellus. Nunc auctor vehicula erat ut feugiat. Praesent
                  tempus mollis elit vitae blandit. Suspendisse fermentum quam
                  nisi, in ornare massa blandit ac. Quisque mattis, neque
                  posuere elementum tincidunt, diam nulla scelerisque dolor, ac
                  ullamcorper justo purus vitae ligula. Lorem ipsum dolor sit
                  amet, consectetur adipiscing elit. Nam rhoncus posuere nisi
                  sed dictum. Pellentesque imperdiet urna dictum massa ornare
                  euismod. Nunc fermentum interdum purus, eget consequat ex
                  varius sed. Quisque sed consequat odio, sit amet viverra
                  dolor.
                </p>
                <p>
                  To learn more about our policies visit{' '}
                  <a
                    href="http://google.com"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    here
                  </a>
                </p>
              </Accordion.Content>

              <Accordion.Title
                active={activeIndex === 1}
                index={1}
                onClick={this.handleClick}
              >
                <Icon name="dropdown" />
                Financials
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 1}>
                <p>
                  Ut dictum rhoncus mi. Sed venenatis tristique sem, sit amet
                  porta tellus. Nunc auctor vehicula erat ut feugiat. Praesent
                  tempus mollis elit vitae blandit. Suspendisse fermentum quam
                  nisi, in ornare massa blandit ac. Quisque mattis, neque
                  posuere elementum tincidunt, diam nulla scelerisque dolor, ac
                  ullamcorper justo purus vitae ligula. Lorem ipsum dolor sit
                  amet, consectetur adipiscing elit. Nam rhoncus posuere nisi
                  sed dictum. Pellentesque imperdiet urna dictum massa ornare
                  euismod. Nunc fermentum interdum purus, eget consequat ex
                  varius sed. Quisque sed consequat odio, sit amet viverra
                  dolor.
                </p>
                <p>
                  To learn more about our financials visit{' '}
                  <a
                    href="http://google.com"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    here
                  </a>
                </p>
              </Accordion.Content>

              <Accordion.Title
                active={activeIndex === 2}
                index={2}
                onClick={this.handleClick}
              >
                <Icon name="dropdown" />
                History
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 2}>
                <p>
                  Ut dictum rhoncus mi. Sed venenatis tristique sem, sit amet
                  porta tellus. Nunc auctor vehicula erat ut feugiat. Praesent
                  tempus mollis elit vitae blandit. Suspendisse fermentum quam
                  nisi, in ornare massa blandit ac. Quisque mattis, neque
                  posuere elementum tincidunt, diam nulla scelerisque dolor, ac
                  ullamcorper justo purus vitae ligula. Lorem ipsum dolor sit
                  amet, consectetur adipiscing elit. Nam rhoncus posuere nisi
                  sed dictum. Pellentesque imperdiet urna dictum massa ornare
                  euismod. Nunc fermentum interdum purus, eget consequat ex
                  varius sed. Quisque sed consequat odio, sit amet viverra
                  dolor.
                </p>
                <p>
                  To learn more about our history visit{' '}
                  <a
                    href="http://google.com"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    here
                  </a>
                </p>
              </Accordion.Content>
            </Accordion>
          </Container>
        </div>
      </HomeLayout>
    )
  }
}
export default About
