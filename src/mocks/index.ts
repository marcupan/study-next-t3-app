export const mockUser = jest.fn();

jest.mock("@clerk/nextjs", () => ({
  ...jest.requireActual<object>("@clerk/nextjs"),
  useUser: mockUser,
}));
