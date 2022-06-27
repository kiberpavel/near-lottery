import 'regenerator-runtime/runtime'
import React from 'react'
import './assets/css/global.css'
import {login, logout, pay_for_spin,get_paid_user} from './assets/js/near/utils'
import Lottery from "./components/Lottery";
import getConfig from './assets/js/near/config'


export default function App() {
    const [paid,setPaid] = React.useState(false);
    React.useEffect(
        () => {
            get_paid_user()
                .then(paidStatus => {
                    paidStatus !== null ? setPaid(paidStatus) : '';
                })
            getConfig(process.env.NODE_ENV);
        },
        [paid])

    const payForParticipation = async() => {
        try {
            await pay_for_spin();
            get_paid_user()
                .then(paidStatus => {
                    paidStatus !== null ? setPaid(paidStatus) : '';
                })
        } catch (e) {
            alert('Problems with payment');
            throw e
        }
    };

    if (!window.walletConnection.isSignedIn()) {
        return (
            <main>
                <h1>Welcome to fair lottery!</h1>
                <p>
                    You can try your luck in our lottery. Feel like you are in Las Vegas right now.
                </p>
                <p>
                    The rules are simple, you choose a number between one and ten.
                    If your number matches the winning number, then you get a prize.
                    The cost of the game is 1Near, you can win 2 Near. To start, press the authorization button
                </p>
                <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
                    <button onClick={login}>Sign in</button>
                </p>
            </main>
        )
    }

    if (paid) {
        return (
            <main>
                <Lottery setPaid={setPaid} />
            </main>
        )
    }

    return (
        <main>
            <p>To start the game, pay for your attempt</p>
            <button onClick={payForParticipation}>Pay</button>
            <button className="link" onClick={logout}>Sign out</button>
        </main>
    )
}
