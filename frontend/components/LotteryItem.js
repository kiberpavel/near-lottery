import React, {useEffect, useState} from 'react';
import classNames from 'classnames';

const LotteryItem = ({ item,selected, finished, winNum, num }) => {

    const[programSelected, setProgramSelected] = useState(false);
    const [great, setGreat] = useState(false)

    useEffect(() => {
        winNum == item ? setProgramSelected(true) : setProgramSelected(false)
        winNum != null ? setGreat(true) : setGreat(false)
        num != null ? setGreat(true) : setGreat(false)
        finished ? setGreat(true) : setGreat(false)
        winNum == num  ? setGreat(true) : setGreat(false)
    });

    const checkForSelectTicket = () => {
        return selected && !great
    }

    const checkForWinTicket = () => {
        return !great && programSelected
    }

    const checkForDoubleWinTicket = () => {
        return great && programSelected
    }

    return (
        <div className={classNames('ticker-wrap',
            {'win_double_ticket' : checkForDoubleWinTicket() === true },
            {'select-ticket' : checkForSelectTicket() === true},
            {'win_ticket' : checkForWinTicket() === true}
        )}>
            {!finished ? <input type="radio" name="tickets" value={item} /> : ''}
            <p>{item}</p>
        </div>
    );
};

export default LotteryItem;