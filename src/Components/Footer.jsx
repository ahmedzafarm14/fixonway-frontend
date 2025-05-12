import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-indigo-900 text-indigo-300 py-6 text-center text-sm">
        &copy; {new Date().getFullYear()} Fixonway. All rights reserved. <br />
        <span className="block mt-2 text-xs">
          Fixonway is a platform to connect service providers and seekers. We do
          not provide services ourselves.
        </span>
      </footer>
    </>
  );
};

export default Footer;
