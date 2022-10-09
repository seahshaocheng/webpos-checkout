import React from "react";
import { Link } from "react-router-dom";

export const DemoHome = () => {
  return (
    <div className="container">
            <div className="text-center">
                <div className="d-flex flex-md-row flex-column justify-content-center">
                    <div className="card m-2">
                        <div className="card-body">
                            <h5 class="card-title">Bar Counter</h5>
                            <p class="card-text">For Bar Counter Order</p>
                            <Link to="/industry-demo" className="stretched-link"></Link>
                        </div>
                    </div>
                    <div className="card m-2">
                        <div className="card-body">
                            <h5 class="card-title">Endless Aisle</h5>
                            <p class="card-text">Unified Commerce demo of scan and go</p>
                            <Link to="/endless-ailse" className="stretched-link"></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
}
