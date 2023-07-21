import React from "react";


export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text-copyright">&copy; {new Date().getFullYear()} Mesto Russia</p>
    </footer>
  );
}