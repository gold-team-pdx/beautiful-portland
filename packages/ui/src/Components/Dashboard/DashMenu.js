import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export default class DashMenu extends Component {
  state = {};
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const activeItem = this.state;

    return (
      <div className="dashMenu">
        <Menu vertical size="huge">
          <Menu.Item name="events">Events</Menu.Item>
          <Menu.Menu>
            <Menu.Item
              name="editEventTemplate"
              as={NavLink}
              active={activeItem === "editEventTemplate"}
              onClick={this.handleItemClick}
              to={"/EditEventTemplate"}
            >
              Edit Event Template
            </Menu.Item>
            <Menu.Item
              name="addEvent"
              as={NavLink}
              active={activeItem === "addEvent"}
              onClick={this.handleItemClick}
              to={"/AddEvent"}
            >
              Add Event
            </Menu.Item>
            <Menu.Item
              name="viewEvents"
              as={NavLink}
              active={activeItem === "viewEvents"}
              onClick={this.handleItemClick}
              to={"/ViewUpcomingEvents"}
            >
              View Upcoming Events
            </Menu.Item>
          </Menu.Menu>
          <Menu.Item
            name="volunteerList"
            as={NavLink}
            active={activeItem === "volunteerList"}
            onClick={this.handleItemClick}
            to={"/VolunteerList"}
          >
            Volunteer List
          </Menu.Item>
          <Menu.Item name="Images">Images</Menu.Item>
          <Menu.Menu>
            <Menu.Item
              name="editCarouselImages"
              as={NavLink}
              active={activeItem === "editCarouselImages"}
              onClick={this.handleItemClick}
              to={"/EditImages"}
            >
              Edit Front Page Images
            </Menu.Item>
            <Menu.Item
              name="viewAllImages"
              as={NavLink}
              active={activeItem === "viewAllImages"}
              onClick={this.handleItemClick}
              to={"/ViewImages"}
            >
              View All Images
            </Menu.Item>
          </Menu.Menu>
          <Menu.Item name="stories">Stories</Menu.Item>
          <Menu.Menu>
            <Menu.Item
              name="newStory"
              as={NavLink}
              active={activeItem === "newStory"}
              onClick={this.handleItemClick}
              to={"/CreateStory"}
            >
              Create Story
            </Menu.Item>
            <Menu.Item
              name="viewStories"
              as={NavLink}
              active={activeItem === "viewStories"}
              onClick={this.handleItemClick}
              to={"/ViewStories"}
            >
              View Stories
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}
