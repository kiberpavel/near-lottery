import React, {useState} from 'react';
import {send_prize, remove_user} from '../assets/js/near/utils'
import LoadingSpinner from "./LoadingSpinner";
import LotteryItem from "./LotteryItem";
import './index.css';

const Lottery = ({setPaid}) => {
    const [winNum, setWinNum] = useState(null);
    const [num, setNum] = useState(null);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    let numbers = [1,2,3,4,5,6,7,8,9,10];

    const handleClick = () => {
        sendPrize();
        setTimeout(() => {removeRecord();},8000);
    }

    const checkSelectTicket = (number) => {
        return Number(number) === Number(num)
    };

    const sendPrize = async () => {
        try {
            setLoading(true);
            let successNum = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
            setWinNum(successNum);
            await send_prize(Number(num),successNum);
            // setPaid(false);
            setFinished(true);
            console.log('succes send');
            setTimeout(() => {setLoading(false);},1000);
            // alert('Success');
        }catch (e) {
            alert('send troubles');
            throw e
        }
    }

    const removeRecord = async () => {
        try {
            await remove_user();
            setPaid(false);
            console.log('good remove');
        } catch (e) {
            alert('remove troubles');
            throw e
        }
    }

    const checkPoints = () => {
        return num == winNum
    }

    return (
        <div>
            {loading ?
                <section>
                    <LoadingSpinner />
                    <p className="load-title">Loading</p>
                </section> :
                <section>
                    <section className="lottery-wrap" onChange={(e) => setNum(e.target.value)}>
                        {numbers.map((number) => (
                            <LotteryItem
                                item={number}
                                key={number}
                                selected={checkSelectTicket(number)}
                                finished={finished}
                                winNum={winNum}
                                num={num}
                            />
                        ))}
                    </section>
                    {finished ?
                        checkPoints() ?
                            <p className="finish-text">Congratulations, you won, we sent the prize to your wallet</p> :
                            <p className="finish-text">Oops you lost</p> :
                        ''}
                    {!finished ? <button className="game-button" onClick={handleClick}>Start game</button> : ''}
                </section>}
        </div>
    );
};

export default Lottery;