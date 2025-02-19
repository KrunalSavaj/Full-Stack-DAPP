import React from "react";
import Link from "next/link";
// INTERNAL IMPORT
import Style from "./Logo.module.css";

const Logo = () => {
  return (
    <div class={Style.spinner}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};


export default Logo;