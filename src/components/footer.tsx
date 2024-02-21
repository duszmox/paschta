import React from "react";

function Footer() {
  return (
    <div className="flex min-h-[4vh] flex-col bg-light p-1 text-sm text-primary">
      <p className="ml-auto mr-auto">Paschta; - est. 2023</p>
      <p className="ml-auto mr-auto">
        Made with love, not with skill by{" "}
        <a className="underline" href="https://github.com/duszmox">
          duszmox
        </a>
      </p>
    </div>
  );
}

export default Footer;
