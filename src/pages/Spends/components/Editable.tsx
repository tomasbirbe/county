import { Box, Button, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";

const Editable = ({ defaultValue }) => {
  const [isEditing, setIsEditing] = useState(false);

  function openEdit() {
    setIsEditing(true);
  }

  function closeEdit() {
    setIsEditing(false);
  }

  function onEnter(e) {
    if (e.key === "Escape") {
      closeEdit();
    }
  }

  return (
    <>
      {isEditing ? (
        <Input
          autoFocus
          defaultValue={defaultValue}
          type="text"
          onBlur={closeEdit}
          onKeyDown={onEnter}
        />
      ) : (
        <Text>{defaultValue}</Text>
      )}
      <Button type="button" onClick={openEdit}>
        Editar
      </Button>
    </>
  );
};

export default Editable;
