import { useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { silentJSON } from "./FetchRoutines";
function Purchases() {
    useEffect(() => { getPurchases() }, []);
    const jwt = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [profile, setProfile] = useState();


    function getProfile(s) {
        const headers = { "Authorization": "Bearer " + jwt };

        fetch(`http://localhost:8085/profile/${s.buyer}`, { method: "GET", headers: headers }).then(silentJSON)
            .then(response => { setProfile(response) });
    }

    function getPurchases() {
        const headers = { "Authorization": "Bearer " + jwt };

        fetch("http://localhost:8085/purchase/forseller", { method: "GET", headers: headers }).then(silentJSON)
            .then(response => { setItems(response) });

    }
    function Itemsdiv() {
        return (
            <div style={{ padding: '10px' }}>
                <h3> Purchase Requests</h3>
                <table>
                    <thead>
                        <tr>
                            <th style={{ padding: '40px' }}>Item</th>
                            <th style={{ padding: '40px' }}>Buyer </th>
                            <th style={{ padding: '40px' }}>Time </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(s => { return (<Itemstable key={s.idpurchase} s={s} itemremove={ItemRemove} process={ProcessPurchase} />); })}
                    </tbody>
                </table>
            </div>
        )

    }
    function Itemstable({ s, itemremove, process }) {
        return (
            <tr>
                <td style={{ padding: '40px' }}>{s.item}</td>
                <td style={{ padding: '40px' }}>{s.buyer}</td>
                <td style={{ padding: '40px' }}>{s.time}</td>
                <td>
                    <Process item={s} doProcess={process}></Process>
                </td>
                <td>
                    <Remove item={s} doRemove={itemremove}></Remove>
                </td>

            </tr>
        )

    }
    function Process({ item, doProcess }) {
        const action = () => doProcess(item);
        return (
            <>
                <button onClick={action}>Process & Ship</button>
            </>
        )
    }
    function Remove({ item, doRemove }) {
        const action = () => doRemove(item);
        return (
            <>
                <button onClick={action}>Delete</button>
            </>
        )
    }
    function ProcessPurchase(n) {
        const headers = { "Authorization": "Bearer " + jwt };

        fetch(`http://localhost:8085/purchase/ship/${n.idpurchase}`, { method: "GET", headers: headers })
            .then(getPurchases);

    }
    function ItemRemove(n) {
        const headers = { "Authorization": "Bearer " + jwt };

        fetch(`http://localhost:8085/purchase/${n.idpurchase}`, { method: "DELETE", headers: headers }).then(() => getPurchases());

    }
    if (jwt.length == 0)
        return (
            <p>You are not logged in to your account.</p>
        );
    else
        return (
            <>
                <Itemsdiv></Itemsdiv>
                
            </>

        );
}

export default Purchases;