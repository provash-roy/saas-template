import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import React from "react";
import Container from "./Container";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className="w-full ">
      <Container>
        <nav className="flex justify-between items-center mx-8 p-4 gap-4 h-16">
          <div>TODO</div>
          <div>
            <Show when="signed-out">
              <div className="flex gap-2">
              
                <Button variant="outline">
                  <SignInButton />
                </Button>
                <Button>
                  <SignUpButton />
                </Button>
              </div>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </nav>
      </Container>
    </div>
  );
};

export default Navbar;
