import React, { useState , useEffect} from "react";

export const CartTable = ({
    cartData
  }) => {
  return (
    <div>
      {cartData.length > 0 ? (
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Product Name</th>
              <th scope="col">Qty</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          {cartData.map((data, i) => (
            <tbody key={i}>
              <tr>
                <th scope="row">{data.id}</th>
                <td>{data.name}</td>
                <td>{data.qty}</td>
                <td>{data.price.value}</td>
              </tr>
            </tbody>
          ))}
        </table>
      ) : null}
    </div>
  );
}