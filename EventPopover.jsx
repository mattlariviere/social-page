import React, { useState } from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";

const EventPopover = props => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <div>
      <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
        <PopoverHeader>{props.selectedMarker.name}</PopoverHeader>
        <PopoverBody>
          {props.selectedMarker.summary}
          {props.selectedMarker.dateStart} - {props.selectedMarker.dateEnd}
        </PopoverBody>
      </Popover>
    </div>
  );
};

export default EventPopover;
