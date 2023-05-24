import { render, screen } from "@testing-library/react";

import { mockUser } from "~/mocks";

jest.mock("~/components/CreatePostWizard", () => ({
  CreatePostWizard: () => {
    return <div data-testid="CreatePostWizard" />;
  },
}));

jest.mock("~/components/PostsFeed", () => ({
  PostsFeed: () => {
    return <div data-testid="PostsFeed" />;
  },
}));

import Home from "~/pages/index";

describe("Home", () => {
  beforeEach(() => {
    mockUser.mockReset(); // Reset the mock before each test case
  });

  it("renders invalid user message if not available", () => {
    mockUser.mockReturnValue({ isSignedIn: false });

    render(<Home />);

    const CreatePostWizard = screen.queryByTestId("CreatePostWizard");
    const PostsFeed = screen.getByTestId("PostsFeed");

    expect(CreatePostWizard).toBeNull();
    expect(PostsFeed).toBeInTheDocument();
  });

  it("renders CreatePostWizard and PostsFeed, if user loaded", () => {
    mockUser.mockReturnValue({ isSignedIn: true });

    render(<Home />);

    const CreatePostWizard = screen.queryByTestId("CreatePostWizard");
    const PostsFeed = screen.getByTestId("PostsFeed");

    expect(CreatePostWizard).toBeInTheDocument();
    expect(PostsFeed).toBeInTheDocument();
  });
});
