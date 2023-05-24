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
    mockUser.mockReturnValue({ isLoaded: false, isSignedIn: false });

    render(<Home />);

    const element = screen.getByText("Invalid user");

    expect(element).toBeInTheDocument();
  });

  it("renders CreatePostWizard and PostsFeed, if user loaded", () => {
    mockUser.mockReturnValue({ isLoaded: true, isSignedIn: true });

    render(<Home />);

    const CreatePostWizard = screen.getByTestId("CreatePostWizard");
    const PostsFeed = screen.getByTestId("PostsFeed");

    expect(CreatePostWizard).toBeInTheDocument();
    expect(PostsFeed).toBeInTheDocument();
  });
});
