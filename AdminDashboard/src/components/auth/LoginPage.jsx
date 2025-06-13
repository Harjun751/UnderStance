import { useState } from 'react'
import "./LoginPage.css";
import LoginButton from "./LoginButton";
import Title from "../general/Title";

export default () => {
  return (
    <div id="login">
        <img id="hero" src="../../../src/assets/hdb.jpg" alt="Singapore Apartment Buildings" />
        <form>
            <Title />
            <div class="input-group">
                <label for="email">Email</label>
                <input name="email" id="email" type="email" placeholder="email@email.com"/>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input name="password" id="password" placeholder="sick-password" type="password" />
           </div>
           <div class="input-group checkbox">
                <label for="remember-me">Remember me: </label>
                <input type="checkbox" name="remember-me" id="remember-me" />
           </div>
           <div class="input-group">
                <LoginButton />
           </div>
           <div class="input-group">
            <a href="/">Reset Password</a>
              </div>
        </form>
    </div>
  );
}
