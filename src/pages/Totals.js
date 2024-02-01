import React, { useState , useEffect} from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchTodayOrders } from "../app/paymentSlice";

import moment from 'moment';


export const Totals = () => {
    
    const dispatch = useDispatch();
    const [totalOrderCount, setTotalOrderCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [paymentMethodBreakdown, setPaymentMethodBreakdown] = useState([]);//[{"method":"card","count":0,"total":0},{"method":"paypal","count":0,"total":0},{"method":"ideal","count":0,"total":0}
    const ordersToday = useSelector((state) => state.payment.todayorder);

    useEffect(() => {
        dispatch(fetchTodayOrders());
    }, []);

    useEffect(() => {
        let total = 0;
        let count = 0;
        if(ordersToday.length>0){
            console.log(ordersToday);
            for(let i=0;i<ordersToday.length;i++){
                console.log(ordersToday[i]); 
                count += 1;
                total += ordersToday[i].amount;

                //check if payment method is in the breakdown
                let index = paymentMethodBreakdown.findIndex((el) => el.method === ordersToday[i].paymentMethod);
                //if it is, update the count and total else set new
                if(index !== -1){
                    paymentMethodBreakdown[index].count += 1;
                    paymentMethodBreakdown[index].total += ordersToday[i].amount;
                }
                else{
                    paymentMethodBreakdown.push({"method":ordersToday[i].paymentMethod,"count":1,"total":ordersToday[i].amount});
                }
            }
        }
        setTotal(total);
        setTotalOrderCount(count);
    }, [ordersToday]);

    return (
        <div>
            <h1>Today's Orders</h1>
            <span>date: {moment.utc().format("YYYY-MM-DD")}</span>
            <hr></hr>
            <h4>Payment Method Breakdown</h4>
            <ul>
                {paymentMethodBreakdown.map((el) => (
                    <li key={el.method}>{el.method} - Count: {el.count} - Total: {el.total.toLocaleString('en-US', { style: 'currency', currency: 'SGD' })}</li>
                ))}
            </ul>
            <hr></hr>
            <b>Total Orders: {totalOrderCount}</b><br/>
            <b>Total: {total.toLocaleString('en-US', { style: 'currency', currency: 'SGD' })}</b>
        </div>
    );

}