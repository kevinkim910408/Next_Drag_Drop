import { Flex, Heading, Text, Button, Input } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

const Column = dynamic(() => import("../src/Column"), { ssr: false });

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  };

  return newColumn;
};

export default function Home() {
  const [state, setState] = useState(initialData);
  console.log(initialData.tasks[1].id);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // If user tries to drop in an unknown destination
    if (!destination) return;

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the user drops within the same column but in a different position
    const sourceCol = state.columns[source.droppableId];
    const destinationCol = state.columns[destination.droppableId];

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
      setState(newState);
      return;
    }

    // If the user moves from one column to another
    const startTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(destinationCol.taskIds);
    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };

    setState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex
        flexDir="column"
        bg="main-bg"
        minH="100vh"
        w="full"
        color="white-text"
        pb="2rem"
      >
        <Flex py="4rem" flexDir="column" align="center">
          <Heading fontSize="3xl" fontWeight={600}>
            Drag and Drop
          </Heading>
          <Text fontSize="20px" fontWeight={600} color="subtle-text">
            Next.js + Chakra + react-beautiful-dnd
          </Text>
        </Flex>

        <Flex justify="space-between" px="4rem">
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </Flex>
      </Flex>
    </DragDropContext>
  );
}

const initialData = {
  tasks: {
    1: { id: 1, content: "Pizza" },
    2: { id: 2, content: "Foie gras" },
    3: { id: 3, content: "Caviar" },
    4: { id: 4, content: "Bacon" },
    5: { id: 5, content: "Insects" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Lists",
      taskIds: [1, 2, 3, 4, 5],
    },
    "column-2": {
      id: "column-2",
      title: "I Don't Eat This even cannot put it in my mouse",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "Maybe I can put it in my mouse",
      taskIds: [],
    },
    "column-4": {
      id: "column-4",
      title: "I can chew a couple times",
      taskIds: [],
    },
    "column-5": {
      id: "column-5",
      title: "Hate, but okay to eat",
      taskIds: [],
    },
    "column-6": {
      id: "column-6",
      title: "Good",
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: [
    "column-1",
    "column-2",
    "column-3",
    "column-4",
    "column-5",
    "column-6",
  ],
};
