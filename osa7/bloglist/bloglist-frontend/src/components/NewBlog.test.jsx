import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NewBlog from "./NewBlog";
import userEvent from "@testing-library/user-event";

test("<NewBlog/> updates parent state and calls onSubmit", async () => {
  const newBlog = jest.fn();
  const user = userEvent.setup();

  render(<NewBlog newBlog={newBlog} />);

  const titleInput = screen.getByPlaceholderText("write title here");
  const authorInput = screen.getByPlaceholderText("write author here");
  const urlInput = screen.getByPlaceholderText("write url here");
  const sendButton = screen.getByText("create");

  await user.type(titleInput, "title");
  await user.type(authorInput, "author");
  await user.type(urlInput, "http://localhost.com");
  await user.click(sendButton);

  expect(newBlog.mock.calls).toHaveLength(1);
  console.log(newBlog.mock.calls[0][0]);
  expect(newBlog.mock.calls[0][0].title).toBe("title");
  expect(newBlog.mock.calls[0][0].author).toBe("author");
  expect(newBlog.mock.calls[0][0].url).toBe("http://localhost.com");
});
