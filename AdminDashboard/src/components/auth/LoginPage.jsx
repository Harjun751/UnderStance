import { useState } from 'react'
import "./LoginPage.css";

export default () => {
  return (
    <div id="login">
        <img id="hero" src="../../../src/assets/hdb.jpg" />
        <form>
            <h1 id="title">
                <span>Under</span>
                <span color="var(--red)">Stance</span>
            </h1>
            <label for="email">Email</label>
            <input name="email" id="email" placeholder="email@email.com"/>
            <label for="password">Password</label>
            <input name="password" id="password" placeholder="sick-password"/>
        </form>
    </div>
  );
}
