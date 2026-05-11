import { UserButton } from "@clerk/nextjs";
export function UserIconButton() {
  return (
    <UserButton
      appearance={{
        elements: {
          userButtonTrigger: {
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:focus": {
              boxShadow: "none",
            },
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
          userButtonAvatarBox: {
            backgroundColor: "transparent",
          },
          userButtonAvatarImage: {
            content: "url('./person.svg')",
          },
        },
      }}
    />
  );
}
